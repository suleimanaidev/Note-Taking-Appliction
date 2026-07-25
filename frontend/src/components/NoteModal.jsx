import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Pin, X } from 'lucide-react';

const CATEGORIES = ['Personal', 'Work', 'Study', 'Ideas', 'Shopping', 'Travel', 'Health', 'Finance'];
const COLORS = ['#e8a849', '#4ecdc4', '#ff6b6b', '#95e1d3', '#fce38a', '#ff8b94', '#a8d8ea', '#ffd3b6'];

export default function NoteModal({ note, onClose, onSave }) {
  const { getAuthHeaders } = useAuth();
  const isNew = !note || !note._id;
  const [form, setForm] = useState(() => {
    if (note && note._id) {
      return { title: note.title, content: note.content, category: note.category, color: note.color, pinned: note.pinned };
    }
    return { title: '', content: '', category: 'Personal', color: '#e8a849', pinned: false };
  });

  const [loading, setLoading] = useState(false);
  const addToast = useToast();
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) titleRef.current.focus();
  }, []);

  const handleSave = async () => {
    if (!form.title.trim()) { addToast('Title is required', 'error'); return; }
    if (!form.content.trim()) { addToast('Content is required', 'error'); return; }

    setLoading(true);
    try {
      const url = isNew ? '/api/notes' : `/api/notes/${note._id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Save failed');


      addToast(isNew ? 'Note created!' : 'Note updated!', 'success');
      onSave(data.note);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSave();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()} onKeyDown={handleKeyDown}>
      <div className="modal">
        <div className="modal-header">
          <h3>{isNew ? 'New Note' : 'Edit Note'}</h3>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Title</label>
            <input
              ref={titleRef}
              className="input-field"
              placeholder="Note title..."
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              maxLength={200}
            />
          </div>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Content</label>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {form.content.length} chars | {form.content.trim() ? form.content.trim().split(/\s+/).length : 0} words
              </span>
            </div>
            <textarea
              className="input-field"
              placeholder="Write your note here..."
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={7}
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              className="category-select"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Color Accent</label>
            <div className="color-picker">
              {COLORS.map(c => (
                <div
                  key={c}
                  className={`color-option ${form.color === c ? 'active' : ''}`}
                  style={{ background: c }}
                  onClick={() => setForm(f => ({ ...f, color: c }))}
                />
              ))}
            </div>
          </div>
          <div className="form-group">
            <div
              className={`pin-toggle ${form.pinned ? 'active' : ''}`}
              onClick={() => setForm(f => ({ ...f, pinned: !f.pinned }))}
            >
              <Pin size={16} />
              <span>{form.pinned ? 'Pinned note' : 'Pin this note'}</span>
            </div>
          </div>
        </div>
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Press <kbd style={{ background: 'var(--bg-primary)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border)' }}>Ctrl</kbd> + <kbd style={{ background: 'var(--bg-primary)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border)' }}>Enter</kbd> to save
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : (isNew ? 'Create Note' : 'Save Changes')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

