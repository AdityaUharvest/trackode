#!/usr/bin/env node
/**
 * Indian 1000-user load test
 * Usage: MOCK_SHARE_CODE=XXXXXXX node scripts/test-indian-1000.mjs
 */
import { runSingleUserMockFlow, summarizeBatch } from './mock-playground-lib.mjs';

const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  shareCode: process.env.MOCK_SHARE_CODE || '',
  totalUsers: Number(process.env.TOTAL_USERS || 1000),
  concurrency: Number(process.env.CONCURRENCY || 50),
  password: process.env.TEST_PASSWORD || 'Trackode@123',
  thinkTimeMs: Number(process.env.THINK_TIME_MS || 5),
};

if (!config.shareCode) {
  console.error('Missing MOCK_SHARE_CODE. Example: MOCK_SHARE_CODE=ABC123 node scripts/test-indian-1000.mjs');
  process.exit(1);
}

// ── Indian name data ──────────────────────────────────────────────────────────
const FIRST_NAMES = [
  'Aarav','Aditya','Ajay','Akash','Amit','Amitabh','Anand','Anil','Arjun','Aryan',
  'Ashish','Ashok','Bharat','Chirag','Deepak','Dev','Dhruv','Dinesh','Gaurav','Gopal',
  'Hardik','Harsh','Hemant','Ishan','Jai','Karan','Kartik','Kiran','Krishna','Kunal',
  'Lakshman','Manish','Manoj','Mihir','Mohit','Naman','Narayan','Nikhil','Nilesh','Nishant',
  'Om','Pankaj','Parth','Piyush','Pradeep','Pranav','Prashant','Pratik','Puneet','Rahul',
  'Raj','Rajesh','Rakesh','Ram','Ramesh','Ravi','Ritesh','Rohan','Rohit','Sachin',
  'Sahil','Sameer','Sandeep','Sanjay','Santosh','Satish','Shubham','Siddharth','Soham','Subhash',
  'Sunil','Suresh','Tanmay','Tarun','Uday','Ujjwal','Vaibhav','Vijay','Vikas','Vikram',
  'Vinay','Vishal','Vivek','Yash','Yogesh',
  // female names
  'Aarti','Aditi','Anjali','Anushka','Archana','Deepa','Disha','Divya','Harshita','Kavya',
  'Komal','Kritika','Lata','Mansi','Meera','Megha','Neha','Nisha','Poonam','Pooja',
  'Prachi','Priya','Radha','Rekha','Ritu','Riya','Sakshi','Shivani','Simran','Sneha',
  'Sonam','Sunita','Swati','Tanvi','Usha','Vandana','Varsha','Vidya','Yamini','Zara',
];

const LAST_NAMES = [
  'Agarwal','Ahuja','Bansod','Bhatt','Bose','Chauhan','Chopra','Chowdhury','Das','Dave',
  'Desai','Deshpande','Dhawan','Dubey','Gandhi','Ghosh','Gupta','Iyer','Jain','Jha',
  'Joshi','Kapoor','Kaur','Khan','Khanna','Kumar','Menon','Mehra','Mishra','Modi',
  'Mukherjee','Nair','Naik','Pandey','Patel','Patil','Pillai','Rao','Reddy','Saha',
  'Saxena','Shah','Sharma','Shukla','Singh','Sinha','Srivastava','Tiwari','Trivedi','Verma',
  'Yadav','Bajaj','Bhat','Chakraborty','Dutta','Garg','Hegde','Kashyap','Lal','Mahajan',
  'Malhotra','Mathur','Nanda','Narayanan','Oberoi','Parmar','Puri','Rajan','Rautela','Sethi',
  'Shetty','Tandon','Thakur','Walia','Wadhwa',
];

