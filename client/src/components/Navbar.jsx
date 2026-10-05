import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  Sparkles,
  PlusCircle,
  Wallet,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { seedApi } from '../services/api';
import toast from 'react-hot-toast';

const pageTitles = {
  '/': {
    title: 'Dashboard Overview',
    subtitle: 'Real-time financial summary & activity',
  },
  '/expenses': {
    title: 'Expenses Manager',
    subtitle: 'Track, filter, and organize all your outgoing expenses',
  },
  '/income': {
    title: 'Income Streams',
    subtitle: 'Manage salary, freelance, gifts, and all cash inflow',
  },
  '/analytics': {
    title: 'Analytics & Insights',
    subtitle: 'Visual cash flow, category breakdowns & spending trends',
  },
  '/sql-console': {
    title: 'SQL Query Engine & DB Manager',
    subtitle: 'Execute analytical subqueries, inspect schemas, and export MySQL dumps',
  },
  '/services': {
    title: 'Financial Services & Tools',
    subtitle: 'Suite of personal budgeting and SQL data management features',
  },
  '/about': {
    title: 'About ExpenseFlow',
    subtitle: 'Architecture, dual-database engine, and project technology stack',
  },
  '/contact': {
    title: 'Contact & Support',
    subtitle: 'Developer inquiries and customer assistance portal',
  },
};

const Navbar = ({ onOpenSidebar, onOpenQuickAdd, onDataRefresh }) => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [seeding, setSeeding] = useState(false);

  const currentPage = pageTitles[location.pathname] || {
    title: 'ExpenseFlow',
    subtitle: 'Smart Financial Management',
  };

  const handleSeedData = async () => {
    try {
      setSeeding(true);
      const res = await seedApi.seed();
      toast.success(res.message || 'Demo data loaded successfully!', {
        icon: '🌱',
        duration: 4000,
      });
      if (onDataRefresh) {
        onDataRefresh();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to seed demo data');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="btn-icon mobile-menu-btn"
          onClick={onOpenSidebar}
          aria-label="Toggle navigation menu"
          style={{ display: 'none' }}
          id="sidebar-toggle-btn"
        >
          <Menu size={20} />
        </button>

        <div className="navbar-brand-mobile">
          <div className="brand-icon-wrapper" style={{ width: '32px', height: '32px' }}>
            <Wallet size={18} />
          </div>
          <span style={{ fontWeight: 800 }}>ExpenseFlow</span>
        </div>

        <div className="navbar-title-container">
          <h1 className="navbar-page-title">{currentPage.title}</h1>
          <span className="navbar-page-subtitle">{currentPage.subtitle}</span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Seed Demo Data Button */}
        <button
          onClick={handleSeedData}
          disabled={seeding}
          className="btn btn-secondary btn-sm"
          title="Reset and load rich demo data"
        >
          <Sparkles size={16} className={seeding ? 'animate-spin' : ''} style={{ color: '#f59e0b' }} />
          <span className="hide-on-mobile">{seeding ? 'Loading...' : 'Load Demo Data'}</span>
        </button>

        {/* Quick Add Expense Modal Trigger */}
        {onOpenQuickAdd && (
          <button onClick={onOpenQuickAdd} className="btn btn-primary btn-sm">
            <PlusCircle size={16} />
            <span className="hide-on-mobile">Add Expense</span>
          </button>
        )}

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="btn-icon"
          aria-label="Toggle theme"
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        >
          {isDark ? <Sun size={18} style={{ color: '#fbbf24' }} /> : <Moon size={18} style={{ color: '#6366f1' }} />}
        </button>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          #sidebar-toggle-btn {
            display: inline-flex !important;
          }
        }
        @media (max-width: 640px) {
          .hide-on-mobile {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
