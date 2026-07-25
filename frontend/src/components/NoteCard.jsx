import React from 'react';
import { Pin, Trash2 } from 'lucide-react';

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function NoteCard({ note, onEdit, onDelete, onPin }) {
  return (
    <div className="note-card" onClick={() => onEdit(note)}>
      <div className="color-strip" style={{ background: note.color }}></div>
      <div className="card-body">
        <div className="card-title">
          {note.pinned && <Pin className="pin" size={14} style={{ fill: 'var(--accent)', color: 'var(--accent)' }} />}
          <span>{note.title}</span>
        </div>
        <div className="card-content">{note.content}</div>
        <div className="card-meta">
          <span className="card-category">{note.category}</span>
          <span>{formatDate(note.createdAt)}</span>
        </div>
      </div>
      <div className="card-actions" onClick={e => e.stopPropagation()}>
        <button
          className="card-action-btn"
          onClick={e => { e.stopPropagation(); onPin(note); }}
          title={note.pinned ? 'Unpin' : 'Pin'}
        >
          <Pin size={14} />
        </button>
        <button
          className="card-action-btn delete"
          onClick={e => { e.stopPropagation(); onDelete(note); }}
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
