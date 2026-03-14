#!/usr/bin/env node
/**
 * Scenario tests for partial-abandon, cross-device resume, incomplete-result block,
 * and completed re-entry prevention.
 *
 * Usage:
 *   MOCK_SHARE_CODE=QFJMOPN6 node scripts/test-scenarios.mjs
 */

import {
  CookieJar,
  requestWithCookies,
  signupUser,
  loginWithCredentials,
  sleep,
} from './mock-playground-lib.mjs';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const SHARE_CODE = process.env.MOCK_SHARE_CODE || '';
const PASSWORD = process.env.TEST_PASSWORD || 'Trackode@123';

if (!SHARE_CODE) {
  console.error('Missing MOCK_SHARE_CODE env var');
  process.exit(1);
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function makeUser(tag) {
  const stamp = Date.now();
  return {
    name: `Scenario ${tag}`,
    email: `scenario.${tag}.${stamp}@trackode.test`,
    password: PASSWORD,
    phone: `9${String(stamp).slice(-9)}`,
  };
}

async function apiLogin(user) {
  const jar = new CookieJar();
  await signupUser({ baseUrl: BASE_URL, ...user });
  await loginWithCredentials({ baseUrl: BASE_URL, email: user.email, password: user.password, jar });
  return jar;
}

async function fetchQuiz(jar) {
  const r = await requestWithCookies(BASE_URL, `/api/quiz/${SHARE_CODE}`, { method: 'GET' }, jar);
  if (!r.response.ok) throw new Error(`quiz.fetch ${r.response.status}`);
  return r.response.json();
}

async function getAttempted(jar) {
  const r = await requestWithCookies(BASE_URL, `/api/quiz/${SHARE_CODE}/attempted`, { method: 'GET' }, jar);
  if (!r.response.ok) throw new Error(`attempted ${r.response.status}`);
  return r.response.json();
}

async function saveSection(jar, sectionName, answers) {
  const r = await requestWithCookies(
    BASE_URL,
    `/api/quiz/${SHARE_CODE}/answers`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ section: sectionName, answers }),
    },
    jar,
  );
  return { status: r.response.status, body: await r.response.json().catch(() => ({})) };
}

async function completeQuiz(jar, allSectionAnswers) {
  const r = await requestWithCookies(
    BASE_URL,
    `/api/quiz/${SHARE_CODE}/complete`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ answers: allSectionAnswers }),
    },
    jar,
  );
  return { status: r.response.status, body: await r.response.json().catch(() => ({})) };
}

async function getUserResult(jar, attemptId) {
  const r = await requestWithCookies(
    BASE_URL,
    `/api/mock-tests/${attemptId}/user-result`,
    { method: 'GET' },
    jar,
  );
  return { status: r.response.status, body: await r.response.json().catch(() => ({})) };
}

/** Build a random answer map for a single section's questions. */
function buildAnswers(questions, sectionName) {
  const map = {};
  for (const q of questions) {
    if (q.section !== sectionName) continue;
    const count = Array.isArray(q.options) ? q.options.length : 0;
    if (count > 0) map[q._id] = Math.floor(Math.random() * count);
  }
  return map;
}

// ─── assertion helpers ────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(label, condition, hint = '') {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ ${label}${hint ? ` — ${hint}` : ''}`);
    failed++;
  }
}

// ─── scenarios ────────────────────────────────────────────────────────────────

/**
 * SCENARIO 1: Partial Abandon
 * User submits only the first section then closes the browser (never calls /complete).
 * POST /attempted should return hasInProgress=true, isAttempted=false,
 * and submittedSections should contain exactly that one section.
 */
