import React from 'react';
import {
  Edit3,
  Trash2,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  formatCurrency,
  formatDate,
  getCategoryIcon,
  getCategoryBadgeClass,
  getPaymentIcon,
} from '../utils/formatters';

const ExpenseItem = ({ expense, onEdit, onDelete, viewMode = 'table' }) => {
  const { _id, title, amount, category, date, paymentMethod, description } = expense;

  if (viewMode === 'card') {
    return (
      <div className="mobile-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className={getCategoryBadgeClass(category)}>
              {getCategoryIcon(category, 'w-3.5 h-3.5')}
              {category}
            </span>
            <span className="payment-tag">
              {getPaymentIcon(paymentMethod)}
              {paymentMethod}
            </span>
          </div>
          <span className="amount-expense" style={{ fontSize: '1.15rem' }}>
            -{formatCurrency(amount)}
          </span>
        </div>

        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
            {title}
          </div>
          {description && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {description}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.5rem',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={13} />
            <span>{formatDate(date)}</span>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={() => onEdit(expense)}
              className="btn-icon btn-sm"
              aria-label={`Edit ${title}`}
              title="Edit Expense"
            >
              <Edit3 size={15} />
            </button>
            <button
              onClick={() => onDelete(expense)}
              className="btn-icon btn-sm"
              style={{ color: 'var(--color-expense)' }}
              aria-label={`Delete ${title}`}
              title="Delete Expense"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Table Row
  return (
    <tr>
      <td>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{title}</span>
          {description && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {description}
            </span>
          )}
        </div>
      </td>
      <td>
        <span className={getCategoryBadgeClass(category)}>
          {getCategoryIcon(category, 'w-3.5 h-3.5')}
          {category}
        </span>
      </td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
          <span>{formatDate(date)}</span>
        </div>
      </td>
      <td>
        <span className="payment-tag">
          {getPaymentIcon(paymentMethod)}
          {paymentMethod}
        </span>
      </td>
      <td>
        <span className="amount-expense">
          -{formatCurrency(amount)}
        </span>
      </td>
      <td style={{ textAlign: 'right' }}>
        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
          <button
            onClick={() => onEdit(expense)}
            className="btn-icon btn-sm"
            aria-label={`Edit ${title}`}
            title="Edit Expense"
          >
            <Edit3 size={15} />
          </button>
          <button
            onClick={() => onDelete(expense)}
            className="btn-icon btn-sm"
            style={{ color: 'var(--color-expense)' }}
            aria-label={`Delete ${title}`}
            title="Delete Expense"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ExpenseItem;
