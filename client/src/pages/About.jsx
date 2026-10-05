import React, { useEffect, useState } from 'react';
import { Layers, Server, Database, Code2, ShieldCheck, Zap, BookOpen, CheckCircle } from 'lucide-react';
import { websiteApi } from '../services/api';

const About = () => {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    websiteApi.getAbout().then(setAboutData).catch(console.error);
  }, []);

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="mb-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <span className="syllabus-badge">
            <BookOpen size={14} />
            <span>Platform Overview</span>
          </span>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>About ExpenseFlow</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {aboutData?.description ||
            'A modern full-stack web application designed for personal wealth management, smart budgeting, and real-time SQL financial reporting.'}
        </p>
      </div>

      {/* Tech Stack Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
              <Code2 size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Frontend Architecture</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Built with <strong>React.js 18 (Vite)</strong> utilizing declarative client-side routing, React Context for themes, Recharts for financial visualization, and custom modern CSS variables.
          </p>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <Server size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Express.js REST Engine</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Powered by <strong>Node.js & Express 4</strong> with modular routes, full RESTful CRUD handlers (200/201/404), Morgan request logging, CORS, and an in-memory audit logger.
          </p>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <Database size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Dual Database Hybrid</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Supports <strong>MongoDB (Mongoose ODM)</strong> for agile document storage alongside <strong>MySQL 8.0 (mysql2 driver)</strong> with relational schemas, constraints, and subquery analytics.
          </p>
        </div>
      </div>

      {/* Real-World Features Showcase */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Key Project Capabilities</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {[
            'Live Dynamic Dashboard with 4 real-time metric cards',
            'Analytical SQL Subquery Engine with above-average outlier detection',
            'Full-fledged CRUD management with instant status code badges',
            'One-click MySQL .sql database dump generator with complete schema',
            'Live Server Activity & API Performance Terminal',
            'Instant CSV and data spreadsheet export capabilities',
          ].map((feat, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              <CheckCircle size={16} color="#10b981" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
