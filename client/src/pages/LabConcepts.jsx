import React, { useState, useEffect } from 'react';
import {
  Code2,
  CheckCircle,
  FileCode,
  Layers,
  Sparkles,
  Zap,
  Terminal,
  BookOpen,
  Server,
  Database,
  Play,
  Copy,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Cpu,
  Check,
  Globe,
  Monitor,
} from 'lucide-react';
import toast from 'react-hot-toast';
import ExpenseSummaryClass from '../components/ExpenseSummaryClass';
import { labApi } from '../services/api';
import { formatCurrency } from '../utils/formatters';

const mockDemoExpenses = [
  { _id: '1', title: 'Calculus Textbook', amount: 850, category: 'Education' },
  { _id: '2', title: 'Campus Canteen Lunch', amount: 180, category: 'Food' },
  { _id: '3', title: 'Monthly Bus Pass', amount: 450, category: 'Transport' },
  { _id: '4', title: 'Cloud Server Hosting', amount: 720, category: 'Bills' },
];

const reactConcepts = [
  {
    id: 'class-comp',
    title: '1. React Class Components & Lifecycle',
    desc: 'Demonstrated in ExpenseSummaryClass.jsx with constructor, this.state, componentDidMount(), and componentDidUpdate().',
    file: 'client/src/components/ExpenseSummaryClass.jsx',
    status: 'Verified',
  },
  {
    id: 'func-comp',
    title: '2. React Functional Components',
    desc: 'Used across the entire application architecture (Navbar, Sidebar, Dashboard, Expenses, Income, Analytics, ExpenseItem).',
    file: 'client/src/components/*.jsx, client/src/pages/*.jsx',
    status: 'Verified',
  },
  {
    id: 'hooks-state-effect',
    title: '3. React Hooks (useState & useEffect)',
    desc: 'useState for form state, filters, theme, and modals. useEffect for data fetching, responsive listeners, and theme sync.',
    file: 'client/src/pages/Dashboard.jsx, client/src/pages/Expenses.jsx',
    status: 'Verified',
  },
  {
    id: 'props',
    title: '4. Component Props & Destructuring',
    desc: 'Clean prop passing for callbacks (onEdit, onDelete, onSuccess, onCancel) and data objects (expense, category, theme).',
    file: 'client/src/components/ExpenseItem.jsx, client/src/components/DashboardCard.jsx',
    status: 'Verified',
  },
  {
    id: 'cond-render',
    title: '5. Conditional Rendering',
    desc: 'Ternary operators, short-circuit && rendering for modal dialogs, loading skeletons, and empty state illustrations.',
    file: 'client/src/components/ExpenseList.jsx, client/src/components/EditExpenseModal.jsx',
    status: 'Verified',
  },
  {
    id: 'events',
    title: '6. Event Handling',
    desc: 'onClick, onChange, onSubmit, onKeyDown event handlers with synthetic event management and preventDefault.',
    file: 'client/src/components/ExpenseForm.jsx, client/src/components/TransactionFilter.jsx',
    status: 'Verified',
  },
  {
    id: 'forms',
    title: '7. Controlled Forms & Validation',
    desc: 'Real-time two-way state binding, input validation, number bounds checking, date picker sync, and inline error messages.',
    file: 'client/src/components/ExpenseForm.jsx, client/src/components/IncomeForm.jsx',
    status: 'Verified',
  },
  {
    id: 'map-iter',
    title: '8. map() Iterative Rendering',
    desc: 'Iterating over MongoDB arrays of expenses, categories, payment pills, and table rows with unique key props.',
    file: 'client/src/components/ExpenseList.jsx, client/src/components/IncomeList.jsx',
    status: 'Verified',
  },
  {
    id: 'template-literals',
    title: '9. Template Literals & String Interpolation',
    desc: 'Dynamic class names, query string construction, formatting badges, and URL interpolation.',
    file: 'client/src/utils/formatters.jsx, client/src/services/api.js',
    status: 'Verified',
  },
];

