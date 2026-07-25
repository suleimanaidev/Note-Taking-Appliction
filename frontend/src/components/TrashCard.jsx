import React from 'react';

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function TrashCard({ note, onRestore, onDelete }) {
  return (
    <div className="note-card" style={{ cursor: 'default' }}>
      <div className="color-strip" style={{ background: note.color }}></div>
      <div className="card-body">
        <div className="card-title">
          <span>{note.title}</span>
        </div>
        <div className="card-content">{note.content}</div>
        <div className="card-meta">
          <span className="card-category">{note.category}</span>
          <span>Deleted {formatDate(note.deletedAt)}</span>
        </div>
      </div>
      <div className="trash-card-actions">
        <button className="btn btn-sm btn-secondary" onClick={() => onRestore(note)}>
          Restore
        </button>
        <button className="btn btn-sm btn-danger" onClick={() => onDelete(note)}>
          Delete Forever
        </button>
      </div>
    </div>
  );
}
