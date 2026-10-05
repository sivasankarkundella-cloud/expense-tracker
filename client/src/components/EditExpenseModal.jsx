import React, { useState, useEffect } from 'react';
import { X, Save, Edit3 } from 'lucide-react';
import { expenseApi } from '../services/api';
import { categories, paymentMethods } from './ExpenseForm';
import { getCategoryIcon } from '../utils/formatters';
import toast from 'react-hot-toast';

const EditExpenseModal = ({ isOpen, expense, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: '',
    paymentMethod: 'UPI',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || '',
        amount: expense.amount || '',
        category: expense.category || 'Food',
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : '',
        paymentMethod: expense.paymentMethod || 'UPI',
        description: expense.description || '',
      });
      setErrors({});
    }
  }, [expense]);

  if (!isOpen || !expense) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Please enter an expense title';
    }
    if (!formData.amount) {
      errs.amount = 'Please enter an amount';
    } else {
      const amt = parseFloat(formData.amount);
      if (isNaN(amt) || amt <= 0) {
        errs.amount = 'Amount must be greater than 0';
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
      toast.error('Please fix the errors in the form');
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

      const res = await expenseApi.update(expense._id, payload);
      toast.success('Expense updated successfully! ✨');
      if (onSuccess) {
        onSuccess(res.data);
      }
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to update expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
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
              <Edit3 size={18} />
            </div>
            <h3 className="modal-title">Edit Expense</h3>
          </div>
          <button onClick={onClose} className="btn-icon btn-sm" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="edit-title">
                <span>Expense Title <span className="required-star">*</span></span>
              </label>
              <input
                id="edit-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`form-control ${errors.title ? 'error' : ''}`}
                maxLength={100}
              />
              {errors.title && <span className="form-error-msg">{errors.title}</span>}
            </div>

            {/* Amount & Date */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="edit-amount">
                  <span>Amount (₹) <span className="required-star">*</span></span>
                </label>
                <input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className={`form-control ${errors.amount ? 'error' : ''}`}
                />
                {errors.amount && <span className="form-error-msg">{errors.amount}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-date">
                  <span>Date <span className="required-star">*</span></span>
                </label>
                <input
                  id="edit-date"
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
            </div>

            {/* Payment Method */}
            <div className="form-group">
              <label className="form-label">Payment Method</label>
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
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="edit-desc">Description</label>
              <textarea
                id="edit-desc"
                name="description"
                rows={2}
                value={formData.description}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} disabled={loading} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? (
                'Saving Changes...'
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;