// Common Indian Gmail username styles
const USERNAME_STYLES = [
  (f, l, n) => `${f.toLowerCase()}.${l.toLowerCase()}${n}`,
  (f, l, n) => `${f.toLowerCase()}${l.toLowerCase()}${n}`,
  (f, l, n) => `${f.toLowerCase()}${n}${l.toLowerCase()}`,
  (f, l, n) => `${l.toLowerCase()}.${f.toLowerCase()}${n}`,
  (f, l, n) => `${f.toLowerCase()}${n}`,
  (f, l, n) => `${f.toLowerCase()}_${l.toLowerCase()}${n}`,
  (f, l, n) => `${f.toLowerCase()}${l.charAt(0).toLowerCase()}${n}`,
];

// Indian mobile number generation (10-digit, starts with 6-9)
const MOBILE_PREFIXES = ['6','7','8','9'];

function seededRng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0x100000000;
  };
}

function pickFrom(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

function buildIndianUser(index) {
  const rng = seededRng(index + 0xdeadbeef);
  const firstName = pickFrom(FIRST_NAMES, rng);
  const lastName = pickFrom(LAST_NAMES, rng);
  const num = String(Math.floor(rng() * 900) + 100); // 3-digit suffix 100-999
  const stamp = String(Date.now()).slice(-5);
  const style = USERNAME_STYLES[Math.floor(rng() * USERNAME_STYLES.length)];
  const username = style(firstName, lastName, `${num}${stamp}`);

  const mobilePrefix = MOBILE_PREFIXES[Math.floor(rng() * MOBILE_PREFIXES.length)];
  const mobileRest = String(Math.floor(rng() * 900000000) + 100000000).slice(0, 9);
  const phone = `${mobilePrefix}${mobileRest}`.slice(0, 10);

  return {
    name: `${firstName} ${lastName}`,
    email: `${username}@gmail.com`,
    password: config.password,
    phone,
  };
}

// ── Concurrency pool ──────────────────────────────────────────────────────────
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

  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, () => runner()));
  return results;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`[indian-1000] Starting ${config.totalUsers} Indian users  concurrency=${config.concurrency}  shareCode=${config.shareCode}`);
  console.log(`[indian-1000] baseUrl=${config.baseUrl}  thinkTimeMs=${config.thinkTimeMs}`);

  const users = Array.from({ length: config.totalUsers }, (_, i) => buildIndianUser(i));

  // Print a small sample so we can verify names/emails look right
  console.log('[indian-1000] Sample users (first 5):');
  users.slice(0, 5).forEach((u, i) => console.log(`  [${i + 1}] ${u.name} <${u.email}>  phone=${u.phone}`));

  let done = 0;
  const PROGRESS_EVERY = 50;

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
        done += 1;
        if (done % PROGRESS_EVERY === 0 || done === config.totalUsers) {
          const elapsed = ((Date.now() - started) / 1000).toFixed(1);
          console.log(`[indian-1000] progress ${done}/${config.totalUsers}  elapsed=${elapsed}s`);
        }
        return { ok: true, user: user.email, data };
      } catch (error) {
        done += 1;
        const message = error instanceof Error ? error.message : String(error);
        if (done % PROGRESS_EVERY === 0 || done === config.totalUsers) {
          const elapsed = ((Date.now() - started) / 1000).toFixed(1);
          console.log(`[indian-1000] progress ${done}/${config.totalUsers}  elapsed=${elapsed}s`);
        }
        return { ok: false, user: user.email, error: message };
      }
    },
    config.concurrency
  );

  const elapsedSec = ((Date.now() - started) / 1000).toFixed(1);
  const summary = summarizeBatch(results);

  console.log(`\n=== Indian 1000-user load test summary  (${elapsedSec}s) ===`);
  console.log(JSON.stringify(summary, null, 2));

  if (summary.failedUsers > 0) {
    console.log('\n--- First 20 failures ---');
    summary.failures.slice(0, 20).forEach((f) => console.log(` ✗ ${f.user}: ${f.error}`));
    process.exitCode = 1;
  } else {
    console.log(`\n✓ All ${config.totalUsers} Indian users completed successfully.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