async function scenario1_partialAbandon() {
  console.log('\n── SCENARIO 1: Partial Abandon ──────────────────────────────');

  const user = makeUser('s1');
  const jar = await apiLogin(user);
  console.log(`  user: ${user.email}`);

  const quizData = await fetchQuiz(jar);
  const questions = quizData.questions || [];
  const sections = [...new Set(questions.map((q) => q.section))].filter(Boolean);
  assert('quiz has ≥2 sections', sections.length >= 2, `sections: ${sections.join(', ')}`);

  const firstSection = sections[0];
  const answers = buildAnswers(questions, firstSection);
  assert('first section has questions', Object.keys(answers).length > 0);

  const saveResult = await saveSection(jar, firstSection, answers);
  assert('section save returns 200', saveResult.status === 200, JSON.stringify(saveResult.body));

  // Do NOT call /complete — simulates user closing the browser after section 1.

  const attempted = await getAttempted(jar);
  assert('hasInProgress is true', attempted.hasInProgress === true, JSON.stringify(attempted));
  assert('isAttempted is false', attempted.isAttempted === false, JSON.stringify(attempted));
  assert(
    'submittedSections contains first section',
    Array.isArray(attempted.submittedSections) &&
      attempted.submittedSections.some(
        (s) => s.trim().toLowerCase() === firstSection.trim().toLowerCase(),
      ),
    `submittedSections=${JSON.stringify(attempted.submittedSections)}, firstSection=${firstSection}`,
  );
  assert('attemptId is present', Boolean(attempted.attemptId), JSON.stringify(attempted));

  return { user, firstSection, attemptId: attempted.attemptId, sections, questions };
}

/**
 * SCENARIO 2: Cross-Device Resume
 * Same user comes back on a fresh session (no localStorage).
 * The play page reads submittedSections from the API and correctly marks the first
 * section as already submitted, then the user completes the remaining sections.
 * Result must be available at the end.
 */
async function scenario2_crossDeviceResume(prevResult) {
  console.log('\n── SCENARIO 2: Cross-Device Resume ─────────────────────────');

  const { user, firstSection, sections, questions } = prevResult;

  // Simulate a fresh browser — new CookieJar only, no localStorage equivalent here.
  const freshJar = new CookieJar();
  await loginWithCredentials({ baseUrl: BASE_URL, email: user.email, password: user.password, jar: freshJar });
  console.log(`  user: ${user.email} (fresh session)`);

  const attempted = await getAttempted(freshJar);
  assert('hasInProgress still true in fresh session', attempted.hasInProgress === true, JSON.stringify(attempted));
  assert(
    'submittedSections returned in fresh session',
    Array.isArray(attempted.submittedSections) && attempted.submittedSections.length >= 1,
    JSON.stringify(attempted.submittedSections),
  );

  // Determine which sections still need to be submitted.
  const dbSubmittedNormalized = (attempted.submittedSections || []).map((s) =>
    s.trim().toLowerCase(),
  );
  const remainingSections = sections.filter(
    (s) => !dbSubmittedNormalized.includes(s.trim().toLowerCase()),
  );
  assert(
    'remaining sections identified correctly',
    remainingSections.length === sections.length - dbSubmittedNormalized.length,
    `remaining=${remainingSections.join(', ')}`,
  );

  // Submit remaining sections.
  const allAnswers = {};
  // Keep first section answers too (for /complete payload).
  for (const s of sections) {
    allAnswers[s] = buildAnswers(questions, s);
  }

  for (const section of remainingSections) {
    await sleep(10);
    const saveResult = await saveSection(freshJar, section, allAnswers[section]);
    assert(
      `section "${section}" saved (200)`,
      saveResult.status === 200,
      JSON.stringify(saveResult.body),
    );
  }

  const completeResult = await completeQuiz(freshJar, allAnswers);
  assert('quiz complete returns 200', completeResult.status === 200, JSON.stringify(completeResult.body));

  await sleep(200); // let DB write settle

  const attemptedAfter = await getAttempted(freshJar);
  assert('isAttempted true after complete', attemptedAfter.isAttempted === true, JSON.stringify(attemptedAfter));
  assert('hasInProgress false after complete', attemptedAfter.hasInProgress === false, JSON.stringify(attemptedAfter));

  const resultRes = await getUserResult(freshJar, attemptedAfter.attemptId);
  assert('user-result returns 200', resultRes.status === 200, JSON.stringify(resultRes.body).slice(0, 120));
  assert(
    'totalQuestions > 0 in result',
    resultRes.status === 200 && Number(resultRes.body?.totalQuestions) > 0,
    `totalQuestions=${resultRes.body?.totalQuestions}`,
  );
}

/**
 * SCENARIO 3: Result Blocked for Incomplete Attempt
 * User starts, submits partial sections, then tries to hit user-result before calling /complete.
 * Expects 409 Not Ready.
 */
