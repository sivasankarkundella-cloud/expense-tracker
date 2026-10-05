import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import expenseRoutes from './routes/expenseRoutes.js';
import incomeRoutes from './routes/incomeRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import seedRoutes from './routes/seedRoutes.js';
import labRoutes from './routes/labRoutes.js';
import sqlAnalyticsRoutes from './routes/sqlAnalyticsRoutes.js';
import websiteRoutes from './routes/websiteRoutes.js';
import { auditLoggerMiddleware } from './middleware/auditLogger.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import Expense from './models/Expense.js';
import Income from './models/Income.js';
import { seedDatabase } from './seedData.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(async () => {
  try {
    // Auto-seed if database is currently empty
    const expCount = await Expense.countDocuments();
    const incCount = await Income.countDocuments();
    if (expCount === 0 && incCount === 0) {
      console.log('✨ Fresh database detected. Auto-seeding initial sample data for demonstration...');
      await seedDatabase();
      console.log('✅ Initial seed data ready!');
    }
  } catch (err) {
    console.warn('⚠️ Auto-seed check notice:', err.message);
  }
});

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(auditLoggerMiddleware);

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Root & API Welcome Landing Portal
app.get(['/', '/api'], (req, res) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  
  // Return interactive HTML landing page if requested by a browser
  if (req.accepts('html')) {
    return res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ExpenseFlow API & System Portal</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(26, 32, 53, 0.65);
      --card-border: rgba(255, 255, 255, 0.1);
      --primary: #6366f1;
      --primary-glow: rgba(99, 102, 241, 0.35);
      --secondary: #10b981;
      --accent: #f59e0b;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background: radial-gradient(circle at 50% 0%, #1e1b4b 0%, var(--bg) 60%);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
    }
    .container {
      max-width: 900px;
      width: 100%;
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--card-border);
      border-radius: 24px;
      padding: 3rem 2.5rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px var(--primary-glow);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      margin-bottom: 1.25rem;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10b981;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 2.75rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.75rem;
    }
    p.subtitle {
      color: var(--text-muted);
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 2rem;
    }
    .cta-group {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2.5rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.9rem 1.8rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 12px;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff;
      box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 30px -5px rgba(99, 102, 241, 0.7);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
    .routes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    .route-card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 1.25rem;
      transition: border-color 0.2s ease, transform 0.2s ease;
      text-decoration: none;
      display: block;
      color: inherit;
    }
    .route-card:hover {
      border-color: rgba(99, 102, 241, 0.5);
      transform: translateY(-2px);
    }
    .route-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
      display: inline-block;
    }
    .badge-get { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .badge-post { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
    .route-title { font-weight: 600; font-size: 1rem; margin-bottom: 0.25rem; }
    .route-path { font-family: monospace; color: #a5b4fc; font-size: 0.85rem; }
    .footer {
      margin-top: 2rem;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.85rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 1.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">
      <div class="status-dot"></div>
      ExpenseFlow Backend Active (Port ${PORT})
    </div>
    <h1>ExpenseFlow API & System Engine</h1>
    <p class="subtitle">
      Enterprise full-stack personal finance tracker, SQL analytics execution engine, and RESTful API suite.
    </p>

    <div class="cta-group">
      <a href="${clientUrl}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
        🚀 Open Frontend Web App (Port 5173)
      </a>
      <a href="/api/health" class="btn btn-secondary">
        📊 Health Status Check
      </a>
      <a href="/api/sql/export-dump" class="btn btn-secondary" download="expenseflow_dump.sql">
        💾 Export MySQL Dump (.sql)
      </a>
    </div>

    <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.75rem; color: #cbd5e1;">
      Available API Endpoints
    </h3>
    
    <div class="routes-grid">
      <a href="/api/dashboard/summary" class="route-card">
        <span class="route-badge badge-get">GET</span>
        <div class="route-title">Dashboard Summary</div>
        <div class="route-path">/api/dashboard/summary</div>
      </a>
      <a href="/api/expenses" class="route-card">
        <span class="route-badge badge-get">GET</span>
        <div class="route-title">Expenses Collection</div>
        <div class="route-path">/api/expenses</div>
      </a>
      <a href="/api/income" class="route-card">
        <span class="route-badge badge-get">GET</span>
        <div class="route-title">Income Sources</div>
        <div class="route-path">/api/income</div>
      </a>
      <a href="/api/sql/subqueries" class="route-card">
        <span class="route-badge badge-get">GET</span>
        <div class="route-title">SQL Subqueries Engine</div>
        <div class="route-path">/api/sql/subqueries</div>
      </a>
      <a href="/api/website/about" class="route-card">
        <span class="route-badge badge-get">GET</span>
        <div class="route-title">About & Services Info</div>
        <div class="route-path">/api/website/about</div>
      </a>
      <a href="/api/website/logs" class="route-card">
        <span class="route-badge badge-get">GET</span>
        <div class="route-title">Live Express Audit Logs</div>
        <div class="route-path">/api/website/logs</div>
      </a>
    </div>

    <div class="footer">
      ExpenseFlow Personal Finance & SQL Subquery Engine &bull; Environment: <strong>${process.env.NODE_ENV || 'development'}</strong>
    </div>
  </div>
</body>
</html>
    `);
  }

  // JSON response for API clients / tools
  res.status(200).json({
    success: true,
    app: 'ExpenseFlow API Engine',
    version: '1.0.0',
    status: 'ONLINE',
    environment: process.env.NODE_ENV || 'development',
    frontendUrl: clientUrl,
    healthCheck: `http://localhost:${PORT}/api/health`,
    routes: {
      dashboard: '/api/dashboard/summary',
      expenses: '/api/expenses',
      income: '/api/income',
      sqlSubqueries: '/api/sql/subqueries',
      sqlExecute: '/api/sql/execute',
      sqlDumpExport: '/api/sql/export-dump',
      websiteAbout: '/api/website/about',
      websiteServices: '/api/website/services',
      websiteLogs: '/api/website/logs',
      labSuite: '/api/lab/hello-world',
    },
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    app: 'ExpenseFlow API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/sql', sqlAnalyticsRoutes);
app.use('/api/website', websiteRoutes);

// 404 and Error Middleware
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`💳 ExpenseFlow API Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================\n`);
});

export default app;
