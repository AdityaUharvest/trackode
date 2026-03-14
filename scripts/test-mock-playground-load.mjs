#!/usr/bin/env node
import { runSingleUserMockFlow, summarizeBatch } from './mock-playground-lib.mjs';

const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  shareCode: process.env.MOCK_SHARE_CODE || '',
  stages: (process.env.LOAD_STAGES || '10x3,25x3,50x2').split(','),
  password: process.env.TEST_PASSWORD || 'Trackode@123',
  emailPrefix: process.env.EMAIL_PREFIX || 'mockload',
  namePrefix: process.env.NAME_PREFIX || 'Mock Load User',
  phonePrefix: process.env.PHONE_PREFIX || '91111',
  thinkTimeMs: Number(process.env.THINK_TIME_MS || 5),
};

if (!config.shareCode) {
  console.error('Missing MOCK_SHARE_CODE. Example: MOCK_SHARE_CODE=ABC123 pnpm run test:mock:load');
  process.exit(1);
}

function parseStages(stagesRaw) {
  return stagesRaw.map((chunk) => {
    const [users, rounds] = chunk.split('x').map((v) => Number(v.trim()));
    return {
      users: Number.isFinite(users) && users > 0 ? users : 1,
      rounds: Number.isFinite(rounds) && rounds > 0 ? rounds : 1,
    };
  });
}

function createUser(seed) {
  const n = String(seed).padStart(6, '0');
  const stamp = Date.now();
  return {
    name: `${config.namePrefix} ${n}`,
    email: `${config.emailPrefix}.${stamp}.${n}@trackode.test`,
    password: config.password,
    phone: `${config.phonePrefix}${String(1000 + (seed % 9000)).slice(-4)}`,
  };
}

async function runWave(totalUsers, seedBase) {
  const tasks = Array.from({ length: totalUsers }, (_, idx) => ({ idx, user: createUser(seedBase + idx) }));

  const results = await Promise.all(
    tasks.map(async ({ user }) => {
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
        return { ok: true, user: user.email, data };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { ok: false, user: user.email, error: message };
      }
    })
  );

  return results;
}

async function main() {
  const stages = parseStages(config.stages);
  console.log('[load-test] config', { ...config, stages });

  let seed = 1;
  const allResults = [];

  for (const [stageIndex, stage] of stages.entries()) {
    console.log(`\n[stage ${stageIndex + 1}] users=${stage.users} rounds=${stage.rounds}`);

    for (let round = 1; round <= stage.rounds; round += 1) {
      const started = Date.now();
      // eslint-disable-next-line no-await-in-loop
      const waveResults = await runWave(stage.users, seed);
      seed += stage.users;

      const waveSummary = summarizeBatch(waveResults);
      const elapsedMs = Date.now() - started;

      console.log(`[stage ${stageIndex + 1}][round ${round}] elapsed=${elapsedMs}ms ok=${waveSummary.successUsers} fail=${waveSummary.failedUsers}`);
      if (waveSummary.failedUsers > 0) {
        console.log(JSON.stringify(waveSummary.failures.slice(0, 10), null, 2));
      }

      allResults.push(...waveResults);
    }
  }

  const finalSummary = summarizeBatch(allResults);
  console.log('\n=== Mock playground load summary ===');
  console.log(JSON.stringify(finalSummary, null, 2));

  if (finalSummary.failedUsers > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
