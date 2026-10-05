import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import {
  formatCurrency,
  formatDate,
  getCategoryIcon,
  getCategoryBadgeClass,
} from '../utils/formatters';
import EmptyState from './EmptyState';

const RecentTransactions = ({ transactions = [], loading = false }) => {
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton" style={{ height: '52px', width: '100%' }} />
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="No recent transactions"
        description="Your newest recorded expenses will automatically show up here."
      />
    );
  }

  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div className="flex-between mb-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={18} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recent Transactions</h3>
        </div>
        <Link
          to="/expenses"
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem' }}
        >
          <span>View All</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {transactions.map((item) => (
          <div
            key={item._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              transition: 'transform var(--transition-fast)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                className={getCategoryBadgeClass(item.category)}
                style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', padding: 0, justifyContent: 'center' }}
              >
                {getCategoryIcon(item.category, 'w-4 h-4')}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {item.title}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {formatDate(item.date)} • {item.paymentMethod || 'UPI'}
                </span>
              </div>
            </div>

            <span className="amount-expense" style={{ fontSize: '0.95rem' }}>
              -{formatCurrency(item.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
