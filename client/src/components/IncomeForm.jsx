import React, { useState } from 'react';
import { PlusCircle, TrendingUp } from 'lucide-react';
import { incomeApi } from '../services/api';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const incomeSources = [
  'Salary',
  'Freelance',
  'Scholarship',
  'Gift',
  'Investment',
  'Business',
  'Other',
];

const IncomeForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    source: 'Salary',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.amount) {
      errs.amount = 'Please enter an income amount';
    } else {
      const amt = parseFloat(formData.amount);
      if (isNaN(amt) || amt <= 0) {
        errs.amount = 'Amount must be greater than ₹0';
      }
    }
    if (!formData.source) {
      errs.source = 'Please select an income source';
    }
    if (!formData.date) {
      errs.date = 'Please pick a date';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        title: formData.title.trim() || formData.source,
        source: formData.source,
        amount: parseFloat(formData.amount),
        date: formData.date,
        description: formData.description.trim(),
      };

      const res = await incomeApi.create(payload);
      toast.success('Income stream added successfully! 💰', { duration: 3000 });

      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
      });

      setFormData({
        title: '',
        source: 'Salary',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });

      if (onSuccess) {
        onSuccess(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add income record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="income-form">
      {/* Title / Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="income-title">
          <span>Income Label / Client</span>
        </label>
        <input
          id="income-title"
          type="text"
          name="title"
          placeholder="e.g. October Monthly Pay, UI Design Milestone, Merit Scholarship"
          value={formData.title}
          onChange={handleChange}
          className="form-control"
          maxLength={100}
        />
      </div>

      {/* Amount & Date */}
      <div className="form-grid-2">
        <div className="form-group">
          <label className="form-label" htmlFor="income-amount">
            <span>Amount (₹) <span className="required-star">*</span></span>
          </label>
          <input
            id="income-amount"
            type="number"
            step="0.01"
            name="amount"
            placeholder="0.00"
            value={formData.amount}
            onChange={handleChange}
            className={`form-control ${errors.amount ? 'error' : ''}`}
          />
          {errors.amount && <span className="form-error-msg">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="income-date">
            <span>Date Received <span className="required-star">*</span></span>
          </label>
          <input
            id="income-date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`form-control ${errors.date ? 'error' : ''}`}
          />
          {errors.date && <span className="form-error-msg">{errors.date}</span>}
        </div>
      </div>

      {/* Source Pills */}
      <div className="form-group">
        <label className="form-label">
          <span>Income Stream Source <span className="required-star">*</span></span>
        </label>
        <div className="pill-selector">
          {incomeSources.map((src) => {
            const isSelected = formData.source === src;
            return (
              <button
                key={src}
                type="button"
                onClick={() => setFormData((p) => ({ ...p, source: src }))}
                className={`pill-option ${isSelected ? 'active' : ''}`}
              >
                <span>{src}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div className="form-group">
        <label className="form-label" htmlFor="income-desc">
          <span>Additional Details (Optional)</span>
        </label>
        <textarea
          id="income-desc"
          name="description"
          rows={2}
          placeholder="e.g. Credited via direct bank transfer"
          value={formData.description}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" disabled={loading} className="btn btn-success" style={{ minWidth: '140px' }}>
          {loading ? (
            'Saving...'
          ) : (
            <>
              <TrendingUp size={18} />
              <span>Add Income</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default IncomeForm;
