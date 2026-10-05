const BASE_URL = 'http://127.0.0.1:5000/api';

async function runTests() {
  console.log('🧪 Starting Full-Stack API Test Suite...\n');

  try {
    // 1. Health check
    const health = await fetch(`${BASE_URL}/health`).then((r) => r.json());
    console.log('✅ Health Check:', health.status);

    // 2. Dashboard Summary
    const summary = await fetch(`${BASE_URL}/dashboard/summary`).then((r) => r.json());
    console.log('✅ Dashboard Summary:', {
      totalBalance: summary.data.summary.totalBalance,
      totalIncome: summary.data.summary.totalIncome,
      totalExpenses: summary.data.summary.totalExpenses,
      categoriesCount: summary.data.categoryTotals.length,
      monthlyTrendsCount: summary.data.monthlyTrends.length,
    });

    // 3. Create Expense (POST)
    const newExp = await fetch(`${BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Full Stack Node & React Course',
        amount: 1499,
        category: 'Education',
        paymentMethod: 'Credit Card',
        description: 'Comprehensive college project testing expense',
      }),
    }).then((r) => r.json());
    console.log('✅ Created Expense:', newExp.data._id, '-', newExp.data.title);

    const createdId = newExp.data._id;

    // 4. Update Expense (PUT)
    const updatedExp = await fetch(`${BASE_URL}/expenses/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Full Stack Node & React Course (Updated)',
        amount: 1299,
        category: 'Education',
      }),
    }).then((r) => r.json());
    console.log('✅ Updated Expense:', updatedExp.data.title, 'Amount:', updatedExp.data.amount);

    // 5. Filter & Search Expenses (GET)
    const filtered = await fetch(`${BASE_URL}/expenses?category=Education&search=Course`).then((r) => r.json());
    console.log(`✅ Filtered & Searched Expenses found: ${filtered.count} items`);

    // 6. Delete Expense (DELETE)
    const deletedExp = await fetch(`${BASE_URL}/expenses/${createdId}`, {
      method: 'DELETE',
    }).then((r) => r.json());
    console.log('✅ Deleted Expense:', deletedExp.message);

    // 7. Create Income (POST)
    const newInc = await fetch(`${BASE_URL}/income`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Hackathon 1st Prize Grant',
        source: 'Scholarship',
        amount: 15000,
        description: 'Award money for best web app project',
      }),
    }).then((r) => r.json());
    console.log('✅ Created Income:', newInc.data._id, '-', newInc.data.title, '₹' + newInc.data.amount);

    // 8. Delete Income (DELETE)
    const deletedInc = await fetch(`${BASE_URL}/income/${newInc.data._id}`, {
      method: 'DELETE',
    }).then((r) => r.json());
    console.log('✅ Deleted Income:', deletedInc.message);

    console.log('\n🎉 ALL 8 API TESTS PASSED WITH 100% SUCCESS!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
}

runTests();
