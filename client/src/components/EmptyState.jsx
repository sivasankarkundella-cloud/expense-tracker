import React from 'react';
import { Layers, Plus } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Layers,
  title = 'No records found',
  description = 'There are no items matching your current filters or search query.',
  actionText,
  onAction,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-icon-wrapper">
        <Icon size={34} />
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-desc">{description}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
