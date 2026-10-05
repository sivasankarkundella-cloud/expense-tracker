import React from 'react';
import { Trash2, Calendar, TrendingUp, Layers } from 'lucide-react';
import { formatCurrency, formatDate, getCategoryBadgeClass } from '../utils/formatters';
import EmptyState from './EmptyState';

const IncomeList = ({ incomes = [], loading = false, onDelete, onAddNew }) => {
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: '60px', width: '100%' }} />
        ))}
      </div>
    );
  }

  if (!incomes || incomes.length === 0) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No income records yet"
        description="Add your monthly salary, freelance earnings, or gifts to calculate your total balance."
        actionText="Add Income"
        onAction={onAddNew}
      />
    );
  }

  return (
    <div className="table-responsive">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Source / Label</th>
            <th>Type</th>
            <th>Date Received</th>
            <th>Amount</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((item) => (
            <tr key={item._id}>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</span>
                  {item.description && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {item.description}
                    </span>
                  )}
                </div>
              </td>
              <td>
                <span className={getCategoryBadgeClass(item.source)}>
                  <TrendingUp size={12} />
                  {item.source}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                  <span>{formatDate(item.date)}</span>
                </div>
              </td>
              <td>
                <span className="amount-income">
                  +{formatCurrency(item.amount)}
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <button
                  onClick={() => onDelete(item)}
                  className="btn-icon btn-sm"
                  style={{ color: 'var(--color-expense)' }}
                  aria-label={`Delete ${item.title}`}
                  title="Delete Income Record"
                >
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncomeList;
