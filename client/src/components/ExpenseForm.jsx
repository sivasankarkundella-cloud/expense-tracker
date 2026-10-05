import React, { useState } from 'react';
import {
  PlusCircle,
  IndianRupee,
  Calendar,
  CreditCard,
  FileText,
  Tag,
  Sparkles,
} from 'lucide-react';
import { expenseApi } from '../services/api';
import { getCategoryIcon } from '../utils/formatters';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

export const categories = [
  'Food',
  'Shopping',
  'Transport',
  'Bills',
  'Entertainment',
  'Education',
  'Health',
  'Travel',
  'Other',
];

export const paymentMethods = [
  'UPI',
  'Credit Card',
  'Debit Card',
  'Cash',
  'Bank Transfer',
];

const ExpenseForm = ({ onSuccess, onCancel, isModal = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Please enter an expense title';
    } else if (formData.title.length > 100) {
      errs.title = 'Title must be 100 characters or less';
    }

    if (!formData.amount) {
      errs.amount = 'Please enter an amount';
    } else {
      const amt = parseFloat(formData.amount);
      if (isNaN(amt) || amt <= 0) {
        errs.amount = 'Amount must be greater than ₹0';
      }
    }

    if (!formData.category) {
      errs.category = 'Please select a category';
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
      toast.error('Please fix the validation errors in the form');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        paymentMethod: formData.paymentMethod,
        description: formData.description.trim(),
      };

      const res = await expenseApi.create(payload);
      toast.success('Expense recorded successfully! 💸', { duration: 3000 });

      // Trigger light confetti
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
      });

      // Reset form
      setFormData({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'UPI',
        description: '',
      });

      if (onSuccess) {
        onSuccess(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      {/* Title */}
      <div className="form-group">
        <label className="form-label" htmlFor="expense-title">
          <span>Expense Title <span className="required-star">*</span></span>
        </label>
        <div style={{ position: 'relative' }}>
          <input
            id="expense-title"
            type="text"
            name="title"
            placeholder="e.g. Starbucks Coffee, Grocery Run, Electricity Bill"
            value={formData.title}
            onChange={handleChange}
            className={`form-control ${errors.title ? 'error' : ''}`}
            maxLength={100}
          />
        </div>
        {errors.title && <span className="form-error-msg">{errors.title}</span>}
      </div>

      {/* Amount & Date Grid */}
      <div className="form-grid-2">
        <div className="form-group">
          <label className="form-label" htmlFor="expense-amount">
            <span>Amount (₹) <span className="required-star">*</span></span>
          </label>
          <input
            id="expense-amount"
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
          <label className="form-label" htmlFor="expense-date">
            <span>Date <span className="required-star">*</span></span>
          </label>
          <input
            id="expense-date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`form-control ${errors.date ? 'error' : ''}`}
          />
          {errors.date && <span className="form-error-msg">{errors.date}</span>}
        </div>
      </div>

      {/* Category Pills */}
      <div className="form-group">
        <label className="form-label">
          <span>Category <span className="required-star">*</span></span>
        </label>
        <div className="pill-selector">
          {categories.map((cat) => {
            const isSelected = formData.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFormData((p) => ({ ...p, category: cat }))}
                className={`pill-option ${isSelected ? 'active' : ''}`}
              >
                {getCategoryIcon(cat, 'w-3.5 h-3.5')}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
        {errors.category && <span className="form-error-msg">{errors.category}</span>}
      </div>

      {/* Payment Method Pills */}
      <div className="form-group">
        <label className="form-label">
          <span>Payment Method</span>
        </label>
        <div className="pill-selector">
          {paymentMethods.map((method) => {
            const isSelected = formData.paymentMethod === method;
            return (
              <button
                key={method}
                type="button"
                onClick={() => setFormData((p) => ({ ...p, paymentMethod: method }))}
                className={`pill-option ${isSelected ? 'active' : ''}`}
              >
                <span>{method}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="expense-desc">
          <span>Notes / Description (Optional)</span>
        </label>
        <textarea
          id="expense-desc"
          name="description"
          rows={2}
          placeholder="Add any extra notes or receipt info..."
          value={formData.description}
          onChange={handleChange}
          className="form-control"
          maxLength={500}
        />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ minWidth: '140px' }}>
          {loading ? (
            'Saving...'
          ) : (
            <>
              <PlusCircle size={18} />
              <span>Add Expense</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
