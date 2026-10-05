import React, { useState, useEffect } from 'react';
import {
  Database,
  Play,
  Download,
  Copy,
  Terminal,
  CheckCircle2,
  Layers,
  Sparkles,
  Table,
  RefreshCw,
  Search,
  Code2,
  Server,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { sqlApi, labApi } from '../services/api';
import { formatCurrency } from '../utils/formatters';

const presetQueries = [
  {
    id: 'scalar',
    name: '1. Above-Average Spending (Scalar Subquery)',
    sql: `SELECT id, title, amount, category, date\nFROM expenses\nWHERE amount > (SELECT AVG(amount) FROM expenses)\nORDER BY amount DESC;`,
    description: 'Finds transactions where spending exceeds the calculated average of all expenses.',
  },
  {
    id: 'derived',
    name: '2. Heavy Category Spending > ₹1,000 (Derived Table)',
    sql: `SELECT cat_summary.category, cat_summary.total_spent\nFROM (\n    SELECT category, SUM(amount) AS total_spent\n    FROM expenses\n    GROUP BY category\n) AS cat_summary\nWHERE cat_summary.total_spent > 1000\nORDER BY cat_summary.total_spent DESC;`,
    description: 'Calculates category group totals inside a subquery and filters for categories > ₹1,000.',
  },
  {
    id: 'all_expenses',
    name: '3. Full Expense Ledger View',
    sql: `SELECT id, title, amount, category, payment_method, date\nFROM expenses\nORDER BY date DESC;`,
    description: 'Standard SELECT query retrieving all current transactions.',
  },
  {
    id: 'incomes',
    name: '4. Full Income Streams View',
    sql: `SELECT id, source, amount, category, date\nFROM incomes\nORDER BY amount DESC;`,
    description: 'Retrieves all income sources sorted by highest earnings.',
  },
];

const SqlConsole = () => {
  const [customQuery, setCustomQuery] = useState(presetQueries[0].sql);
  const [queryResult, setQueryResult] = useState(null);
  const [loadingQuery, setLoadingQuery] = useState(false);
  const [subqueryAnalytics, setSubqueryAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [schemaStats, setSchemaStats] = useState(null);
  const [activeViewTab, setActiveViewTab] = useState('console'); // 'console', 'analytics', 'schema', 'dump'

  useEffect(() => {
    loadSubqueryAnalytics();
    loadSchemaStats();
    handleRunQuery(presetQueries[0].sql);
  }, []);

  const loadSubqueryAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await sqlApi.getSubqueries();
      setSubqueryAnalytics(res);
    } catch (err) {
      console.warn('Could not load subquery analytics', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const loadSchemaStats = async () => {
    try {
      const res = await sqlApi.getStats();
      setSchemaStats(res);
    } catch (err) {
      console.warn('Could not load schema stats', err);
    }
  };

  const handleRunQuery = async (queryToRun) => {
    const q = queryToRun || customQuery;
    if (!q || !q.trim()) {
      toast.error('Please enter a SQL query');
      return;
    }
    setLoadingQuery(true);
    try {
      const res = await sqlApi.executeQuery(q);
      setQueryResult(res);
      toast.success(`SQL Query Executed (${res.rowCount || 0} rows in ${res.executionTimeMs || 0}ms)`);
    } catch (err) {
      toast.error(err.message || 'SQL execution failed');
      setQueryResult(null);
    } finally {
      setLoadingQuery(false);
    }
  };

  const handleSelectPreset = (preset) => {
    setCustomQuery(preset.sql);
    handleRunQuery(preset.sql);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="flex-between mb-4" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <span className="syllabus-badge">
              <Database size={14} />
              <span>Real-World SQL Engine</span>
            </span>
            <span className="badge badge-success">MySQL 8.0 Compatible</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            SQL Query Engine & Database Manager
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Execute real-time analytical SQL subqueries, query your live transactions, and generate MySQL database dumps.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <a
            href={sqlApi.getExportDumpUrl()}
            download="expenseflow_dump.sql"
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
          >
            <Download size={14} />
            <span>Download .SQL Dump</span>
          </a>
          <button
            onClick={loadSubqueryAnalytics}
            className="btn btn-secondary btn-sm"
            title="Refresh Analytics"
          >
            <RefreshCw size={14} className={loadingAnalytics ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveViewTab('console')}
          className={`btn ${activeViewTab === 'console' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Terminal size={15} />
          <span>Interactive SQL Console</span>
        </button>
        <button
          onClick={() => setActiveViewTab('analytics')}
          className={`btn ${activeViewTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Zap size={15} />
          <span>Advanced Subquery Analytics</span>
        </button>
        <button
          onClick={() => setActiveViewTab('schema')}
          className={`btn ${activeViewTab === 'schema' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Table size={15} />
          <span>Database Schema &amp; Tables</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. INTERACTIVE SQL CONSOLE */}
      {/* ========================================================================= */}
      {activeViewTab === 'console' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Preset Buttons */}
          <div className="card" style={{ padding: '1rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              Quick Subquery & Analytics Presets:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {presetQueries.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className="btn btn-secondary btn-xs"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Code2 size={12} />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Query Editor & Action Panel */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div className="flex-between mb-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Terminal size={16} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>SQL Query Input</h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => copyToClipboard(customQuery, 'SQL Query')}
                  className="btn btn-secondary btn-xs"
                >
                  <Copy size={12} />
                  <span>Copy SQL</span>
                </button>
                <button
                  onClick={() => handleRunQuery()}
                  disabled={loadingQuery}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Play size={13} />
                  <span>{loadingQuery ? 'Executing...' : 'Run Query (Ctrl + Enter)'}</span>
                </button>
              </div>
            </div>

            <textarea
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                  handleRunQuery();
                }
              }}
              rows={5}
              style={{
                width: '100%',
                background: '#090d16',
                color: '#38bdf8',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                lineHeight: '1.5',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #1e293b',
                outline: 'none',
                resize: 'vertical',
                marginBottom: '1rem',
              }}
            />

            {/* Execution Meta Bar */}
            {queryResult && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-tertiary)',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontFamily: 'monospace',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <span style={{ color: '#10b981', fontWeight: 700 }}>
                  ✓ {queryResult.rowCount} rows returned in {queryResult.executionTimeMs}ms
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  Execution Engine: {queryResult.source}
                </span>
              </div>
            )}

            {/* Results Table */}
            {queryResult && queryResult.data && queryResult.data.length > 0 ? (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      {Object.keys(queryResult.data[0]).map((col) => (
                        <th key={col} style={{ textTransform: 'capitalize' }}>
                          {col.replace('_', ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.data.map((row, idx) => (
                      <tr key={idx}>
                        {Object.entries(row).map(([key, val], colIdx) => (
                          <td key={colIdx}>
                            {key === 'amount' || key === 'total_spent'
                              ? formatCurrency(val)
                              : typeof val === 'object'
                              ? JSON.stringify(val)
                              : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : queryResult && queryResult.data ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                Query executed successfully. 0 matching records found.
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SUBQUERY ANALYTICS (Topic 5.c) */}
      {/* ========================================================================= */}
      {activeViewTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {subqueryAnalytics && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="card" style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Total Expenses Tracked
                </span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--color-expense)' }}>
                  {subqueryAnalytics.datasetStats?.totalExpenses || 0} items
                </div>
              </div>
              <div className="card" style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Calculated Average Spending
                </span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--accent-primary)' }}>
                  {formatCurrency(subqueryAnalytics.datasetStats?.overallAverageExpense || 0)}
                </div>
              </div>
              <div className="card" style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Above-Average Outliers
                </span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.25rem', color: '#f59e0b' }}>
                  {subqueryAnalytics.queries?.scalar?.results?.length || 0} transactions
                </div>
              </div>
            </div>
          )}

          {/* 1. Scalar Subquery */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="flex-between mb-4">
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-income)', textTransform: 'uppercase' }}>
                  1. Scalar Subquery
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Above-Average Spending Transactions</h3>
              </div>
              <button
                onClick={() => handleSelectPreset(presetQueries[0])}
                className="btn btn-secondary btn-xs"
              >
                <Play size={12} />
                <span>Open in SQL Console</span>
              </button>
            </div>

            <div style={{ background: '#090d16', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #1e293b', marginBottom: '1rem' }}>
              <pre style={{ margin: 0, fontSize: '0.8rem', fontFamily: 'monospace', color: '#38bdf8', overflowX: 'auto' }}>
                {subqueryAnalytics?.queries?.scalar?.sql}
              </pre>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Deviation from Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {subqueryAnalytics?.queries?.scalar?.results?.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{row.title}</td>
                      <td><span className="badge badge-secondary">{row.category}</span></td>
                      <td>{row.date}</td>
                      <td style={{ fontWeight: 700, color: 'var(--color-expense)' }}>{formatCurrency(row.amount)}</td>
                      <td><span className="badge badge-success">+ {formatCurrency(row.deviation)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. Derived Table Subquery */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="flex-between mb-4">
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-income)', textTransform: 'uppercase' }}>
                  2. Derived Table Subquery (FROM Clause)
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>High Spending Categories (&gt; ₹1,000)</h3>
              </div>
              <button
                onClick={() => handleSelectPreset(presetQueries[1])}
                className="btn btn-secondary btn-xs"
              >
                <Play size={12} />
                <span>Open in SQL Console</span>
              </button>
            </div>

            <div style={{ background: '#090d16', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #1e293b', marginBottom: '1rem' }}>
              <pre style={{ margin: 0, fontSize: '0.8rem', fontFamily: 'monospace', color: '#38bdf8', overflowX: 'auto' }}>
                {subqueryAnalytics?.queries?.derived?.sql}
              </pre>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Total Spent (Subquery Aggregation)</th>
                    <th>Transaction Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {subqueryAnalytics?.queries?.derived?.results?.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{row.category}</td>
                      <td style={{ fontWeight: 700, color: 'var(--color-expense)' }}>{formatCurrency(row.total_spent)}</td>
                      <td>{row.tx_count} records</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DATABASE SCHEMA & DUMP (Topic 5.a) */}
      {/* ========================================================================= */}
      {activeViewTab === 'schema' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Schema Overview */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="flex-between mb-4">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>MySQL Database Schema ('expenseflow_db')</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Relational tables with Primary Keys, Foreign Keys, AUTO_INCREMENT, and Constraints.
                </p>
              </div>
              <a
                href={sqlApi.getExportDumpUrl()}
                download="expenseflow_dump.sql"
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
              >
                <Download size={13} />
                <span>Export Schema & Data (.sql)</span>
              </a>
            </div>

            {/* Table Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {schemaStats?.tables?.map((t) => (
                <div key={t.name} style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div className="flex-between">
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{t.name}</span>
                    <span className="badge badge-secondary">{t.engine}</span>
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.5rem' }}>
                    {t.rowCount} rows
                  </div>
                </div>
              ))}
            </div>

            {/* CLI Import Cheatsheet */}
            <div style={{ background: '#090d16', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b' }}>
              <div className="flex-between mb-4">
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8' }}>
                  CLI Import Instructions (MySQL Command Line Client)
                </span>
                <button
                  onClick={() => copyToClipboard(`mysql -u root -p < server/database/schema.sql`, 'CLI command')}
                  className="btn btn-secondary btn-xs"
                >
                  <Copy size={12} />
                  <span>Copy CLI Command</span>
                </button>
              </div>
              <pre style={{ margin: 0, fontSize: '0.82rem', fontFamily: 'monospace', color: '#38bdf8', overflowX: 'auto', lineHeight: '1.6' }}>
{`# 1. Login to MySQL Server
mysql -u root -p

# 2. Execute the entire schema & seed file
SOURCE server/database/schema.sql;

# 3. Verify the generated tables
USE expenseflow_db;
SHOW TABLES;
DESCRIBE expenses;`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SqlConsole;
