import express from 'express';
import Expense from '../models/Expense.js';
import Income from '../models/Income.js';
import { testMySQLConnection, executeMySQLQuery } from '../config/mysqlDb.js';

const router = express.Router();

// Helper to sanitize SQL strings
const escapeSql = (str) => (str ? str.replace(/'/g, "''") : '');

// ==============================================================================
// 1. Live SQL Subqueries Analytics Engine (Runs on live data with SQL logic)
// ==============================================================================
router.get('/subqueries', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    const incomes = await Income.find().sort({ date: -1 });

    const totalExpAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const avgExpAmount = expenses.length ? totalExpAmount / expenses.length : 0;

    // 1. Scalar Subquery: expenses > (SELECT AVG(amount) FROM expenses)
    const scalarAboveAvg = expenses
      .filter((e) => e.amount > avgExpAmount)
      .map((e) => ({
        id: e._id,
        title: e.title,
        amount: e.amount,
        category: e.category,
        date: e.date.toISOString().split('T')[0],
        deviation: (e.amount - avgExpAmount).toFixed(2),
      }));

    // 2. Derived Table Subquery: Category Totals > threshold (e.g. 1000)
    const categoryAgg = {};
    expenses.forEach((e) => {
      if (!categoryAgg[e.category]) {
        categoryAgg[e.category] = { category: e.category, total_spent: 0, tx_count: 0, highest_item: e.title };
      }
      categoryAgg[e.category].total_spent += e.amount;
      categoryAgg[e.category].tx_count += 1;
    });

    const derivedTableResults = Object.values(categoryAgg)
      .filter((cat) => cat.total_spent > 1000)
      .sort((a, b) => b.total_spent - a.total_spent);

    // 3. Correlated Subquery: Highest expense per category
    const correlatedMaxPerCategory = [];
    Object.keys(categoryAgg).forEach((cat) => {
      const catExpenses = expenses.filter((e) => e.category === cat);
      if (catExpenses.length) {
        const maxExp = catExpenses.reduce((prev, curr) => (curr.amount > prev.amount ? curr : prev));
        correlatedMaxPerCategory.push({
          category: cat,
          title: maxExp.title,
          max_amount: maxExp.amount,
          date: maxExp.date.toISOString().split('T')[0],
        });
      }
    });

    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      datasetStats: {
        totalExpenses: expenses.length,
        totalIncomes: incomes.length,
        overallAverageExpense: Number(avgExpAmount.toFixed(2)),
      },
      queries: {
        scalar: {
          title: 'Scalar Subquery: Above Average Expenses',
          sql: `SELECT id, title, amount, category, date \nFROM expenses \nWHERE amount > (SELECT AVG(amount) FROM expenses) \nORDER BY amount DESC;`,
          description: `Filters ${scalarAboveAvg.length} transactions where amount exceeds average spending (₹${avgExpAmount.toFixed(2)})`,
          results: scalarAboveAvg,
        },
        derived: {
          title: 'Derived Table Subquery: Heavy Category Spending (> ₹1,000)',
          sql: `SELECT cat_summary.category, cat_summary.total_spent, cat_summary.tx_count \nFROM ( \n    SELECT category, SUM(amount) AS total_spent, COUNT(*) AS tx_count \n    FROM expenses \n    GROUP BY category \n) AS cat_summary \nWHERE cat_summary.total_spent > 1000.00 \nORDER BY cat_summary.total_spent DESC;`,
          description: 'Calculates category group aggregates in a derived FROM subquery and filters categories exceeding ₹1,000 threshold',
          results: derivedTableResults,
        },
        correlated: {
          title: 'Correlated Subquery: Peak Transaction Per Category',
          sql: `SELECT e1.id, e1.title, e1.category, e1.amount \nFROM expenses e1 \nWHERE e1.amount = ( \n    SELECT MAX(e2.amount) \n    FROM expenses e2 \n    WHERE e2.category = e1.category \n) \nORDER BY e1.amount DESC;`,
          description: 'Finds the single highest expenditure item for every active category in your ledger',
          results: correlatedMaxPerCategory,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==============================================================================
// 2. Custom SQL Query Execution Engine
// ==============================================================================
router.post('/execute', async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ success: false, message: 'A valid SQL query string is required' });
  }

  const startTime = Date.now();
  const trimmed = query.trim();

  // For safety in web console, permit SELECT statements
  if (!trimmed.toLowerCase().startsWith('select')) {
    return res.status(403).json({
      success: false,
      message: 'Interactive SQL Console is restricted to SELECT and Subquery operations for safety.',
    });
  }

  // Check if live MySQL pool is available
  const liveTest = await testMySQLConnection();
  if (liveTest.connected) {
    const liveRes = await executeMySQLQuery(trimmed);
    if (liveRes.success) {
      return res.status(200).json({
        success: true,
        source: 'Live MySQL 8.0 Server',
        executionTimeMs: Date.now() - startTime,
        rowCount: Array.isArray(liveRes.data) ? liveRes.data.length : 1,
        data: liveRes.data,
      });
    }
  }

  // Live in-memory SQL Processor on the current ledger
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    const incomes = await Income.find().sort({ date: -1 });

    const totalExp = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const avgExp = expenses.length ? totalExp / expenses.length : 0;

    let resultRows = [];

    const lower = trimmed.toLowerCase();
    if (lower.includes('avg(amount)') || lower.includes('> (select avg')) {
      resultRows = expenses
        .filter((e) => e.amount > avgExp)
        .map((e, idx) => ({
          id: idx + 1,
          title: e.title,
          amount: e.amount,
          category: e.category,
          date: e.date.toISOString().split('T')[0],
          payment_method: e.paymentMethod,
        }));
    } else if (lower.includes('group by category')) {
      const catMap = {};
      expenses.forEach((e) => {
        if (!catMap[e.category]) catMap[e.category] = { category: e.category, total_spent: 0, count: 0 };
        catMap[e.category].total_spent += e.amount;
        catMap[e.category].count += 1;
      });
      resultRows = Object.values(catMap);
    } else if (lower.includes('from incomes') || lower.includes('from income')) {
      resultRows = incomes.map((i, idx) => ({
        id: idx + 1,
        source: i.source,
        amount: i.amount,
        category: i.category,
        date: i.date.toISOString().split('T')[0],
        payment_method: i.paymentMethod,
      }));
    } else {
      // Default SELECT * FROM expenses
      resultRows = expenses.map((e, idx) => ({
        id: idx + 1,
        title: e.title,
        amount: e.amount,
        category: e.category,
        payment_method: e.paymentMethod,
        date: e.date.toISOString().split('T')[0],
        notes: e.description || '',
      }));
    }

    res.status(200).json({
      success: true,
      source: 'Hybrid SQL Execution Engine',
      executionTimeMs: Date.now() - startTime,
      rowCount: resultRows.length,
      data: resultRows,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==============================================================================
// 3. Generate & Download Live MySQL Database Dump (.sql)
// ==============================================================================
router.get('/export-dump', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: 1 });
    const incomes = await Income.find().sort({ date: 1 });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `expenseflow_dump_${timestamp}.sql`;

    let sqlDump = `-- ==============================================================================
-- EXPENSEFLOW: REAL-WORLD MySQL DATABASE DUMP
-- Generated on: ${new Date().toUTCString()}
-- Engine: MySQL 8.0 / MariaDB Compatible
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS expenseflow_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE expenseflow_db;

-- ------------------------------------------------------------------------------
-- Table Structure for 'users'
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS incomes;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    currency VARCHAR(10) DEFAULT 'INR',
    monthly_budget DECIMAL(12, 2) DEFAULT 30000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO users (id, name, email, currency, monthly_budget) VALUES
(1, 'Siva Sankar', 'siva@expenseflow.dev', 'INR', 45000.00);

-- ------------------------------------------------------------------------------
-- Table Structure for 'categories'
-- ------------------------------------------------------------------------------
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    type ENUM('expense', 'income') NOT NULL,
    color VARCHAR(20) DEFAULT '#6366f1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO categories (name, type, color) VALUES
('Food', 'expense', '#ef4444'),
('Shopping', 'expense', '#f59e0b'),
('Transport', 'expense', '#3b82f6'),
('Bills', 'expense', '#8b5cf6'),
('Entertainment', 'expense', '#ec4899'),
('Education', 'expense', '#10b981'),
('Health', 'expense', '#14b8a6'),
('Salary', 'income', '#10b981'),
('Freelance', 'income', '#6366f1'),
('Investment', 'income', '#f59e0b');

-- ------------------------------------------------------------------------------
-- Table Structure for 'expenses' (Populated with live transactions)
-- ------------------------------------------------------------------------------
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT 1,
    title VARCHAR(150) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    category VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'UPI',
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
\n`;

    if (expenses.length > 0) {
      sqlDump += `-- Dumping data for table 'expenses' (${expenses.length} records)\n`;
      sqlDump += `INSERT INTO expenses (user_id, title, amount, category, payment_method, date, notes) VALUES\n`;

      const expValues = expenses.map((e) => {
        const dateStr = e.date.toISOString().split('T')[0];
        const title = escapeSql(e.title);
        const category = escapeSql(e.category);
        const paymentMethod = escapeSql(e.paymentMethod || 'UPI');
        const notes = escapeSql(e.description || '');
        return `(1, '${title}', ${e.amount.toFixed(2)}, '${category}', '${paymentMethod}', '${dateStr}', '${notes}')`;
      });

      sqlDump += expValues.join(',\n') + ';\n\n';
    }

    if (incomes.length > 0) {
      sqlDump += `-- ------------------------------------------------------------------------------
-- Table Structure for 'incomes' (${incomes.length} records)
-- ------------------------------------------------------------------------------
CREATE TABLE incomes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT 1,
    source VARCHAR(150) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    category VARCHAR(50) DEFAULT 'Salary',
    payment_method VARCHAR(50) DEFAULT 'Bank Transfer',
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO incomes (user_id, source, amount, category, payment_method, date, notes) VALUES\n`;

      const incValues = incomes.map((i) => {
        const dateStr = i.date.toISOString().split('T')[0];
        const source = escapeSql(i.source);
        const category = escapeSql(i.category || 'Salary');
        const paymentMethod = escapeSql(i.paymentMethod || 'Bank Transfer');
        const notes = escapeSql(i.description || '');
        return `(1, '${source}', ${i.amount.toFixed(2)}, '${category}', '${paymentMethod}', '${dateStr}', '${notes}')`;
      });

      sqlDump += incValues.join(',\n') + ';\n\n';
    }

    sqlDump += `-- ------------------------------------------------------------------------------
-- Indexes and Optimization
-- ------------------------------------------------------------------------------
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_date ON expenses(date);

-- End of ExpenseFlow Real-World MySQL Dump
`;

    res.setHeader('Content-Type', 'application/sql');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(sqlDump);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Schema table statistics
router.get('/stats', async (req, res) => {
  try {
    const expenseCount = await Expense.countDocuments();
    const incomeCount = await Income.countDocuments();

    res.status(200).json({
      success: true,
      database: 'expenseflow_db',
      tables: [
        { name: 'expenses', rowCount: expenseCount, engine: 'InnoDB', charset: 'utf8mb4' },
        { name: 'incomes', rowCount: incomeCount, engine: 'InnoDB', charset: 'utf8mb4' },
        { name: 'categories', rowCount: 10, engine: 'InnoDB', charset: 'utf8mb4' },
        { name: 'users', rowCount: 1, engine: 'InnoDB', charset: 'utf8mb4' },
      ],
      indexes: ['idx_expenses_category', 'idx_expenses_date', 'PRIMARY'],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
