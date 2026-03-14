import { performance } from 'node:perf_hooks';

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toUrlEncoded(payload) {
  return new URLSearchParams(
    Object.entries(payload).map(([key, value]) => [key, String(value ?? '')])
  ).toString();
}

function parseSetCookie(setCookieValue) {
  if (!setCookieValue) return [];

  // Split cookie header while preserving commas in Expires.
  const chunks = [];
  let token = '';
  let inExpires = false;

  for (let i = 0; i < setCookieValue.length; i += 1) {
    const char = setCookieValue[i];
    const next = setCookieValue.slice(i, i + 8).toLowerCase();

    if (next === 'expires=') {
      inExpires = true;
    }

    if (char === ';' && inExpires) {
      inExpires = false;
    }

    if (char === ',' && !inExpires) {
      chunks.push(token.trim());
      token = '';
      continue;
    }

    token += char;
  }

  if (token.trim()) {
    chunks.push(token.trim());
  }

  return chunks;
}

export class CookieJar {
  constructor() {
    this.cookies = new Map();
  }

  absorb(headers) {
    if (!headers) return;

    let setCookies = [];
    if (typeof headers.getSetCookie === 'function') {
      setCookies = headers.getSetCookie();
    } else {
      const single = headers.get('set-cookie');
      if (single) {
        setCookies = parseSetCookie(single);
      }
    }

    for (const cookieLine of setCookies) {
      const firstPart = cookieLine.split(';')[0];
      const eqIndex = firstPart.indexOf('=');
      if (eqIndex <= 0) continue;
      const name = firstPart.slice(0, eqIndex).trim();
      const value = firstPart.slice(eqIndex + 1).trim();
      if (!name) continue;
      this.cookies.set(name, value);
    }
  }

  headerValue() {
    if (this.cookies.size === 0) return '';
    return [...this.cookies.entries()]
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');
  }
}

export async function requestWithCookies(baseUrl, path, options, jar) {
  const headers = new Headers(options?.headers || {});
  const cookieHeader = jar.headerValue();
  if (cookieHeader) {
    headers.set('cookie', cookieHeader);
  }

  const started = performance.now();
  const response = await fetch(new URL(path, baseUrl), {
    ...options,
    headers,
    redirect: options?.redirect || 'manual',
  });
  const durationMs = performance.now() - started;
  jar.absorb(response.headers);

  return { response, durationMs };
}

