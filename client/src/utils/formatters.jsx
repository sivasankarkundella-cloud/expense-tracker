import React from 'react';
import {
  Utensils,
  ShoppingBag,
  Car,
  Receipt,
  Film,
  GraduationCap,
  HeartPulse,
  Compass,
  Layers,
  Briefcase,
  Gift,
  Award,
  CreditCard,
  Smartphone,
  Banknote,
  Building,
} from 'lucide-react';

// Format Indian Rupee currency with commas
export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

// Format date into human-readable string
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

// Get Category Icon Component
export const getCategoryIcon = (category, className = 'w-4 h-4') => {
  switch (category) {
    case 'Food':
      return <Utensils className={className} />;
    case 'Shopping':
      return <ShoppingBag className={className} />;
    case 'Transport':
      return <Car className={className} />;
    case 'Bills':
      return <Receipt className={className} />;
    case 'Entertainment':
      return <Film className={className} />;
    case 'Education':
      return <GraduationCap className={className} />;
    case 'Health':
      return <HeartPulse className={className} />;
    case 'Travel':
      return <Compass className={className} />;
    case 'Salary':
      return <Briefcase className={className} />;
    case 'Freelance':
      return <Briefcase className={className} />;
    case 'Scholarship':
      return <Award className={className} />;
    case 'Gift':
      return <Gift className={className} />;
    default:
      return <Layers className={className} />;
  }
};

// Get Payment Method Icon
export const getPaymentIcon = (method, className = 'w-3.5 h-3.5') => {
  switch (method) {
    case 'Credit Card':
    case 'Debit Card':
      return <CreditCard className={className} />;
    case 'UPI':
      return <Smartphone className={className} />;
    case 'Bank Transfer':
      return <Building className={className} />;
    case 'Cash':
    default:
      return <Banknote className={className} />;
  }
};

// Category Badge CSS Class
export const getCategoryBadgeClass = (category) => {
  const cat = (category || '').toLowerCase();
  return `category-badge badge-${cat}`;
};