async function scenario3_resultBlockedBeforeComplete() {
  console.log('\n── SCENARIO 3: Result Blocked Before /complete ──────────────');

  const user = makeUser('s3');
  const jar = await apiLogin(user);
  console.log(`  user: ${user.email}`);

  const quizData = await fetchQuiz(jar);
  const questions = quizData.questions || [];
  const sections = [...new Set(questions.map((q) => q.section))].filter(Boolean);

  // Submit only first section.
  const firstSection = sections[0];
  const answers = buildAnswers(questions, firstSection);
  await saveSection(jar, firstSection, answers);

  // Get the in-progress attempt ID.
  const attempted = await getAttempted(jar);
  assert('hasInProgress true', attempted.hasInProgress === true, JSON.stringify(attempted));
  assert('attemptId returned', Boolean(attempted.attemptId));

  const resultRes = await getUserResult(jar, attempted.attemptId);
  assert(
    'user-result returns 409 for incomplete attempt',
    resultRes.status === 409,
    `got ${resultRes.status}: ${JSON.stringify(resultRes.body).slice(0, 120)}`,
  );
}

/**
 * SCENARIO 4: Completed — Re-entry Blocked
 * User fully completes. On re-visit /attempted returns isAttempted=true,
 * hasInProgress=false. A re-attempt would be blocked by the UI.
 */
async function scenario4_completedReentryBlocked() {
  console.log('\n── SCENARIO 4: Completed — Re-entry Blocked ─────────────────');

  const user = makeUser('s4');
  const jar = await apiLogin(user);
  console.log(`  user: ${user.email}`);

  const quizData = await fetchQuiz(jar);
  const questions = quizData.questions || [];
  const sections = [...new Set(questions.map((q) => q.section))].filter(Boolean);
  assert('quiz has sections', sections.length > 0);

  // Submit every section.
  const allAnswers = {};
  for (const section of sections) {
    allAnswers[section] = buildAnswers(questions, section);
    await saveSection(jar, section, allAnswers[section]);
    await sleep(10);
  }

  const completeResult = await completeQuiz(jar, allAnswers);
  assert('quiz complete 200', completeResult.status === 200, JSON.stringify(completeResult.body));

  await sleep(200);

  const attempted = await getAttempted(jar);
  assert('isAttempted true', attempted.isAttempted === true, JSON.stringify(attempted));
  assert('hasInProgress false', attempted.hasInProgress === false, JSON.stringify(attempted));

  // Simulate the play page check: it would redirect to "Already Attempted" screen.
  // We verify the API signal is correct — no need for a browser.
  assert(
    'wasAutoCompleted absent (normal completion)',
    !attempted.wasAutoCompleted,
  );

  // Trying to hit /complete again should still return 200 because the route
  // finds no active attempt and falls back to the existing completed one silently.
  const reSubmit = await completeQuiz(jar, allAnswers);
  assert(
    '/complete idempotent on re-submit (200)',
    reSubmit.status === 200,
    JSON.stringify(reSubmit.body).slice(0, 120),
  );

  // Result must still be available.
  const resultRes = await getUserResult(jar, attempted.attemptId);
  assert('user-result 200 after re-submit attempt', resultRes.status === 200, JSON.stringify(resultRes.body).slice(0, 120));
}

/**
 * SCENARIO 5: /answers Blocked After /complete
 * After completion, calling /answers should return 409 "Quiz already completed"
 * instead of silently creating a new in-progress attempt.
 */
async function scenario5_answersAfterComplete() {
  console.log('\n── SCENARIO 5: /answers Blocked After /complete ─────────────');

  const user = makeUser('s5');
  const jar = await apiLogin(user);
  console.log(`  user: ${user.email}`);

  const quizData = await fetchQuiz(jar);
  const questions = quizData.questions || [];
  const sections = [...new Set(questions.map((q) => q.section))].filter(Boolean);
  const firstSection = sections[0];

  // Full complete first.
  const allAnswers = {};
  for (const s of sections) allAnswers[s] = buildAnswers(questions, s);
  for (const s of sections) await saveSection(jar, s, allAnswers[s]);
  await completeQuiz(jar, allAnswers);

  await sleep(200);

  // Now try to POST /answers again — should be rejected with 409.
  const saveAgain = await saveSection(jar, firstSection, buildAnswers(questions, firstSection));
  assert(
    '/answers returns 409 after quiz completed',
    saveAgain.status === 409,
    `got ${saveAgain.status}: ${JSON.stringify(saveAgain.body)}`,
  );

  // isAttempted must still be true and hasInProgress must be false.
  const attempted = await getAttempted(jar);
  assert('isAttempted still true', attempted.isAttempted === true);
  assert('hasInProgress false (no new attempt created)', attempted.hasInProgress === false);
}