export async function signupUser({ baseUrl, name, email, password, phone }) {
  const payload = { name, email, password, phone };
  const response = await fetch(new URL('/api/user/signup', baseUrl), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await response.json().catch(() => ({}));
  return {
    ok: response.ok && json?.success !== false,
    alreadyRegistered: typeof json?.message === 'string' && json.message.toLowerCase().includes('already'),
    status: response.status,
    body: json,
  };
}

export async function loginWithCredentials({ baseUrl, email, password, jar }) {
  const csrfReq = await requestWithCookies(baseUrl, '/api/auth/csrf', { method: 'GET' }, jar);
  if (!csrfReq.response.ok) {
    throw new Error(`CSRF request failed: ${csrfReq.response.status}`);
  }
  const csrfData = await csrfReq.response.json();
  const csrfToken = csrfData?.csrfToken;
  if (!csrfToken) {
    throw new Error('Missing csrfToken from /api/auth/csrf');
  }

  const body = toUrlEncoded({
    csrfToken,
    email,
    password,
    callbackUrl: `${baseUrl}/dashboard`,
    json: 'true',
  });

  const loginReq = await requestWithCookies(
    baseUrl,
    '/api/auth/callback/credentials',
    {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
    },
    jar
  );

  const text = await loginReq.response.text();
  const isLikelySuccess = loginReq.response.status < 400 && !/error/i.test(text);

  if (!isLikelySuccess) {
    throw new Error(`Login failed (${loginReq.response.status}): ${text.slice(0, 180)}`);
  }

  return {
    csrfMs: csrfReq.durationMs,
    loginMs: loginReq.durationMs,
  };
}

function buildSectionAnswers(questions, rng = Math.random) {
  const sectionAnswers = {};

  for (const q of questions) {
    const optionCount = Array.isArray(q.options) ? q.options.length : 0;
    if (!q?._id || !q?.section || optionCount <= 0) continue;
    const answer = Math.floor(rng() * optionCount);

    if (!sectionAnswers[q.section]) {
      sectionAnswers[q.section] = {};
    }
    sectionAnswers[q.section][String(q._id)] = answer;
  }

  return sectionAnswers;
}

function summarizeSectionCounts(sectionAnswers) {
  return Object.fromEntries(
    Object.entries(sectionAnswers).map(([section, answers]) => [section, Object.keys(answers || {}).length])
  );
}

export async function runSingleUserMockFlow({
  baseUrl,
  shareCode,
  email,
  password,
  name,
  phone,
  sendProctoringEvents = true,
  thinkTimeMs = 25,
}) {
  const jar = new CookieJar();
  const timeline = [];
  const addStep = (step, ms, extra = {}) => timeline.push({ step, ms: Math.round(ms), ...extra });

  const signup = await signupUser({ baseUrl, name, email, password, phone });
  addStep('signup', 0, { status: signup.status, alreadyRegistered: signup.alreadyRegistered });

  const loginMetrics = await loginWithCredentials({ baseUrl, email, password, jar });
  addStep('auth.csrf', loginMetrics.csrfMs);
  addStep('auth.login', loginMetrics.loginMs);

  const quizReq = await requestWithCookies(baseUrl, `/api/quiz/${shareCode}`, { method: 'GET' }, jar);
  addStep('quiz.fetch', quizReq.durationMs, { status: quizReq.response.status });
  if (!quizReq.response.ok) {
    const errText = await quizReq.response.text();
    throw new Error(`quiz.fetch failed (${quizReq.response.status}): ${errText.slice(0, 180)}`);
  }

  const quizData = await quizReq.response.json();
  const quizId = String(quizData?.quiz?._id || '');
  const questions = Array.isArray(quizData?.questions) ? quizData.questions : [];
  if (!quizId || questions.length === 0) {
    throw new Error('Quiz payload is missing _id or questions');
  }

  const sectionAnswers = buildSectionAnswers(questions);
  const sectionCountSummary = summarizeSectionCounts(sectionAnswers);

  for (const [section, answers] of Object.entries(sectionAnswers)) {
    const saveReq = await requestWithCookies(
      baseUrl,
      `/api/quiz/${shareCode}/answers`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ section, answers }),
      },
      jar
    );
    addStep('section.save', saveReq.durationMs, {
      section,
      answers: Object.keys(answers).length,
      status: saveReq.response.status,
    });

    if (!saveReq.response.ok) {
      const saveErr = await saveReq.response.text();
      throw new Error(`section.save failed for ${section} (${saveReq.response.status}): ${saveErr.slice(0, 180)}`);
    }

    if (thinkTimeMs > 0) {
      await sleep(thinkTimeMs);
    }
  }

  if (sendProctoringEvents) {
    const pReq = await requestWithCookies(
      baseUrl,
      `/api/quiz/${shareCode}/proctoring`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ eventType: 'tab_hidden', detail: 'scripted_test' }),
      },
      jar
    );
    addStep('proctoring.event', pReq.durationMs, { status: pReq.response.status });
  }

  const completeReq = await requestWithCookies(
    baseUrl,
    `/api/quiz/${shareCode}/complete`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ answers: sectionAnswers }),
    },
    jar
  );
  addStep('quiz.complete', completeReq.durationMs, { status: completeReq.response.status });

  if (!completeReq.response.ok) {
    const completionErr = await completeReq.response.text();
    throw new Error(`quiz.complete failed (${completeReq.response.status}): ${completionErr.slice(0, 180)}`);
  }

  const attemptedReq = await requestWithCookies(baseUrl, `/api/quiz/${shareCode}/attempted`, { method: 'GET' }, jar);
  addStep('attempted.fetch', attemptedReq.durationMs, { status: attemptedReq.response.status });
  if (!attemptedReq.response.ok) {
    const attemptedErr = await attemptedReq.response.text();
    throw new Error(`attempted.fetch failed (${attemptedReq.response.status}): ${attemptedErr.slice(0, 180)}`);
  }

  const attemptedData = await attemptedReq.response.json();
  const attemptId = attemptedData?.attemptId ? String(attemptedData.attemptId) : '';
  if (!attemptedData?.isAttempted || !attemptId) {
    throw new Error('Attempt not marked completed after quiz.complete');
  }

  const userResultReq = await requestWithCookies(
    baseUrl,
    `/api/mock-tests/${attemptId}/user-result`,
    { method: 'GET' },
    jar
  );
  addStep('result.fetch', userResultReq.durationMs, { status: userResultReq.response.status });
  if (!userResultReq.response.ok) {
    const userResultErr = await userResultReq.response.text();
    throw new Error(`result.fetch failed (${userResultReq.response.status}): ${userResultErr.slice(0, 180)}`);
  }

  const resultData = await userResultReq.response.json();
  const totalScore = Number(resultData?.totalScore || 0);
  const totalQuestions = Number(resultData?.totalQuestions || 0);

  const boardReq = await requestWithCookies(baseUrl, `/api/mock-tests/${quizId}/results`, { method: 'GET' }, jar);
  addStep('results.board', boardReq.durationMs, { status: boardReq.response.status });

  return {
    email,
    quizId,
    attemptId,
    totalScore,
    totalQuestions,
    sections: sectionCountSummary,
    timeline,
  };
}

export function summarizeBatch(results) {
  const completed = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok);

  const allSteps = completed.flatMap((r) => r.data.timeline);
  const metricsByStep = new Map();
  for (const step of allSteps) {
    if (!metricsByStep.has(step.step)) {
      metricsByStep.set(step.step, []);
    }
    metricsByStep.get(step.step).push(step.ms);
  }

  const stepSummary = Object.fromEntries(
    [...metricsByStep.entries()].map(([step, values]) => {
      values.sort((a, b) => a - b);
      const p95Index = Math.max(0, Math.ceil(values.length * 0.95) - 1);
      return [step, {
        count: values.length,
        avgMs: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
        p95Ms: values[p95Index],
        maxMs: values[values.length - 1],
      }];
    })
  );

  return {
    totalUsers: results.length,
    successUsers: completed.length,
    failedUsers: failed.length,
    failures: failed.map((f) => ({ user: f.user, error: f.error })),
    stepSummary,
  };
}
