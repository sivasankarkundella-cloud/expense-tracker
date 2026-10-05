import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';

const DashboardCard = ({
  title,
  amount,
  icon: Icon,
  type = 'balance',
  subtitle,
  trend,
  isPositive,
  count,
}) => {
  return (
    <div className={`stat-card ${type}`}>
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        <div className={`stat-icon-wrapper ${type}`}>
          {Icon && <Icon size={22} />}
        </div>
      </div>

      <div>
        <div className="stat-amount">{formatCurrency(amount)}</div>
        <div className="stat-footer">
          {trend !== undefined && (
            <span className={`stat-trend ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {trend}
            </span>
          )}
          <span>{subtitle || (count !== undefined ? `${count} transactions` : 'Updated live')}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