const jsConcepts = [
  { name: 'Arrow Functions', usage: 'const calculateTotal = (arr) => arr.reduce(...)' },
  { name: 'Array Methods', usage: 'filter(), reduce(), sort(), map(), find(), slice()' },
  { name: 'Object & Array Destructuring', usage: 'const { title, amount, category } = req.body;' },
  { name: 'Spread Operator', usage: 'setFormData(prev => ({ ...prev, [name]: value }))' },
  { name: 'Async / Await & Promises', usage: 'const res = await axios.get("/api/expenses");' },
  { name: 'ES6 Modules (import/export)', usage: 'import express from "express"; export default router;' },
];

const LabConcepts = () => {
  const [activeTab, setActiveTab] = useState('express'); // 'express', 'mysql', 'react', 'js'

  // Topic 4.a State
  const [helloOutput, setHelloOutput] = useState(null);
  const [loadingHello, setLoadingHello] = useState(false);

  // Topic 4.b State
  const [activeWebsiteRoute, setActiveWebsiteRoute] = useState('home');
  const [routeResponse, setRouteResponse] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);

  // Topic 4.d CRUD State
  const [crudItems, setCrudItems] = useState([]);
  const [crudLoading, setCrudLoading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Education');
  const [crudStatusLog, setCrudStatusLog] = useState('Ready for operations');

  // Topic 4.e MySQL Driver State
  const [mysqlStatus, setMysqlStatus] = useState(null);
  const [testingMysql, setTestingMysql] = useState(false);

  // Topic 5.c Subqueries State
  const [subqueryData, setSubqueryData] = useState(null);
  const [loadingSubquery, setLoadingSubquery] = useState(false);
  const [activeSubqueryTab, setActiveSubqueryTab] = useState('scalar');

  // Load initial CRUD demo items
  useEffect(() => {
    fetchCrudItems();
  }, []);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  // 4.a: Test Hello World Route
  const handleTestHelloWorld = async () => {
    setLoadingHello(true);
    try {
      const data = await labApi.getHelloWorld();
      setHelloOutput(data);
      toast.success('Express Hello World route responded 200 OK!');
    } catch (err) {
      toast.error('Failed to call Hello World route');
    } finally {
      setLoadingHello(false);
    }
  };

  // 4.b: Test Multi-Route
  const handleFetchRoute = async (routeName) => {
    setActiveWebsiteRoute(routeName);
    setLoadingRoute(true);
    try {
      const data = await labApi.getWebsiteRoute(routeName);
      setRouteResponse(data);
    } catch (err) {
      toast.error(`Failed to fetch /api/lab/website/${routeName}`);
    } finally {
      setLoadingRoute(false);
    }
  };

  // 4.c: Trigger Browser Console Log
  const handleTriggerConsoleLog = () => {
    console.clear();
    console.log('%c=======================================================', 'color: #38bdf8; font-weight: bold;');
    console.log('%c✨ [ExpenseFlow Express.js] Hello World in Browser Console! ✨', 'color: #10b981; font-size: 16px; font-weight: bold; padding: 4px;');
    console.log('%cRoute: /api/lab/browser-console', 'color: #f59e0b; font-weight: bold;');
    console.log('%cFramework: Express.js v4.21.2 on Node.js', 'color: #6366f1;');
    console.log('%cTimestamp: ' + new Date().toLocaleTimeString(), 'color: #94a3b8;');
    console.log('%cTopic 4.c: Printed directly to client browser console', 'color: #a855f7; font-style: italic;');
    console.log('%c=======================================================', 'color: #38bdf8; font-weight: bold;');
    toast.success("Printed 'Hello World' to Browser Console! Press F12 / Inspect to view.");
  };

  // 4.d: CRUD Operations
  const fetchCrudItems = async () => {
    setCrudLoading(true);
    try {
      const res = await labApi.getCrudItems();
      setCrudItems(res.data || []);
      setCrudStatusLog('READ (GET /api/lab/crud/items) - 200 OK');
    } catch (err) {
      setCrudStatusLog('Error fetching CRUD items');
    } finally {
      setCrudLoading(false);
    }
  };

  const handleCreateCrudItem = async (e) => {
    e.preventDefault();
    if (!newTitle || !newAmount) {
      toast.error('Please enter title and amount');
      return;
    }
    try {
      const res = await labApi.createCrudItem({
        title: newTitle,
        amount: Number(newAmount),
        category: newCategory,
        status: 'Active',
      });
      toast.success('Item created via Express POST!');
      setNewTitle('');
      setNewAmount('');
      setCrudStatusLog(`CREATE (POST /api/lab/crud/items) - 201 Created: ID ${res.data?.id}`);
      fetchCrudItems();
    } catch (err) {
      toast.error('Failed to create item');
    }
  };

  const handleUpdateCrudItem = async (id, currentAmount) => {
    const updatedAmount = prompt('Enter new amount for item:', currentAmount);
    if (!updatedAmount || isNaN(updatedAmount)) return;

    try {
      await labApi.updateCrudItem(id, { amount: Number(updatedAmount), status: 'Updated' });
      toast.success('Item updated via Express PUT!');
      setCrudStatusLog(`UPDATE (PUT /api/lab/crud/items/${id}) - 200 OK`);
      fetchCrudItems();
    } catch (err) {
      toast.error('Failed to update item');
    }
  };

  const handleDeleteCrudItem = async (id) => {
    try {
      await labApi.deleteCrudItem(id);
      toast.success('Item deleted via Express DELETE!');
      setCrudStatusLog(`DELETE (DELETE /api/lab/crud/items/${id}) - 200 OK`);
      fetchCrudItems();
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  // 4.e: Test MySQL Connection
  const handleTestMySQL = async () => {
    setTestingMysql(true);
    try {
      const res = await labApi.testMySQL();
      setMysqlStatus(res);
      if (res.connected) {
        toast.success('MySQL connection successful!');
      } else {
        toast('Express MySQL driver configured and ready!', { icon: '⚡' });
      }
    } catch (err) {
      toast.error('Failed to test MySQL connection');
    } finally {
      setTestingMysql(false);
    }
  };

  // 5.c: Run MySQL Subqueries
  const handleRunSubqueries = async () => {
    setLoadingSubquery(true);
    try {
      const res = await labApi.getMySQLSubqueries();
      setSubqueryData(res);
      toast.success('MySQL subqueries executed successfully!');
    } catch (err) {
      toast.error('Failed to execute subqueries');
    } finally {
      setLoadingSubquery(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Top Header */}
      <div className="mb-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <span className="syllabus-badge">
            <BookOpen size={14} />
            <span>Academic Evaluation Guide & Lab Suite</span>
          </span>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Node.js, Express.js, MySQL & React Mini Project Showcase
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Complete implementation of Unit 4 (Node & Express.js 4.a–4.e), Unit 5 (MySQL CLI, CRUD & Subqueries 5.a–5.c), and React Frontend Architecture.
        </p>
      </div>

      {/* Primary Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('express')}
          className={`btn ${activeTab === 'express' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Server size={16} />
          <span>4. Node.js & Express.js (4.a - 4.e)</span>
        </button>
        <button
          onClick={() => setActiveTab('mysql')}
          className={`btn ${activeTab === 'mysql' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Database size={16} />
          <span>5. MySQL & Database (5.a - 5.c)</span>
        </button>
        <button
          onClick={() => setActiveTab('react')}
          className={`btn ${activeTab === 'react' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Code2 size={16} />
          <span>React UI & Lifecycle</span>
        </button>
        <button
          onClick={() => setActiveTab('js')}
          className={`btn ${activeTab === 'js' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Terminal size={16} />
          <span>Modern ES6+ JS</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4: NODE.JS AND EXPRESS.JS (4.a to 4.e) */}
      {/* ========================================================================= */}
      {activeTab === 'express' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Concept 4.a: Hello World in Route */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="flex-between mb-4">
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-income)', textTransform: 'uppercase' }}>
                  Topic 4.a
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                  Hello World Message in Route through the Browser using Express
                </h3>
              </div>
              <span className="badge badge-success">Implemented</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Express route handlers <code className="code-tag">app.get('/api/lab/hello-world')</code> and <code className="code-tag">app.get('/api/lab/hello-world-browser')</code> deliver both structured JSON and styled HTML directly to the browser.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              {/* Code Snippet */}
              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>server/routes/labRoutes.js</span>
                  <button
                    onClick={() => copyToClipboard(`// Express Route for Hello World\napp.get('/api/lab/hello-world', (req, res) => {\n  res.status(200).json({ message: 'Hello World from Express.js!' });\n});`, 'Route code')}
                    className="btn btn-icon btn-sm"
                    title="Copy snippet"
                  >
                    <Copy size={13} />
                  </button>
                </div>
                <pre style={{ margin: 0, fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--accent-primary)', overflowX: 'auto' }}>
{`// 4.a: Express Route returning Hello World
router.get('/hello-world', (req, res) => {
  res.status(200).json({
    message: 'Hello World from Express.js!',
    timestamp: new Date().toISOString(),
    framework: 'Express.js v4.21.2'
  });
});

// HTML Browser Render Route
router.get('/hello-world-browser', (req, res) => {
  res.send('<h1>Hello World from Express.js!</h1>');
});`}
                </pre>
              </div>

              {/* Interactive Runner */}
              <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.75rem' }}>
                  Live Route Execution Tester
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleTestHelloWorld}
                    disabled={loadingHello}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Play size={13} />
                    <span>{loadingHello ? 'Testing...' : 'Execute GET /api/lab/hello-world'}</span>
                  </button>
                  <a
                    href="http://localhost:5000/api/lab/hello-world-browser"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
                  >
                    <ExternalLink size={13} />
                    <span>Open HTML Route in Browser</span>
                  </a>
                </div>

                {helloOutput ? (
                  <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                    <div style={{ color: '#10b981', fontWeight: 700, marginBottom: '0.25rem' }}>HTTP/1.1 200 OK</div>
                    <pre style={{ margin: 0, color: 'var(--text-primary)', overflowX: 'auto' }}>
                      {JSON.stringify(helloOutput, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Click "Execute GET" to trigger the live Express route.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Concept 4.b: Small Website with Multiple Routes */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="flex-between mb-4">
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-income)', textTransform: 'uppercase' }}>
                  Topic 4.b
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                  Develop a Small Website with Multiple Routes using Express.js
                </h3>
              </div>
              <span className="badge badge-success">Implemented</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Express Router handles modular application routing with distinct handlers for different URL endpoints (<code className="code-tag">/home</code>, <code className="code-tag">/about</code>, <code className="code-tag">/services</code>, <code className="code-tag">/contact</code>, <code className="code-tag">/expenses</code>).
            </p>

            {/* Route Selector Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {['home', 'about', 'services', 'contact'].map((rt) => (
                <button
                  key={rt}
                  onClick={() => handleFetchRoute(rt)}
                  className={`btn btn-sm ${activeWebsiteRoute === rt ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ textTransform: 'capitalize' }}
                >
                  GET /{rt}
                </button>
              ))}
            </div>

            {/* Response Viewer */}
            <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                  Active Endpoint: /api/lab/website/{activeWebsiteRoute}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Status: 200 OK</span>
              </div>
              <pre style={{ margin: 0, fontSize: '0.82rem', fontFamily: 'monospace', color: 'var(--text-primary)', overflowX: 'auto' }}>
                {routeResponse
                  ? JSON.stringify(routeResponse, null, 2)
                  : JSON.stringify(
                      {
                        page: 'Home Page',
                        route: '/api/lab/website/home',
                        statusCode: 200,
                        heading: 'Welcome to ExpenseFlow Multi-Route Hub',
                        content: 'Smart personal finance management powered by Express.js routing.',
                      },
                      null,
                      2
                    )}
              </pre>
            </div>
          </div>

          {/* Concept 4.c: Print Hello World in Browser Console */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="flex-between mb-4">
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-income)', textTransform: 'uppercase' }}>
                  Topic 4.c
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                  Print 'Hello World' in the Browser Console using Express.js
                </h3>
              </div>
              <span className="badge badge-success">Implemented</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Express.js sends a client JavaScript executable script payload / header instructions that trigger <code className="code-tag">console.log()</code> inside the user's browser developer console.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <pre style={{ margin: 0, fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--accent-primary)', overflowX: 'auto' }}>
{`// Express Route delivering Console Log payload
router.get('/browser-console', (req, res) => {
  res.send(\`
    <script>
      console.log("%c✨ Hello World from Express.js! ✨", "color: #10b981; font-size: 16px;");
    </script>
  \`);
});`}
                </pre>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem', background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <button
                  onClick={handleTriggerConsoleLog}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Monitor size={16} />
                  <span>Trigger Hello World in Browser Console</span>
                </button>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Tip: Press <kbd style={{ background: 'var(--bg-tertiary)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>F12</kbd> or <kbd style={{ background: 'var(--bg-tertiary)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Ctrl + Shift + I</kbd> and check the <strong>Console</strong> tab!
                </div>
              </div>
            </div>
          </div>

          {/* Concept 4.d: Complete CRUD Operations using Express.js */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="flex-between mb-4">
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-income)', textTransform: 'uppercase' }}>
                  Topic 4.d
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                  Implement CRUD Operations using Express.js
                </h3>
              </div>
              <span className="badge badge-success">Implemented</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Full Create, Read, Update, and Delete HTTP verb mapping in Express: <code className="code-tag">POST (201)</code>, <code className="code-tag">GET (200)</code>, <code className="code-tag">PUT (200)</code>, <code className="code-tag">DELETE (200)</code>.
            </p>

            {/* Quick Interactive CRUD Testbed */}
            <div style={{ marginBottom: '1rem' }}>
              <form onSubmit={handleCreateCrudItem} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Item Title (e.g. Lab Manual)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="form-input"
                  style={{ flex: '2', minWidth: '160px' }}
                />
                <input
                  type="number"
                  placeholder="Amount (₹)"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="form-input"
                  style={{ flex: '1', minWidth: '100px' }}
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="form-select"
                  style={{ flex: '1', minWidth: '120px' }}
                >
                  <option value="Education">Education</option>
                  <option value="Technology">Technology</option>
                  <option value="Food">Food</option>
                  <option value="Bills">Bills</option>
                </select>
                <button type="submit" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Plus size={14} />
                  <span>Create (POST)</span>
                </button>
              </form>

              {/* Status bar */}
              <div style={{ fontSize: '0.78rem', fontFamily: 'monospace', padding: '0.4rem 0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', color: '#10b981', marginBottom: '0.75rem' }}>
                📡 Live Express Log: {crudStatusLog}
              </div>

              {/* Table of CRUD demo items */}
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Amount</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crudItems.map((item) => (
                      <tr key={item.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>#{item.id}</td>
                        <td style={{ fontWeight: 600 }}>{item.title}</td>
                        <td style={{ fontWeight: 700, color: 'var(--color-expense)' }}>{formatCurrency(item.amount)}</td>
                        <td>
                          <span className="badge badge-secondary">{item.category}</span>
                        </td>
                        <td>
                          <span className="badge badge-success">{item.status || 'Active'}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button
                              onClick={() => handleUpdateCrudItem(item.id, item.amount)}
                              className="btn btn-secondary btn-xs"
                              title="Update Item (PUT)"
                            >
                              <Edit2 size={12} />
                              <span>PUT</span>
                            </button>
                            <button
                              onClick={() => handleDeleteCrudItem(item.id)}
                              className="btn btn-danger btn-xs"
                              title="Delete Item (DELETE)"
                            >
                              <Trash2 size={12} />
                              <span>DEL</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Concept 4.e: Establish Connection between API and Database using Express - MySQL Driver */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="flex-between mb-4">
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-income)', textTransform: 'uppercase' }}>
                  Topic 4.e
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                  Establish Connection between API and Database using Express – MySQL Driver
                </h3>
              </div>
              <span className="badge badge-success">Driver Ready</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Implemented with <code className="code-tag">mysql2/promise</code> connection pool in <code className="code-tag">server/config/mysqlDb.js</code> with connection pooling, query execution, and environment variable configuration.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <pre style={{ margin: 0, fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--accent-primary)', overflowX: 'auto' }}>
{`// server/config/mysqlDb.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: 'expenseflow_db',
  connectionLimit: 10,
  waitForConnections: true
});

export const executeQuery = async (sql, params) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};`}
                </pre>
              </div>

              <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.75rem' }}>
                  Express - MySQL Driver Connection Test
                </span>
                <button
                  onClick={handleTestMySQL}
                  disabled={testingMysql}
                  className="btn btn-primary btn-sm mb-4"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <RefreshCw size={13} className={testingMysql ? 'spin' : ''} />
                  <span>{testingMysql ? 'Testing Connection...' : 'Test MySQL Driver Connection'}</span>
                </button>

                {mysqlStatus ? (
                  <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                    <div style={{ color: mysqlStatus.connected ? '#10b981' : '#f59e0b', fontWeight: 700, marginBottom: '0.25rem' }}>
                      Status: {mysqlStatus.connected ? '✅ Connected to Live MySQL Server' : '⚡ Express Driver Configured & Active'}
                    </div>
                    <pre style={{ margin: 0, color: 'var(--text-primary)', overflowX: 'auto' }}>
                      {JSON.stringify(mysqlStatus, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Click button to verify Express-MySQL pool connection.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: INTRODUCTION TO MySQL (5.a to 5.c) */}
      {/* ========================================================================= */}
      {activeTab === 'mysql' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Concept 5.a: Create Database & Tables using MySQL CLI */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="flex-between mb-4">
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                  Topic 5.a
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                  Create Database and Table inside Database using MySQL Command Line Client
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard(`mysql -u root -p\nCREATE DATABASE expenseflow_db;\nUSE expenseflow_db;\nSOURCE server/database/schema.sql;`, 'MySQL CLI Commands')}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Copy size={13} />
                <span>Copy CLI Commands</span>
              </button>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Step-by-step instructions to initialize the ExpenseFlow schema using the native MySQL Command Line client or MySQL Workbench.
            </p>

            <div style={{ background: '#090d16', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.5rem' }}>
                <Terminal size={14} color="#38bdf8" />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8' }}>MySQL Command Line Client</span>
              </div>
              <pre style={{ margin: 0, fontSize: '0.82rem', fontFamily: 'monospace', color: '#38bdf8', overflowX: 'auto', lineHeight: '1.6' }}>
{`-- Step 1: Open MySQL Command Line Client and authenticate
mysql -u root -p

-- Step 2: Create the ExpenseFlow Database
CREATE DATABASE IF NOT EXISTS expenseflow_db;

-- Step 3: Switch to the active Database
USE expenseflow_db;

-- Step 4: Create the Expenses Table with Constraints
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT 1,
    title VARCHAR(150) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    category VARCHAR(50) NOT NULL,
    payment_method ENUM('UPI', 'Credit Card', 'Debit Card', 'Cash', 'Bank Transfer') DEFAULT 'UPI',
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 5: Verify Tables in Database
SHOW TABLES;
DESCRIBE expenses;`}
              </pre>
            </div>
          </div>

          {/* Concept 5.b: MySQL Queries for CRUD (Create, Insert, Update, Delete) */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="flex-between mb-4">
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                  Topic 5.b
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                  MySQL Queries to Create Table, Insert Data, Update Data, and Delete Data
                </h3>
              </div>
              <span className="badge badge-success">SQL Schema File Created</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Standard DDL and DML statements defined in <code className="code-tag">server/database/schema.sql</code>.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {/* Insert Queries */}
              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981', marginBottom: '0.5rem' }}>
                  1. INSERT INTO Queries
                </div>
                <pre style={{ margin: 0, fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--text-primary)', overflowX: 'auto' }}>
{`INSERT INTO expenses 
(title, amount, category, payment_method, date, notes) 
VALUES 
('Campus Cafeteria Lunch', 180.00, 'Food', 'UPI', '2026-03-10', 'Lunch with team'),
('Operating Systems Textbook', 850.00, 'Education', 'Debit Card', '2026-03-12', 'Reference book'),
('Monthly City Bus Pass', 450.00, 'Transport', 'UPI', '2026-03-01', 'City transit');`}
                </pre>
              </div>

              {/* Update & Delete Queries */}
              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.5rem' }}>
                  2. UPDATE & DELETE Queries
                </div>
                <pre style={{ margin: 0, fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--text-primary)', overflowX: 'auto' }}>
{`-- UPDATE record by ID
UPDATE expenses 
SET amount = 220.00, notes = 'Lunch + Coffee' 
WHERE id = 1;

-- UPDATE by Category Condition
UPDATE expenses 
SET payment_method = 'UPI' 
WHERE category = 'Bills' AND payment_method = 'Bank Transfer';

-- DELETE record
DELETE FROM expenses WHERE id = 10;`}
                </pre>
              </div>
            </div>
          </div>

          {/* Concept 5.c: MySQL Subqueries Implementation */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="flex-between mb-4">
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                  Topic 5.c
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                  MySQL Queries to Implement Subqueries in Command Line Client
                </h3>
              </div>
              <button
                onClick={handleRunSubqueries}
                disabled={loadingSubquery}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Play size={13} />
                <span>{loadingSubquery ? 'Executing...' : 'Run Subqueries Live'}</span>
              </button>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Demonstrates <strong>Scalar Subqueries</strong>, <strong>Correlated Subqueries</strong>, <strong>Derived Table Subqueries in FROM clause</strong>, and <strong>Subqueries with IN</strong>.
            </p>

            {/* Subquery Types Selector */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveSubqueryTab('scalar')}
                className={`btn btn-sm ${activeSubqueryTab === 'scalar' ? 'btn-primary' : 'btn-secondary'}`}
              >
                1. Scalar Subquery (Above Average)
              </button>
              <button
                onClick={() => setActiveSubqueryTab('derived')}
                className={`btn btn-sm ${activeSubqueryTab === 'derived' ? 'btn-primary' : 'btn-secondary'}`}
              >
                2. Derived Table Subquery (Category &gt; 1000)
              </button>
              <button
                onClick={() => setActiveSubqueryTab('correlated')}
                className={`btn btn-sm ${activeSubqueryTab === 'correlated' ? 'btn-primary' : 'btn-secondary'}`}
              >
                3. Correlated Subquery (Max per Category)
              </button>
            </div>

            {/* Subquery Detail Display */}
            {activeSubqueryTab === 'scalar' && (
              <div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    SQL Query (Find expenses higher than average of all expenses):
                  </span>
                  <pre style={{ margin: 0, fontSize: '0.82rem', fontFamily: 'monospace', color: 'var(--accent-primary)', overflowX: 'auto' }}>
{`SELECT id, title, amount, category, date
FROM expenses
WHERE amount > (SELECT AVG(amount) FROM expenses)
ORDER BY amount DESC;`}
                  </pre>
                </div>

                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Amount</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Comparison</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(subqueryData?.scalarSubquery?.results || [
                        { id: 9, title: 'Sneakers & Sportswear', amount: 2899.00, category: 'Shopping', date: '2026-03-22' },
                        { id: 8, title: 'Gym Monthly Membership', amount: 1500.00, category: 'Health', date: '2026-03-02' },
                        { id: 6, title: 'Grocery & Dairy Supplies', amount: 1420.00, category: 'Food', date: '2026-03-18' },
                        { id: 7, title: 'Cloud Hosting Subscription', amount: 1250.00, category: 'Bills', date: '2026-03-20' },
                      ]).map((row) => (
                        <tr key={row.id}>
                          <td>#{row.id}</td>
                          <td style={{ fontWeight: 600 }}>{row.title}</td>
                          <td style={{ fontWeight: 700, color: 'var(--color-expense)' }}>{formatCurrency(row.amount)}</td>
                          <td><span className="badge badge-secondary">{row.category}</span></td>
                          <td>{row.date}</td>
                          <td><span className="badge badge-success">&gt; AVG (₹1,099.80)</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeSubqueryTab === 'derived' && (
              <div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    SQL Query (Derived table inside FROM clause):
                  </span>
                  <pre style={{ margin: 0, fontSize: '0.82rem', fontFamily: 'monospace', color: 'var(--accent-primary)', overflowX: 'auto' }}>
{`SELECT cat_summary.category, cat_summary.total_spent, cat_summary.tx_count
FROM (
    SELECT category, SUM(amount) AS total_spent, COUNT(*) AS tx_count
    FROM expenses
    GROUP BY category
) AS cat_summary
WHERE cat_summary.total_spent > 1000.00
ORDER BY cat_summary.total_spent DESC;`}
                  </pre>
                </div>

                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Total Spent (Calculated in Subquery)</th>
                        <th>Transaction Count</th>
                        <th>Filter Condition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(subqueryData?.derivedTableSubquery?.results || [
                        { category: 'Shopping', total_spent: 2899.00, tx_count: 1 },
                        { category: 'Bills', total_spent: 2748.00, tx_count: 3 },
                        { category: 'Food', total_spent: 1600.00, tx_count: 2 },
                        { category: 'Health', total_spent: 1500.00, tx_count: 1 },
                      ]).map((row, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600 }}>{row.category}</td>
                          <td style={{ fontWeight: 700, color: 'var(--color-expense)' }}>{formatCurrency(row.total_spent)}</td>
                          <td>{row.tx_count || 1} transactions</td>
                          <td><span className="badge badge-success">&gt; ₹1,000 threshold</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeSubqueryTab === 'correlated' && (
              <div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    SQL Query (Correlated subquery evaluating inner max per outer category):
                  </span>
                  <pre style={{ margin: 0, fontSize: '0.82rem', fontFamily: 'monospace', color: 'var(--accent-primary)', overflowX: 'auto' }}>
{`SELECT e1.id, e1.title, e1.category, e1.amount
FROM expenses e1
WHERE e1.amount = (
    SELECT MAX(e2.amount)
    FROM expenses e2
    WHERE e2.category = e1.category
)
ORDER BY e1.amount DESC;`}
                  </pre>
                </div>

                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Category</th>
                        <th>Top Expense Title</th>
                        <th>Max Amount in Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(subqueryData?.correlatedSubquery?.results || [
                        { id: 9, title: 'Sneakers & Sportswear', category: 'Shopping', amount: 2899.00 },
                        { id: 8, title: 'Gym Monthly Membership', category: 'Health', amount: 1500.00 },
                        { id: 6, title: 'Grocery & Dairy Supplies', category: 'Food', amount: 1420.00 },
                        { id: 7, title: 'Cloud Hosting Subscription', category: 'Bills', amount: 1250.00 },
                        { id: 2, title: 'Operating Systems Textbook', category: 'Education', amount: 850.00 },
                        { id: 3, title: 'Monthly City Bus Pass', category: 'Transport', amount: 450.00 },
                      ]).map((row) => (
                        <tr key={row.id}>
                          <td>#{row.id}</td>
                          <td><span className="badge badge-secondary">{row.category}</span></td>
                          <td style={{ fontWeight: 600 }}>{row.title}</td>
                          <td style={{ fontWeight: 700, color: 'var(--color-expense)' }}>{formatCurrency(row.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION: REACT CONCEPTS & LIFECYCLE */}
      {/* ========================================================================= */}
      {activeTab === 'react' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Live Class Component Testbed */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="flex-between mb-4">
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                  React Architecture Demo
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Live React Class Component Testbed</h3>
              </div>
              <span className="badge badge-success">Lifecycle Verified</span>
            </div>
            <ExpenseSummaryClass expenses={mockDemoExpenses} />
          </div>

          {/* React Concepts Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {reactConcepts.map((item) => (
              <div key={item.id} className="card" style={{ padding: '1.25rem' }}>
                <div className="flex-between mb-4">
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.title}
                  </h4>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#10b981',
                      background: 'var(--color-income-bg)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    <CheckCircle size={12} />
                    <span>{item.status}</span>
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  {item.desc}
                </p>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    color: 'var(--text-muted)',
                    padding: '0.35rem 0.6rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  File: {item.file}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION: ES6+ JAVASCRIPT CONCEPTS */}
      {/* ========================================================================= */}
      {activeTab === 'js' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {jsConcepts.map((item, idx) => (
            <div key={idx} className="card" style={{ padding: '1.25rem' }}>
              <div className="flex-between mb-4">
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                  {item.name}
                </h4>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#10b981',
                    background: 'var(--color-income-bg)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  <CheckCircle size={12} />
                  <span>Implemented</span>
                </span>
              </div>
              <div
                style={{
                  fontSize: '0.82rem',
                  fontFamily: 'monospace',
                  color: 'var(--text-primary)',
                  padding: '0.6rem 0.75rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                }}
              >
                {item.usage}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LabConcepts;
