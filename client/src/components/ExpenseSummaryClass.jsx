import React, { Component } from 'react';
import { formatCurrency } from '../utils/formatters';
import { Award, Zap, Calculator, PieChart, Sparkles } from 'lucide-react';

/**
 * ==============================================================================
 * LAB SYLLABUS DEMONSTRATION COMPONENT: React Class Component
 * ==============================================================================
 * This component satisfies the following requirements from the syllabus:
 * 1. React Class Component with constructor(props) and this.state
 * 2. Component Lifecycle Methods: componentDidMount() & componentDidUpdate()
 * 3. Props Passing and De-structuring
 * 4. Event Handling (handleRefreshStats, toggleView)
 * 5. Conditional Rendering (isDetailedView, hasData checks)
 * 6. String & Template Literals (`...`)
 * 7. map() iterative rendering for category lists
 * ==============================================================================
 */
class ExpenseSummaryClass extends Component {
  constructor(props) {
    super(props);
    // 1. Initial State Definition
    this.state = {
      isDetailedView: false,
      lastCalculated: new Date().toLocaleTimeString(),
      stats: {
        averageExpense: 0,
        highestExpense: null,
        topCategory: 'N/A',
        totalTransactions: 0,
      },
    };

    // 2. Binding event handlers
    this.toggleDetailedView = this.toggleDetailedView.bind(this);
    this.recalculateMetrics = this.recalculateMetrics.bind(this);
  }

  // 3. Lifecycle method: componentDidMount
  componentDidMount() {
    this.recalculateMetrics();
  }

  // 4. Lifecycle method: componentDidUpdate (fires when expenses prop updates)
  componentDidUpdate(prevProps) {
    if (prevProps.expenses !== this.props.expenses) {
      this.recalculateMetrics();
    }
  }

  // 5. Custom calculation logic using ES6 reduce, sort, and template literals
  recalculateMetrics() {
    const { expenses = [] } = this.props;

    if (!expenses || expenses.length === 0) {
      this.setState({
        stats: {
          averageExpense: 0,
          highestExpense: null,
          topCategory: 'N/A',
          totalTransactions: 0,
        },
        lastCalculated: new Date().toLocaleTimeString(),
      });
      return;
    }

    // Calculate total & average
    const total = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const avg = total / expenses.length;

    // Find highest single expense
    const highest = [...expenses].sort((a, b) => (b.amount || 0) - (a.amount || 0))[0];

    // Find top spending category
    const catMap = {};
    expenses.forEach((item) => {
      catMap[item.category] = (catMap[item.category] || 0) + item.amount;
    });

    const topCategoryEntry = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];
    const topCategory = topCategoryEntry ? topCategoryEntry[0] : 'N/A';

    this.setState({
      stats: {
        averageExpense: avg,
        highestExpense: highest,
        topCategory,
        totalTransactions: expenses.length,
      },
      lastCalculated: new Date().toLocaleTimeString(),
    });
  }

  // 6. Event handler for toggling view
  toggleDetailedView() {
    this.setState((prevState) => ({
      isDetailedView: !prevState.isDetailedView,
    }));
  }

  render() {
    const { isDetailedView, stats, lastCalculated } = this.state;
    const { expenses = [] } = this.props;
    const hasData = expenses.length > 0;

    return (
      <div className="syllabus-card">
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div>
            <span className="syllabus-badge">
              <Zap size={13} />
              <span>Real-Time Executive Summary</span>
            </span>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {`Intelligent Quick Summary — Updated at ${lastCalculated}`}
            </h4>
          </div>

          <button
            type="button"
            onClick={this.toggleDetailedView}
            className="btn btn-secondary btn-sm"
          >
            {isDetailedView ? 'Show Compact View' : 'Show Detailed Analytics'}
          </button>
        </div>

        {/* Conditional Rendering based on hasData */}
        {!hasData ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            No expense records available to calculate analytics. Add expenses to observe class component state updates.
          </p>
        ) : (
          <div>
            {/* Grid of Key Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '0.75rem',
                marginTop: '0.75rem',
              }}
            >
              <div style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>AVG TICKET SIZE</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.2rem' }}>
                  {formatCurrency(stats.averageExpense)}
                </div>
              </div>

              <div style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOP SPENDING CATEGORY</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.2rem' }}>
                  {stats.topCategory}
                </div>
              </div>

              <div style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>HIGHEST SINGLE EXPENSE</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-expense)', marginTop: '0.2rem' }}>
                  {stats.highestExpense ? formatCurrency(stats.highestExpense.amount) : '₹0'}
                </div>
              </div>
            </div>

            {/* Conditional Rendering for Detailed View */}
            {isDetailedView && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <h5 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  {`Analysis of all ${stats.totalTransactions} recorded transactions:`}
                </h5>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
                  {expenses.slice(0, 4).map((item, idx) => (
                    <li key={item._id || idx} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>{`${idx + 1}. ${item.title} (${item.category})`}</span>
                      <strong style={{ color: 'var(--color-expense)' }}>-{formatCurrency(item.amount)}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default ExpenseSummaryClass;
