import React from 'react';
import { X } from 'lucide-react';

export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="modal" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h3>{title || 'Are you sure?'}</h3>
          <button className="modal-close" onClick={onCancel}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
            {message}
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
