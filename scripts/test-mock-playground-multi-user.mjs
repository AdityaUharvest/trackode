#!/usr/bin/env node
import { runSingleUserMockFlow, summarizeBatch } from './mock-playground-lib.mjs';

const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  shareCode: process.env.MOCK_SHARE_CODE || '',
  users: Number(process.env.USERS || 10),
  concurrency: Number(process.env.CONCURRENCY || 5),
  password: process.env.TEST_PASSWORD || 'Trackode@123',
  emailPrefix: process.env.EMAIL_PREFIX || 'mocktester',
  namePrefix: process.env.NAME_PREFIX || 'Mock Tester',
  phonePrefix: process.env.PHONE_PREFIX || '90000',
  thinkTimeMs: Number(process.env.THINK_TIME_MS || 20),
};

if (!config.shareCode) {
  console.error('Missing MOCK_SHARE_CODE. Example: MOCK_SHARE_CODE=ABC123 pnpm run test:mock:multi');
  process.exit(1);
}

function buildUser(index) {
  const n = String(index + 1).padStart(3, '0');
  const stamp = Date.now();
  const email = `${config.emailPrefix}.${stamp}.${n}@trackode.test`;
  return {
    name: `${config.namePrefix} ${n}`,
    email,
    password: config.password,
    phone: `${config.phonePrefix}${String(1000 + index).slice(-4)}`,
  };
}

async function runPool(items, worker, concurrency) {
  const queue = [...items];
  const results = [];

  async function runner() {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;
      // eslint-disable-next-line no-await-in-loop
      const result = await worker(item);
      results.push(result);
    }
  }

  const workers = Array.from({ length: Math.max(1, concurrency) }, () => runner());
  await Promise.all(workers);
  return results;
}

async function main() {
  console.log('[multi-user] config', config);

  const users = Array.from({ length: config.users }, (_, i) => buildUser(i));

  const started = Date.now();
  const results = await runPool(
    users,
    async (user) => {
      try {
        const data = await runSingleUserMockFlow({
          baseUrl: config.baseUrl,
          shareCode: config.shareCode,
          email: user.email,
          password: user.password,
          name: user.name,
          phone: user.phone,
          thinkTimeMs: config.thinkTimeMs,
          sendProctoringEvents: true,
        });
        console.log(`[ok] ${user.email} score=${data.totalScore}/${data.totalQuestions} attempt=${data.attemptId}`);
        return { ok: true, user: user.email, data };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[fail] ${user.email} ${message}`);
        return { ok: false, user: user.email, error: message };
      }
    },
    config.concurrency
  );

  const elapsedMs = Date.now() - started;
  const summary = summarizeBatch(results);

  console.log('\n=== Multi-user mock playground summary ===');
  console.log(JSON.stringify({ elapsedMs, ...summary }, null, 2));

  if (summary.failedUsers > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
