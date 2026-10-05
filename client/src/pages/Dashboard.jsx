import React, { useState, useEffect } from 'react';
import {
  Wallet,
  TrendingUp,
  CreditCard,
  Calendar,
  PlusCircle,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { dashboardApi, expenseApi } from '../services/api';
import DashboardCard from '../components/DashboardCard';
import { CategoryPieChart, MonthlyBarChart } from '../components/Charts';
import RecentTransactions from '../components/RecentTransactions';
import ExpenseSummaryClass from '../components/ExpenseSummaryClass';
import ExpenseForm from '../components/ExpenseForm';
import EditExpenseModal from '../components/EditExpenseModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import toast from 'react-hot-toast';

const Dashboard = () => {
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
    monthlyTrends: [],
    recentExpenses: [],
  });

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Edit / Delete modal states
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryRes, expenseRes] = await Promise.all([
        dashboardApi.getSummary(),
        expenseApi.getAll({ limit: 20 }),
      ]);

      setData(summaryRes.data);
      setExpenses(expenseRes.data || []);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleExpenseCreated = () => {
    fetchDashboardData();
    setShowAddForm(false);
  };

  const handleExpenseUpdated = () => {
    fetchDashboardData();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingExpense) return;
    try {
      setDeleteLoading(true);
      await expenseApi.delete(deletingExpense._id);
      toast.success('Expense deleted successfully');
      setDeletingExpense(null);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete expense');
    } finally {
      setDeleteLoading(false);
    }
  };

  const { summary, categoryTotals, monthlyTrends, recentExpenses } = data;

  return (
    <div className="page-wrapper">
      {/* 4 Summary Cards */}
      <section className="stats-grid">
        <DashboardCard
          title="Total Balance"
          amount={summary.totalBalance}
          icon={Wallet}
          type="balance"
          subtitle={summary.totalBalance >= 0 ? 'Positive Cash Flow' : 'Negative Balance'}
          trend={`${summary.savingsRate}% Saved`}
          isPositive={summary.totalBalance >= 0}
        />

        <DashboardCard
          title="Total Income"
          amount={summary.totalIncome}
          icon={TrendingUp}
          type="income"
          subtitle="All recorded earnings"
          trend="+ Inflow"
          isPositive={true}
        />

        <DashboardCard
          title="Total Expenses"
          amount={summary.totalExpenses}
          icon={CreditCard}
          type="expense"
          subtitle={`${summary.expenseCount} total transactions`}
          trend="- Outflow"
          isPositive={false}
        />

        <DashboardCard
          title="This Month"
          amount={summary.currentMonthExpenses}
          icon={Calendar}
          type="month"
          subtitle="Current calendar month"
          trend="Monthly"
          isPositive={true}
        />
      </section>

      {/* Quick Add Expense Action Bar */}
      <div className="card mb-4" style={{ padding: '1.25rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Quick Expense Entry</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Quickly record a new transaction with category and payment method
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`btn ${showAddForm ? 'btn-secondary' : 'btn-primary'}`}
          >
            <PlusCircle size={18} />
            <span>{showAddForm ? 'Hide Form' : 'Add New Expense'}</span>
          </button>
        </div>

        {showAddForm && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <ExpenseForm onSuccess={handleExpenseCreated} onCancel={() => setShowAddForm(false)} />
          </div>
        )}
      </div>

      {/* Lab Syllabus Class Component Demonstration */}
      <ExpenseSummaryClass expenses={expenses} />

      {/* Charts Grid */}
      <div className="dashboard-grid-2">
        {/* Category Donut Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieIcon size={18} style={{ color: 'var(--accent-primary)' }} />
              <h3 className="chart-title">Spending by Category</h3>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Real-time breakdown</span>
          </div>
          <CategoryPieChart data={categoryTotals} />
        </div>

        {/* Monthly Comparison Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} style={{ color: '#10b981' }} />
              <h3 className="chart-title">Income vs Expenses (6 Months)</h3>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Monthly comparison</span>
          </div>
          <MonthlyBarChart data={monthlyTrends} />
        </div>
      </div>

      {/* Recent Transactions List */}
      <div style={{ marginTop: '1.5rem' }}>
        <RecentTransactions transactions={recentExpenses} loading={loading} />
      </div>

      {/* Edit Modal */}
      <EditExpenseModal
        isOpen={Boolean(editingExpense)}
        expense={editingExpense}
        onClose={() => setEditingExpense(null)}
        onSuccess={handleExpenseUpdated}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingExpense)}
        title="Delete Expense Record"
        itemTitle={deletingExpense?.title}
        amount={deletingExpense?.amount}
        loading={deleteLoading}
        onClose={() => setDeletingExpense(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Dashboard;
