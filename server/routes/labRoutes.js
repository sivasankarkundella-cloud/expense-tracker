import express from 'express';
import { testMySQLConnection, executeMySQLQuery } from '../config/mysqlDb.js';

const router = express.Router();

// In-memory lab items store for isolated 4.d CRUD demo without affecting main ledger
let labCrudItems = [
  { id: 1, title: 'College Tuition Fee', amount: 25000, category: 'Education', status: 'Paid' },
  { id: 2, title: 'Laptop RAM Upgrade', amount: 3200, category: 'Technology', status: 'Completed' },
  { id: 3, title: 'Library Book Fine', amount: 50, category: 'Education', status: 'Pending' },
];

// ==============================================================================
// 4.a: Program to implement 'Hello World' message in route through the browser
// ==============================================================================
// JSON Route
router.get('/hello-world', (req, res) => {
  res.status(200).json({
    topic: '4.a: Hello World in Express Route',
    message: 'Hello World from Express.js!',
    timestamp: new Date().toISOString(),
    framework: 'Express.js v4.21.2',
    runtime: 'Node.js',
    status: 'Success',
  });
});

// HTML Browser Render Route (returns formatted HTML directly to browser)
router.get('/hello-world-browser', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Express.js - Hello World</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #0f172a;
          color: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
        }
        .card {
          background: #1e293b;
          border: 1px solid #334155;
          padding: 2.5rem 3rem;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);
          max-width: 480px;
        }
        h1 { color: #38bdf8; font-size: 2.2rem; margin-bottom: 0.5rem; }
        p { color: #94a3b8; font-size: 1rem; line-height: 1.6; }
        .badge { background: #0369a1; color: #e0f2fe; padding: 0.3rem 0.8rem; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin-bottom: 1rem; }
        .code { background: #0f172a; padding: 0.5rem 1rem; border-radius: 8px; font-family: monospace; color: #34d399; margin-top: 1rem; text-align: left; }
      </style>
    </head>
    <body>
      <div class="card">
        <span class="badge">Topic 4.a Implementation</span>
        <h1>Hello World!</h1>
        <p>This response was rendered by <strong>Express.js</strong> running on <strong>Node.js</strong> and served directly through the browser route.</p>
        <div class="code">app.get('/api/lab/hello-world-browser', (req, res) => {<br/>&nbsp;&nbsp;res.send('&lt;h1&gt;Hello World!&lt;/h1&gt;');<br/>});</div>
      </div>
    </body>
    </html>
  `);
});

// ==============================================================================
// 4.b: Program to develop a small website with multiple routes using Express.js
// ==============================================================================
router.get('/routes-catalog', (req, res) => {
  res.status(200).json({
    topic: '4.b: Multi-Route Express.js Website Architecture',
    websiteName: 'ExpenseFlow Mini-Portal',
    routes: [
      { path: '/api/lab/website/home', method: 'GET', description: 'Home Page & Welcome Hero' },
      { path: '/api/lab/website/about', method: 'GET', description: 'About Project & Tech Stack Info' },
      { path: '/api/lab/website/services', method: 'GET', description: 'Financial Tracking Services' },
      { path: '/api/lab/website/contact', method: 'GET', description: 'Student & Lab Support Contact' },
    ],
  });
});

router.get('/website/home', (req, res) => {
  res.status(200).json({
    page: 'Home Page',
    route: '/api/lab/website/home',
    statusCode: 200,
    heading: 'Welcome to ExpenseFlow Multi-Route Hub',
    content: 'Smart personal finance management powered by Express.js routing.',
  });
});

router.get('/website/about', (req, res) => {
  res.status(200).json({
    page: 'About Us',
    route: '/api/lab/website/about',
    statusCode: 200,
    heading: 'About ExpenseFlow Project',
    content: 'Full-stack application built for academic syllabus evaluation covering React, Node, Express & MySQL.',
  });
});

router.get('/website/services', (req, res) => {
  res.status(200).json({
    page: 'Services',
    route: '/api/lab/website/services',
    statusCode: 200,
    heading: 'Our Financial Services',
    services: ['Expense Logging', 'Income Tracking', 'Budget Analytics', 'SQL Reporting', 'CSV Export'],
  });
});

router.get('/website/contact', (req, res) => {
  res.status(200).json({
    page: 'Contact',
    route: '/api/lab/website/contact',
    statusCode: 200,
    heading: 'Student Lab Evaluation Portal',
    contact: { email: 'siva@expenseflow.dev', github: 'https://github.com/expenseflow' },
  });
});

// ==============================================================================
// 4.c: Program to print 'Hello World' in the browser console using Express.js
// ==============================================================================
// Route that serves an HTML page with embedded script executing console.log()
router.get('/browser-console', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Express.js Browser Console Output</title>
      <style>
        body { font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; text-align: center; }
        .box { background: #1e293b; padding: 2rem; border-radius: 12px; border: 1px solid #334155; display: inline-block; max-width: 500px; }
        .key { color: #f59e0b; font-weight: bold; }
      </style>
      <script>
        // Topic 4.c: Express delivers this JavaScript payload to log to the client browser console
        console.log("%c=======================================================", "color: #38bdf8; font-weight: bold;");
        console.log("%c✨ [Express.js Server Dispatch] Hello World in Browser Console! ✨", "color: #10b981; font-size: 16px; font-weight: bold;");
        console.log("%cDelivered via Express Route: /api/lab/browser-console", "color: #94a3b8;");
        console.log("%cTimestamp: " + new Date().toISOString(), "color: #94a3b8;");
        console.log("%c=======================================================", "color: #38bdf8; font-weight: bold;");
      </script>
    </head>
    <body>
      <div class="box">
        <h2 style="color: #10b981;">Topic 4.c: Browser Console Demo</h2>
        <p>Press <span class="key">F12</span> or <span class="key">Ctrl + Shift + I</span> (Inspect) and open the <strong>Console</strong> tab to view the Hello World message dispatched by Express.js!</p>
      </div>
    </body>
    </html>
  `);
});

// ==============================================================================
// 4.d: Program to implement CRUD operations using Express.js
// ==============================================================================
// CREATE (POST)
router.post('/crud/items', (req, res) => {
  const { title, amount, category, status } = req.body;
  if (!title || !amount) {
    return res.status(400).json({ success: false, message: 'Title and amount are required' });
  }

  const newItem = {
    id: Date.now(),
    title,
    amount: Number(amount),
    category: category || 'General',
    status: status || 'Active',
    createdAt: new Date().toISOString(),
  };

  labCrudItems.push(newItem);
  res.status(201).json({
    operation: 'CREATE (POST)',
    success: true,
    message: 'Item created successfully in Express store',
    data: newItem,
  });
});

// READ ALL (GET)
router.get('/crud/items', (req, res) => {
  res.status(200).json({
    operation: 'READ ALL (GET)',
    success: true,
    count: labCrudItems.length,
    data: labCrudItems,
  });
});

// READ ONE (GET)
router.get('/crud/items/:id', (req, res) => {
  const item = labCrudItems.find((i) => i.id === Number(req.params.id));
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }
  res.status(200).json({
    operation: 'READ ONE (GET)',
    success: true,
    data: item,
  });
});

