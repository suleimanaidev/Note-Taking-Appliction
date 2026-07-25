import React from 'react';
import TrashCard from '../components/TrashCard';
import { Trash2 } from 'lucide-react';

export default function TrashPage({ trash, onRestore, onDelete, onEmptyTrash }) {
  return (
    <div className="content-area">
      <div className="page-header">
        <h2 className="page-title">Trash</h2>
        {trash.length > 0 && (
          <button className="btn btn-danger btn-sm" onClick={onEmptyTrash}>
            Empty Trash
          </button>
        )}
      </div>

      {trash.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Trash2 size={64} /></div>
          <h3>Trash is empty</h3>
          <p>Deleted notes will appear here</p>
        </div>
      ) : (
        <div className="notes-grid">
          {trash.map(n => (
            <TrashCard
              key={n._id}
              note={n}
              onRestore={onRestore}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
