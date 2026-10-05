import React from 'react';
import { Filter, RotateCcw, ArrowUpDown, Calendar, CreditCard } from 'lucide-react';
import { categories, paymentMethods } from './ExpenseForm';
import SearchBar from './SearchBar';

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'amount_desc', label: 'Amount: High to Low' },
  { value: 'amount_asc', label: 'Amount: Low to High' },
];

const datePresets = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
];

const TransactionFilter = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  paymentMethod,
  onPaymentMethodChange,
  datePreset,
  onDatePresetChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  sort,
  onSortChange,
  onResetFilters,
  totalResults,
}) => {
  const isFiltered =
    search ||
    category !== 'All' ||
    paymentMethod !== 'All' ||
    datePreset !== 'all' ||
    startDate ||
    endDate ||
    sort !== 'newest';

  return (
    <div className="filter-bar">
      {/* Search and Sort row */}
      <div className="filter-row">
        <SearchBar
          value={search}
          onChange={onSearchChange}
          placeholder="Search by expense title, category, or note..."
        />

        {/* Sort dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '180px' }}>
          <ArrowUpDown size={16} style={{ color: 'var(--text-muted)' }} />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="form-control"
            style={{ padding: '0.65rem 0.85rem' }}
            aria-label="Sort transactions"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset button */}
        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="btn btn-secondary btn-sm"
            title="Reset all filters to default"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Filter Row: Category, Payment, Date */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '0.5rem',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        {/* Category Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Category:
          </span>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="form-control"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Payment:
          </span>
          <select
            value={paymentMethod}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            className="form-control"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
          >
            <option value="All">All Methods</option>
            {paymentMethods.map((pm) => (
              <option key={pm} value={pm}>
                {pm}
              </option>
            ))}
          </select>
        </div>

        {/* Date Preset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Period:
          </span>
          <select
            value={datePreset}
            onChange={(e) => onDatePresetChange(e.target.value)}
            className="form-control"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
          >
            {datePresets.map((dp) => (
              <option key={dp.value} value={dp.value}>
                {dp.label}
              </option>
            ))}
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {/* Custom Date Pickers when 'custom' selected */}
        {datePreset === 'custom' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              type="date"
              value={startDate || ''}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="form-control"
              style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem', width: 'auto' }}
              aria-label="Start date"
            />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>to</span>
            <input
              type="date"
              value={endDate || ''}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="form-control"
              style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem', width: 'auto' }}
              aria-label="End date"
            />
          </div>
        )}

        {totalResults !== undefined && (
          <div style={{ marginLeft: 'auto', fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Showing {totalResults} {totalResults === 1 ? 'expense' : 'expenses'}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionFilter;