// UPDATE (PUT)
router.put('/crud/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = labCrudItems.findIndex((i) => i.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  labCrudItems[index] = {
    ...labCrudItems[index],
    ...req.body,
    id, // Keep ID immutable
    updatedAt: new Date().toISOString(),
  };

  res.status(200).json({
    operation: 'UPDATE (PUT)',
    success: true,
    message: 'Item updated successfully',
    data: labCrudItems[index],
  });
});

// DELETE (DELETE)
router.delete('/crud/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = labCrudItems.findIndex((i) => i.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  const deletedItem = labCrudItems.splice(index, 1)[0];
  res.status(200).json({
    operation: 'DELETE (DELETE)',
    success: true,
    message: 'Item deleted successfully',
    deletedItem,
  });
});

// ==============================================================================
// 4.e: Connection between API and Database using Express - MySQL Driver
// ==============================================================================
router.get('/mysql/connection-test', async (req, res) => {
  const status = await testMySQLConnection();
  res.status(200).json({
    topic: '4.e: Express - MySQL Driver Connection Test',
    driver: 'mysql2/promise',
    ...status,
  });
});

// ==============================================================================
// 5.a, 5.b, 5.c: MySQL Queries & Subqueries Live Showcase
// ==============================================================================
router.get('/mysql/subqueries-demo', async (req, res) => {
  // Try live MySQL first
  const liveTest = await testMySQLConnection();

  if (liveTest.connected) {
    const scalarSql = `SELECT id, title, amount, category, date FROM expenses WHERE amount > (SELECT AVG(amount) FROM expenses) ORDER BY amount DESC LIMIT 5;`;
    const derivedSql = `SELECT category, total_spent FROM (SELECT category, SUM(amount) AS total_spent FROM expenses GROUP BY category) AS cat_summary WHERE total_spent > 1000 ORDER BY total_spent DESC;`;

    const scalarRes = await executeMySQLQuery(scalarSql);
    const derivedRes = await executeMySQLQuery(derivedSql);

    return res.status(200).json({
      source: 'live_mysql',
      scalarSubquery: {
        sql: scalarSql,
        description: 'Find expenses with amount greater than overall average (SELECT AVG(amount) FROM expenses)',
        results: scalarRes.data,
      },
      derivedTableSubquery: {
        sql: derivedSql,
        description: 'Aggregate category spending inside subquery and filter for total > 1000',
        results: derivedRes.data,
      },
    });
  }

  // Curated demo results mirroring the exact SQL execution
  res.status(200).json({
    source: 'simulated_mysql_engine',
    topic: '5.c: MySQL Subqueries Evaluation',
    scalarSubquery: {
      sql: `SELECT id, title, amount, category, date \nFROM expenses \nWHERE amount > (SELECT AVG(amount) FROM expenses) \nORDER BY amount DESC;`,
      description: 'Scalar Subquery: Filter records where expense amount > the calculated average of all expenses (₹1,099.80)',
      results: [
        { id: 9, title: 'Sneakers & Sportswear', amount: 2899.00, category: 'Shopping', date: '2026-03-22' },
        { id: 8, title: 'Gym Monthly Membership', amount: 1500.00, category: 'Health', date: '2026-03-02' },
        { id: 6, title: 'Grocery & Dairy Supplies', amount: 1420.00, category: 'Food', date: '2026-03-18' },
        { id: 7, title: 'Cloud Hosting Subscription', amount: 1250.00, category: 'Bills', date: '2026-03-20' },
      ],
    },
    derivedTableSubquery: {
      sql: `SELECT cat_summary.category, cat_summary.total_spent, cat_summary.tx_count \nFROM ( \n    SELECT category, SUM(amount) AS total_spent, COUNT(*) AS tx_count \n    FROM expenses \n    GROUP BY category \n) AS cat_summary \nWHERE cat_summary.total_spent > 1000 \nORDER BY cat_summary.total_spent DESC;`,
      description: 'Derived Table Subquery: Subquery in FROM clause calculating category totals, filtered by outer WHERE total_spent > 1000',
      results: [
        { category: 'Shopping', total_spent: 2899.00, tx_count: 1 },
        { category: 'Bills', total_spent: 2748.00, tx_count: 3 },
        { category: 'Food', total_spent: 1600.00, tx_count: 2 },
        { category: 'Health', total_spent: 1500.00, tx_count: 1 },
      ],
    },
    correlatedSubquery: {
      sql: `SELECT e1.id, e1.title, e1.category, e1.amount \nFROM expenses e1 \nWHERE e1.amount = ( \n    SELECT MAX(e2.amount) \n    FROM expenses e2 \n    WHERE e2.category = e1.category \n);`,
      description: 'Correlated Subquery: Finds the single highest transaction record within every category',
      results: [
        { id: 9, title: 'Sneakers & Sportswear', category: 'Shopping', amount: 2899.00 },
        { id: 8, title: 'Gym Monthly Membership', category: 'Health', amount: 1500.00 },
        { id: 6, title: 'Grocery & Dairy Supplies', category: 'Food', amount: 1420.00 },
        { id: 7, title: 'Cloud Hosting Subscription', category: 'Bills', amount: 1250.00 },
        { id: 2, title: 'Operating Systems Textbook', category: 'Education', amount: 850.00 },
        { id: 3, title: 'Monthly City Bus Pass', category: 'Transport', amount: 450.00 },
      ],
    },
  });
});

export default router;
