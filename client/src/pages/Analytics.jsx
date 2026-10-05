import React, { useState, useEffect } from 'react';
import {
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
  CreditCard,
  Percent,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { dashboardApi } from '../services/api';
import {
  CategoryPieChart,
  MonthlyBarChart,
  TrendAreaChart,
} from '../components/Charts';
import {
  formatCurrency,
  getCategoryBadgeClass,
  getCategoryIcon,
  getPaymentIcon,
} from '../utils/formatters';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [data, setData] = useState({
    summary: {
      totalBalance: 0,
      totalIncome: 0,
      totalExpenses: 0,
      currentMonthExpenses: 0,
      savingsRate: 0,
      expenseCount: 0,
    },
    categoryTotals: [],
    paymentMethodTotals: [],
    monthlyTrends: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await dashboardApi.getSummary();
        setData(res.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const { summary, categoryTotals, paymentMethodTotals, monthlyTrends } = data;

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="mb-4">
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Financial Intelligence & Analytics</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Detailed visual insights into spending habits, savings rate, and cash flow trends
        </p>
      </div>

      {/* Financial Health Summary Cards */}
      <div className="stats-grid">
        <div className="card">
          <div className="flex-between mb-4">
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Savings Rate
            </span>
            <Percent size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>
            {summary.savingsRate}%
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '999px', marginTop: '0.75rem', overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.min(100, Math.max(0, summary.savingsRate))}%`,
                height: '100%',
                background: 'var(--accent-gradient-emerald)',
                borderRadius: '999px',
                transition: 'width 0.5s ease-out',
              }}
            />
          </div>
        </div>

        <div className="card">
          <div className="flex-between mb-4">
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Net Balance
            </span>
            <ShieldCheck size={18} style={{ color: summary.totalBalance >= 0 ? 'var(--accent-primary)' : 'var(--color-expense)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: summary.totalBalance >= 0 ? 'var(--text-primary)' : 'var(--color-expense)' }}>
            {formatCurrency(summary.totalBalance)}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {summary.totalBalance >= 0 ? 'Surplus across accounts' : 'Deficit across accounts'}
          </span>
        </div>

        <div className="card">
          <div className="flex-between mb-4">
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Avg Category Cost
            </span>
            <Zap size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {formatCurrency(
              categoryTotals.length > 0
                ? Math.round(summary.totalExpenses / categoryTotals.length)
                : 0
            )}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Distributed over {categoryTotals.length} categories
          </span>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="dashboard-grid-2">
        {/* Category Breakdown Donut */}
        <div className="chart-card">
          <div className="chart-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieIcon size={18} style={{ color: 'var(--accent-primary)' }} />
              <h3 className="chart-title">Category Distribution</h3>
            </div>
          </div>
          <CategoryPieChart data={categoryTotals} />
        </div>

        {/* Category Breakdown Ranked Table */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
            Category Spending Table
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {categoryTotals.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No categorized expenses available</p>
            ) : (
              categoryTotals.map((item) => (
                <div
                  key={item.category}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span className={getCategoryBadgeClass(item.category)}>
                      {getCategoryIcon(item.category, 'w-3.5 h-3.5')}
                      {item.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ({item.count} items)
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {formatCurrency(item.amount)}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.45rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--border-color)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Cash Flow and Monthly Trend Grid */}
      <div className="dashboard-grid-2">
        {/* Income vs Expenses Bar */}
        <div className="chart-card">
          <div className="chart-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} style={{ color: '#10b981' }} />
              <h3 className="chart-title">Income vs Expenses</h3>
            </div>
          </div>
          <MonthlyBarChart data={monthlyTrends} />
        </div>

        {/* Trend Area Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} style={{ color: 'var(--accent-primary)' }} />
              <h3 className="chart-title">Cash Flow & Savings Trajectory</h3>
            </div>
          </div>
          <TrendAreaChart data={monthlyTrends} />
        </div>
      </div>

      {/* Payment Method Distribution */}
      <div className="card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
          Payment Method Breakdown
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          {paymentMethodTotals.map((pm) => (
            <div
              key={pm.paymentMethod}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="payment-tag">
                  {getPaymentIcon(pm.paymentMethod)}
                  {pm.paymentMethod}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {pm.count} txns
                </span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {formatCurrency(pm.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
