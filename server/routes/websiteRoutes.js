import express from 'express';
import { getAuditLogs, clearAuditLogs } from '../middleware/auditLogger.js';

const router = express.Router();

// 1. About Information API
router.get('/about', (req, res) => {
  res.status(200).json({
    success: true,
    title: 'ExpenseFlow - Enterprise Personal Finance & Analytics',
    version: '2.0.0',
    description:
      'ExpenseFlow is a modern full-stack web application designed for seamless personal wealth tracking, multi-category budgeting, and academic laboratory syllabus demonstration.',
    architectures: [
      { name: 'Frontend Client', tech: 'React.js 18, Vite, Lucide Icons, Recharts, Vanilla Modern CSS' },
      { name: 'Backend Services', tech: 'Node.js, Express.js 4 REST API, Morgan Logger, CORS' },
      { name: 'Database Hybrid', tech: 'MongoDB / Mongoose ODM + MySQL 8.0 Engine with mysql2 driver' },
    ],
    features: [
      'Dual-database synchronization with live SQL dump generator',
      'Interactive SQL Console with scalar & correlated subquery execution',
      'Real-time cash flow & category spending visual charts',
      'Live Express audit logging terminal with latency tracking',
    ],
  });
});

// 2. Financial Services API
router.get('/services', (req, res) => {
  res.status(200).json({
    success: true,
    services: [
      {
        id: 'budget-tracking',
        title: 'Smart Budget & Expense Tracking',
        description: 'Categorize expenditures across Food, Travel, Bills, Shopping, and Education with automated budget limits.',
        icon: 'Receipt',
      },
      {
        id: 'sql-analytics',
        title: 'Advanced SQL Query Engine',
        description: 'Execute analytical subqueries, derived tables, and aggregates directly against your transaction ledger.',
        icon: 'Database',
      },
      {
        id: 'cash-flow',
        title: 'Income vs Expense Analytics',
        description: 'Visual cash flow graphs and monthly savings rate calculators with Recharts.',
        icon: 'TrendingUp',
      },
      {
        id: 'data-portability',
        title: 'Enterprise Data Portability',
        description: 'One-click export to CSV spreadsheets and full MySQL .sql schema dumps.',
        icon: 'Download',
      },
    ],
  });
});

// In-memory contact messages storage for demo
const contactMessages = [];

// 3. Contact & Support API (GET + POST)
router.get('/contact', (req, res) => {
  res.status(200).json({
    success: true,
    supportEmail: 'support@expenseflow.dev',
    officeLocation: 'Academic Web Technology Lab, Department of Computer Science',
    activeSubmissionsCount: contactMessages.length,
    recentSubmissions: contactMessages.slice(-5),
  });
});

router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
  }

  const newSubmission = {
    id: Date.now(),
    name,
    email,
    subject: subject || 'General Inquiry',
    message,
    receivedAt: new Date().toISOString(),
  };

  contactMessages.push(newSubmission);

  res.status(201).json({
    success: true,
    message: 'Thank you! Your inquiry has been received by the ExpenseFlow server.',
    data: newSubmission,
  });
});

// 4. Live Server Audit Logs API
router.get('/logs', (req, res) => {
  res.status(200).json({
    success: true,
    totalLogs: getAuditLogs().length,
    logs: getAuditLogs(),
  });
});

router.delete('/logs', (req, res) => {
  clearAuditLogs();
  res.status(200).json({ success: true, message: 'Audit logs cleared' });
});

export default router;
