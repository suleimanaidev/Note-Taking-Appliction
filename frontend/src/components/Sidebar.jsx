import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FileText, Trash2, LogOut, Download } from 'lucide-react';

export default function Sidebar({ page, setPage, open, setOpen, notesCount, trashCount }) {
  const { user, logoutUser } = useAuth();
  const addToast = useToast();

  const handleExport = async () => {
    try {
      const res = await fetch('/api/notes/export', { credentials: 'include' });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notevault-backup-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      addToast('Backup exported successfully!', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Note<span>Vault</span></h2>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-label">Menu</div>
          <div
            className={`nav-item ${page === 'notes' ? 'active' : ''}`}
            onClick={() => { setPage('notes'); setOpen(false); }}
          >
            <FileText size={18} />
            <span>My Notes</span>
            <span className="badge">{notesCount}</span>
          </div>
          <div
            className={`nav-item ${page === 'trash' ? 'active' : ''}`}
            onClick={() => { setPage('trash'); setOpen(false); }}
          >
            <Trash2 size={18} />
            <span>Trash</span>
            <span className="badge">{trashCount}</span>
          </div>
          <div
            className="nav-item"
            onClick={handleExport}
            title="Download JSON backup of all notes"
          >
            <Download size={18} />
            <span>Export Backup</span>
          </div>
        </nav>
        <div className="sidebar-footer">
          {user && (
            <div className="user-info">
              <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
              <div className="user-details">
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
          )}
          <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={logoutUser}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>
      <div className="sidebar-overlay" onClick={() => setOpen(false)} />
    </>
  );
}

