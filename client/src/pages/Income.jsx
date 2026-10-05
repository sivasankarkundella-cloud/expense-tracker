import React, { useState, useEffect } from 'react';
import { TrendingUp, PlusCircle, Wallet, Award, DollarSign } from 'lucide-react';
import { incomeApi, dashboardApi } from '../services/api';
import IncomeForm from '../components/IncomeForm';
import IncomeList from '../components/IncomeList';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Delete modal
  const [deletingIncome, setDeletingIncome] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchIncomeData = async () => {
    try {
      setLoading(true);
      const res = await incomeApi.getAll();
      setIncomes(res.data || []);
      setTotalIncome(res.totalIncomeAmount || 0);
    } catch (err) {
      console.error('Failed to load income:', err);
      toast.error('Failed to load income data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeData();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deletingIncome) return;
    try {
      setDeleteLoading(true);
      await incomeApi.delete(deletingIncome._id);
      toast.success('Income entry removed successfully');
      setDeletingIncome(null);
      fetchIncomeData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete income record');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Top Banner / Stat */}
      <div
        className="card mb-4"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.05) 100%)',
          borderColor: 'rgba(16, 185, 129, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-income)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Cumulative Earnings
          </span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {formatCurrency(totalIncome)}
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Recorded across {incomes.length} income transactions
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`btn ${showAddForm ? 'btn-secondary' : 'btn-success'}`}
        >
          <PlusCircle size={18} />
          <span>{showAddForm ? 'Close Form' : 'Add New Income'}</span>
        </button>
      </div>

      {/* Add Income Form */}
      {showAddForm && (
        <div className="card mb-4" style={{ animation: 'slideUp 0.2s ease-out' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
            Record Income Inflow
          </h3>
          <IncomeForm
            onSuccess={() => {
              fetchIncomeData();
              setShowAddForm(false);
            }}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Income Records List */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
          Income History
        </h3>
        <IncomeList
          incomes={incomes}
          loading={loading}
          onDelete={(item) => setDeletingIncome(item)}
          onAddNew={() => setShowAddForm(true)}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingIncome)}
        title="Delete Income Record"
        itemTitle={deletingIncome?.title || deletingIncome?.source}
        amount={deletingIncome?.amount}
        loading={deleteLoading}
        onClose={() => setDeletingIncome(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Income;
