import React, { useEffect, useState } from 'react';
import {
  Receipt,
  Database,
  TrendingUp,
  Download,
  ShieldCheck,
  Zap,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { websiteApi } from '../services/api';

const iconMap = {
  Receipt: Receipt,
  Database: Database,
  TrendingUp: TrendingUp,
  Download: Download,
};

const Services = () => {
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    websiteApi.getServices().then((res) => setServicesData(res.services || [])).catch(console.error);
  }, []);

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="mb-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <span className="syllabus-badge">
            <Sparkles size={14} />
            <span>Financial Services Suite</span>
          </span>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>ExpenseFlow Core Financial Services</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Enterprise-ready personal budgeting, real-time analytics, and SQL data reporting tools.
        </p>
      </div>

      {/* Services Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {(servicesData.length > 0
          ? servicesData
          : [
              {
                id: 'budget-tracking',
                title: 'Smart Budget & Expense Tracking',
                description: 'Categorize expenditures across Food, Travel, Bills, Shopping, and Education with automated budget limits.',
                icon: 'Receipt',
              },
              {
                id: 'sql-analytics',
                title: 'Advanced SQL Query Engine',
                description: 'Execute analytical subqueries, derived tables, and aggregates directly against your transaction ledger.',
                icon: 'Database',
              },
              {
                id: 'cash-flow',
                title: 'Income vs Expense Analytics',
                description: 'Visual cash flow graphs and monthly savings rate calculators with Recharts.',
                icon: 'TrendingUp',
              },
              {
                id: 'data-portability',
                title: 'Enterprise Data Portability',
                description: 'One-click export to CSV spreadsheets and full MySQL .sql schema dumps.',
                icon: 'Download',
              },
            ]
        ).map((srv) => {
          const Icon = iconMap[srv.icon] || Zap;
          return (
            <div key={srv.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <Icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{srv.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                  {srv.description}
                </p>
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>Active Service</span>
                <Link
                  to={srv.id === 'sql-analytics' ? '/sql-console' : srv.id === 'cash-flow' ? '/analytics' : '/expenses'}
                  style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}
                >
                  <span>Launch Tool</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Services;
