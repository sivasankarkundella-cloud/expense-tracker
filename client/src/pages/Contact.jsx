import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare, MapPin, Phone, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { websiteApi } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    loadContactData();
  }, []);

  const loadContactData = async () => {
    try {
      const res = await websiteApi.getContact();
      setSubmissions(res.recentSubmissions || []);
    } catch (err) {
      console.warn(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await websiteApi.submitContact(formData);
      toast.success(res.message || 'Inquiry submitted successfully to Express backend!');
      setFormData({ name: '', email: '', subject: '', message: '' });
      loadContactData();
    } catch (err) {
      toast.error('Failed to submit message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="mb-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <span className="syllabus-badge">
            <Mail size={14} />
            <span>Support &amp; Contact Portal</span>
          </span>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Customer &amp; Developer Support Hub</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Submit inquiries or product feedback directly through our Express.js REST API.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Contact Form */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Send a Message</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Siva Sankar"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                placeholder="siva@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">Subject</label>
              <input
                type="text"
                placeholder="Lab Evaluation / Project Query"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Message *</label>
              <textarea
                rows={4}
                placeholder="Write your feedback or questions here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
            >
              <Send size={15} />
              <span>{loading ? 'Submitting to Express...' : 'Submit Inquiry (POST)'}</span>
            </button>
          </form>
        </div>

        {/* Project Contact Info & Recent Submissions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Lab Support Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                <Mail size={18} color="var(--accent-primary)" />
                <span>support@expenseflow.dev</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                <MapPin size={18} color="#10b981" />
                <span>Academic Web Development Lab, Computer Science Dept</span>
              </div>
            </div>
          </div>

          {/* Live Recent Messages */}
          <div className="card" style={{ padding: '1.5rem', flex: 1 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Live Express Inquiries Log
            </h3>
            {submissions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {submissions.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: 'var(--bg-tertiary)',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.82rem',
                    }}
                  >
                    <div className="flex-between mb-4">
                      <strong>{item.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {new Date(item.receivedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{item.subject}</div>
                    <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>{item.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                No inquiries logged yet. Submit the form above to trigger a live Express POST request!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
