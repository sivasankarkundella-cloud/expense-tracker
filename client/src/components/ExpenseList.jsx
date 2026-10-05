import React from 'react';
import ExpenseItem from './ExpenseItem';
import EmptyState from './EmptyState';
import { formatCurrency } from '../utils/formatters';
import { Plus, Receipt, Sparkles } from 'lucide-react';

const ExpenseList = ({
  expenses = [],
  loading = false,
  onEdit,
  onDelete,
  onAddNew,
  totalFilteredAmount,
}) => {
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[1, 2, 3, 4, 5].map((idx) => (
          <div
            key={idx}
            className="skeleton"
            style={{ height: '64px', width: '100%', borderRadius: 'var(--radius-md)' }}
          />
        ))}
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No expenses found"
        description="Try adjusting your filters or search keywords, or record a new expense."
        actionText="Add New Expense"
        onAction={onAddNew}
      />
    );
  }

  return (
    <div>
      {/* Header with filtered total */}
      {totalFilteredAmount !== undefined && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
          }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Filtered Total ({expenses.length} items)
          </span>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-expense)' }}>
            -{formatCurrency(totalFilteredAmount)}
          </span>
        </div>
      )}

      {/* Desktop Table */}
      <div className="desktop-table-container">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Title / Notes</th>
                <th>Category</th>
                <th>Date</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <ExpenseItem
                  key={expense._id}
                  expense={expense}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  viewMode="table"
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-transaction-list">
        {expenses.map((expense) => (
          <ExpenseItem
            key={expense._id}
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
            viewMode="card"
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
