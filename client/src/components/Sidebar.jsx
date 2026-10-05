import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  PieChart,
  Code2,
  Wallet,
  X,
  ShieldCheck,
  Database,
  Info,
  Sparkles,
  Mail,
} from 'lucide-react';

const mainNavItems = [
  { path: '/', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/expenses', name: 'Expenses', icon: Receipt },
  { path: '/income', name: 'Income', icon: TrendingUp },
  { path: '/analytics', name: 'Analytics', icon: PieChart },
  { path: '/sql-console', name: 'SQL Console & DB', icon: Database, badge: 'MySQL' },
];

const secondaryNavItems = [
  { path: '/services', name: 'Services', icon: Sparkles },
  { path: '/about', name: 'About', icon: Info },
  { path: '/contact', name: 'Contact', icon: Mail },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/" className="sidebar-brand" onClick={onClose}>
            <div className="brand-icon-wrapper">
              <Wallet size={22} />
            </div>
            <div className="brand-text">
              <span className="brand-name">ExpenseFlow</span>
              <span className="brand-tagline">Smart Tracker</span>
            </div>
          </NavLink>

          <button
            className="btn-icon mobile-close-btn"
            onClick={onClose}
            aria-label="Close menu"
            style={{ display: 'none' }}
            id="sidebar-close-btn"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-title">Finance & Data</span>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
                end={item.path === '/'}
              >
                <Icon className="nav-link-icon" />
                <span>{item.name}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </NavLink>
            );
          })}

          <span className="nav-section-title" style={{ marginTop: '1rem' }}>
            Company & Tools
          </span>
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon className="nav-link-icon" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 8px #10b981',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>MongoDB &amp; MySQL</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Express REST Active</span>
            </div>
          </div>
        </div>
      </aside>

      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <style>{`
        @media (max-width: 1024px) {
          #sidebar-close-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
