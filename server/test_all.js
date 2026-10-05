/**
 * Comprehensive Automated Verification Suite
 * Tests all ExpenseFlow APIs, Lab Syllabus Endpoints (4.a-4.e, 5.c), and Data Flow
 */

const BASE_URL = 'http://localhost:5000/api';

async function testAll() {
  console.log('🚀 ========================================================');
  console.log('🧪 EXPENSEFLOW: COMPREHENSIVE VERIFICATION SUITE');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  async function check(name, testFn) {
    try {
      await testFn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Health Check
  await check('API Health Check (/api/health)', async () => {
    const res = await fetch(`${BASE_URL}/health`).then((r) => r.json());
    if (res.status !== 'OK') throw new Error('Expected status OK');
  });

  // 2. Dashboard Summary
  await check('Dashboard Summary (/api/dashboard/summary)', async () => {
    const res = await fetch(`${BASE_URL}/dashboard/summary`).then((r) => r.json());
    if (!res.data || !res.data.summary) throw new Error('Invalid dashboard payload');
  });

  // 3. Topic 4.a: Hello World JSON
  await check('Topic 4.a: Hello World JSON Route (/api/lab/hello-world)', async () => {
    const res = await fetch(`${BASE_URL}/lab/hello-world`).then((r) => r.json());
    if (!res.message.includes('Hello World')) throw new Error('Missing Hello World text');
  });

  // 4. Topic 4.a: Hello World HTML
  await check('Topic 4.a: Hello World HTML Route (/api/lab/hello-world-browser)', async () => {
    const res = await fetch(`${BASE_URL}/lab/hello-world-browser`);
    const text = await res.text();
    if (!text.includes('Hello World!')) throw new Error('HTML does not contain Hello World');
  });

  // 5. Topic 4.b: Multi-Route Website
  await check('Topic 4.b: Multi-Route Express Website (/api/lab/website/home, /about, /services, /contact)', async () => {
    const home = await fetch(`${BASE_URL}/lab/website/home`).then((r) => r.json());
    const about = await fetch(`${BASE_URL}/lab/website/about`).then((r) => r.json());
    const services = await fetch(`${BASE_URL}/lab/website/services`).then((r) => r.json());
    const contact = await fetch(`${BASE_URL}/lab/website/contact`).then((r) => r.json());
    if (!home.heading || !about.heading || !services.services || !contact.contact) {
      throw new Error('Incomplete multi-route payload');
    }
  });

  // 6. Topic 4.c: Browser Console Route
  await check('Topic 4.c: Browser Console Dispatch (/api/lab/browser-console)', async () => {
    const res = await fetch(`${BASE_URL}/lab/browser-console`);
    const text = await res.text();
    if (!text.includes('console.log')) throw new Error('Missing console.log in script response');
  });

  // 7. Topic 4.d: Express CRUD Cycle
  await check('Topic 4.d: Express CRUD Operations (/api/lab/crud/items)', async () => {
    // CREATE (POST)
    const postRes = await fetch(`${BASE_URL}/lab/crud/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Lab Test Item', amount: 999, category: 'Education' }),
    }).then((r) => r.json());
    if (!postRes.success || !postRes.data.id) throw new Error('POST failed');

    const id = postRes.data.id;

    // READ ALL (GET)
    const getRes = await fetch(`${BASE_URL}/lab/crud/items`).then((r) => r.json());
    if (!getRes.data.some((i) => i.id === id)) throw new Error('GET did not find created item');

    // UPDATE (PUT)
    const putRes = await fetch(`${BASE_URL}/lab/crud/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1200 }),
    }).then((r) => r.json());
    if (putRes.data.amount !== 1200) throw new Error('PUT did not update amount');

    // DELETE (DELETE)
    const delRes = await fetch(`${BASE_URL}/lab/crud/items/${id}`, { method: 'DELETE' }).then((r) => r.json());
    if (!delRes.success) throw new Error('DELETE failed');
  });

  // 8. Topic 4.e: MySQL Connection Test
  await check('Topic 4.e: Express - MySQL Driver (/api/lab/mysql/connection-test)', async () => {
    const res = await fetch(`${BASE_URL}/lab/mysql/connection-test`).then((r) => r.json());
    if (!res.driver || !res.config) throw new Error('Invalid MySQL test payload');
  });

  // 9. Topic 5.c: MySQL Subqueries Showcase
  await check('Topic 5.c: MySQL Subqueries Execution (/api/lab/mysql/subqueries-demo)', async () => {
    const res = await fetch(`${BASE_URL}/lab/mysql/subqueries-demo`).then((r) => r.json());
    if (!res.scalarSubquery || !res.derivedTableSubquery) throw new Error('Subqueries data missing');
  });

  console.log('\n========================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

testAll().catch(console.error);
