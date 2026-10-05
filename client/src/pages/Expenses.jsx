import React, { useState, useEffect, useCallback } from 'react';
import {
  PlusCircle,
  Download,
  Receipt,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { expenseApi } from '../services/api';
import TransactionFilter from '../components/TransactionFilter';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import EditExpenseModal from '../components/EditExpenseModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import toast from 'react-hot-toast';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalFilteredAmount, setTotalFilteredAmount] = useState(0);

  // Form toggle
  const [showAddForm, setShowAddForm] = useState(false);

  // Filters state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [paymentMethod, setPaymentMethod] = useState('All');
  const [datePreset, setDatePreset] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sort, setSort] = useState('newest');

  // Modals state
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Compute date ranges based on preset
  const getDateRangeForPreset = (preset) => {
    const now = new Date();
    if (preset === 'today') {
      const today = now.toISOString().split('T')[0];
      return { start: today, end: today };
    }
    if (preset === 'this_week') {
      const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
      return {
        start: firstDay.toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
      };
    }
    if (preset === 'this_month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split('T')[0];
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .split('T')[0];
      return { start, end };
    }
    return { start: '', end: '' };
  };

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        sort,
      };

      if (category !== 'All') params.category = category;
      if (paymentMethod !== 'All') params.paymentMethod = paymentMethod;
      if (search.trim()) params.search = search.trim();

      if (datePreset === 'custom') {
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
      } else if (datePreset !== 'all') {
        const { start, end } = getDateRangeForPreset(datePreset);
        if (start) params.startDate = start;
        if (end) params.endDate = end;
      }

      const res = await expenseApi.getAll(params);
      setExpenses(res.data || []);
      setTotalFilteredAmount(res.totalFilteredAmount || 0);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
      toast.error('Could not load expenses list');
    } finally {
      setLoading(false);
    }
  }, [category, paymentMethod, search, datePreset, startDate, endDate, sort]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setPaymentMethod('All');
    setDatePreset('all');
    setStartDate('');
    setEndDate('');
    setSort('newest');
  };

  const handleDeleteConfirm = async () => {
    if (!deletingExpense) return;
    try {
      setDeleteLoading(true);
      await expenseApi.delete(deletingExpense._id);
      toast.success('Expense removed successfully 🗑️');
      setDeletingExpense(null);
      fetchExpenses();
    } catch (err) {
      toast.error(err.message || 'Failed to delete expense');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Export filtered transactions to CSV
  const handleExportCSV = () => {
    if (expenses.length === 0) {
      toast.error('No expenses to export');
      return;
    }

    const headers = ['Title', 'Amount (INR)', 'Category', 'Date', 'Payment Method', 'Description'];
    const rows = expenses.map((exp) => [
      `"${exp.title.replace(/"/g, '""')}"`,
      exp.amount,
      `"${exp.category}"`,
      `"${new Date(exp.date).toLocaleDateString()}"`,
      `"${exp.paymentMethod}"`,
      `"${(exp.description || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ExpenseFlow_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported report as CSV! 📄');
  };

  return (
    <div className="page-wrapper">
      {/* Header Bar */}
      <div className="flex-between mb-4" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Manage Expenses</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Filter, search, organize, and export all recorded outgoing expenses
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleExportCSV} className="btn btn-secondary">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`btn ${showAddForm ? 'btn-secondary' : 'btn-primary'}`}
          >
            <PlusCircle size={18} />
            <span>{showAddForm ? 'Close Form' : 'Add Expense'}</span>
          </button>
        </div>
      </div>

      {/* Expandable Add Expense Form Card */}
      {showAddForm && (
        <div className="card mb-4" style={{ animation: 'slideUp 0.2s ease-out' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
            Record New Expense
          </h3>
          <ExpenseForm
            onSuccess={() => {
              fetchExpenses();
              setShowAddForm(false);
            }}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Search, Filter & Sort Controls */}
      <TransactionFilter
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        datePreset={datePreset}
        onDatePresetChange={setDatePreset}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        sort={sort}
        onSortChange={setSort}
        onResetFilters={handleResetFilters}
        totalResults={expenses.length}
      />

      {/* Expense List (Desktop Table / Mobile Cards) */}
      <ExpenseList
        expenses={expenses}
        loading={loading}
        onEdit={(item) => setEditingExpense(item)}
        onDelete={(item) => setDeletingExpense(item)}
        onAddNew={() => setShowAddForm(true)}
        totalFilteredAmount={totalFilteredAmount}
      />

      {/* Edit Modal Dialog */}
      <EditExpenseModal
        isOpen={Boolean(editingExpense)}
        expense={editingExpense}
        onClose={() => setEditingExpense(null)}
        onSuccess={fetchExpenses}
      />

      {/* Delete Confirmation Modal */}
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

export default Expenses;
