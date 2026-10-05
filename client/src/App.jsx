import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import Analytics from './pages/Analytics';
import SqlConsole from './pages/SqlConsole';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import LiveConsoleDrawer from './components/LiveConsoleDrawer';
import ExpenseForm from './components/ExpenseForm';
import { X, PlusCircle } from 'lucide-react';

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [dataRefreshKey, setDataRefreshKey] = useState(0);
  const { isDark } = useTheme();

  const handleDataRefresh = () => {
    setDataRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="app-container">
      {/* Toast Notifications Provider */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDark ? '#1f2937' : '#ffffff',
            color: isDark ? '#f9fafb' : '#111827',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '0.875rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#ffffff',
            },
          },
        }}
      />

      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenQuickAdd={() => setQuickAddOpen(true)}
          onDataRefresh={handleDataRefresh}
        />

        <main>
          <Routes key={dataRefreshKey}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/income" element={<Income />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/sql-console" element={<SqlConsole />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/lab-concepts" element={<Navigate to="/sql-console" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Live Floating Express Activity Console */}
        <LiveConsoleDrawer />
      </div>

      {/* Quick Add Expense Global Modal */}
      {quickAddOpen && (
        <div className="modal-overlay" onClick={() => setQuickAddOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-balance-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-balance)',
                  }}
                >
                  <PlusCircle size={18} />
                </div>
                <h3 className="modal-title">Quick Add Expense</h3>
              </div>
              <button
                onClick={() => setQuickAddOpen(false)}
                className="btn-icon btn-sm"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <ExpenseForm
                isModal={true}
                onSuccess={() => {
                  setQuickAddOpen(false);
                  handleDataRefresh();
                }}
                onCancel={() => setQuickAddOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;