/**
 * SCENARIO 6: Auto-Complete at Result Fetch (Simulated Tab-Close)
 * Simulates what happens when a user submits all sections but NEVER calls /complete
 * (browser crashed, tab killed, etc.).
 * The /user-result endpoint must auto-complete the timed-out attempt and return the result.
 *
 * Because the quiz duration is 60 min and we can't wait that long, we directly patch
 * the in-progress attempt's startedAt to be 70 minutes in the past via the DB — or we
 * call a dedicated test-only override. Since we can't touch the DB directly from here,
 * we instead call the /attempted endpoint's lazy auto-expire by reading it after patching
 * startedAt via the debug hook described below.
 *
 * Practical approach: we test the server-side guard by calling /user-result on an
 * attempt that was NOT completed via /complete. The result must eventually succeed once
 * durationMinutes has elapsed. For the test we verify:
 *   a) Before expiry: /user-result returns 409
 *   b) The endpoint correctly scores with whatever partial answers exist (smoke check)
 * Since we cannot fast-forward time without a DB patch, we verify the 409 path here and
 * document that the auto-complete fires once durationMinutes elapses in production.
 */
async function scenario6_noCompleteCallBlocksResult() {
  console.log('\n── SCENARIO 6: No /complete Call — Result Blocked (409) ─────');

  const user = makeUser('s6');
  const jar = await apiLogin(user);
  console.log(`  user: ${user.email}`);

  const quizData = await fetchQuiz(jar);
  const questions = quizData.questions || [];
  const sections = [...new Set(questions.map((q) => q.section))].filter(Boolean);

  // Submit ALL sections — just don't call /complete.
  const allAnswers = {};
  for (const s of sections) {
    allAnswers[s] = buildAnswers(questions, s);
    await saveSection(jar, s, allAnswers[s]);
    await sleep(10);
  }

  const attempted = await getAttempted(jar);
  assert('hasInProgress true (all sections saved, no /complete)', attempted.hasInProgress === true, JSON.stringify(attempted));
  assert('isAttempted false (no /complete)', attempted.isAttempted === false, JSON.stringify(attempted));

  // /user-result must return 409 because duration hasn't elapsed yet.
  const resultRes = await getUserResult(jar, attempted.attemptId);
  assert(
    '/user-result returns 409 when /complete was never called and duration not elapsed',
    resultRes.status === 409,
    `got ${resultRes.status}: ${JSON.stringify(resultRes.body).slice(0, 120)}`,
  );

  // Now calling /complete explicitly should succeed and produce a result.
  const completeRes = await completeQuiz(jar, allAnswers);
  assert('/complete succeeds after all sections saved', completeRes.status === 200, JSON.stringify(completeRes.body).slice(0, 80));

  await sleep(200);

  const resultRes2 = await getUserResult(jar, attempted.attemptId);
  assert('/user-result returns 200 after explicit /complete', resultRes2.status === 200, JSON.stringify(resultRes2.body).slice(0, 80));
  assert(
    'result has all questions scored',
    resultRes2.status === 200 && Number(resultRes2.body?.totalQuestions) === questions.length,
    `totalQuestions=${resultRes2.body?.totalQuestions}, expected=${questions.length}`,
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`[scenarios] baseUrl=${BASE_URL} shareCode=${SHARE_CODE}\n`);

  try {
    const s1Result = await scenario1_partialAbandon();
    await scenario2_crossDeviceResume(s1Result);
    await scenario3_resultBlockedBeforeComplete();
    await scenario4_completedReentryBlocked();
    await scenario5_answersAfterComplete();
    await scenario6_noCompleteCallBlocksResult();
  } catch (err) {
    console.error('\n[fatal]', err);
    failed++;
  }

  console.log(`\n═══════════════════════════════════════════════`);
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log('═══════════════════════════════════════════════\n');

  if (failed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
