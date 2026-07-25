import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import NoteModal from './components/NoteModal';
import ConfirmModal from './components/ConfirmModal';
import AuthPage from './pages/AuthPage';
import NotesPage from './pages/NotesPage';
import TrashPage from './pages/TrashPage';
import LandingPage from './pages/LandingPage';
import { Plus } from 'lucide-react';

export default function App() {
  const { user, loading, theme, getAuthHeaders } = useAuth();
  const addToast = useToast();

  const [notes, setNotes] = useState([]);
  const [trash, setTrash] = useState([]);
  const [page, setPage] = useState('notes');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [modal, setModal] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  
  // Default viewState for unauthenticated users is 'landing'
  const [viewState, setViewState] = useState('landing'); // 'landing' | 'auth' | 'app'

  const searchTimerRef = useRef(null);

  const fetchNotes = useCallback(async (p, s, c, st) => {
    try {
      const params = new URLSearchParams({ page: p, sort: st, limit: 20 });
      if (s) params.set('search', s);
      if (c) params.set('category', c);
      const res = await fetch('/api/notes?' + params.toString(), {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch notes');
      setNotes(data.notes);
      setPagination(data.pagination);
    } catch (err) {
      addToast(err.message, 'error');
    }
  }, [addToast, getAuthHeaders]);

  const fetchTrash = useCallback(async () => {
    try {
      const res = await fetch('/api/notes/trash', {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch trash');
      setTrash(data.notes);
    } catch (err) {
      addToast(err.message, 'error');
    }
  }, [addToast, getAuthHeaders]);

  useEffect(() => {
    if (!user) return;
    if (page === 'notes') fetchNotes(1, search, category, sort);
    else fetchTrash();
  }, [user, page, category, sort]);

  useEffect(() => {
    if (!user || page !== 'notes') return;
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      fetchNotes(1, search, category, sort);
    }, 300);
    return () => clearTimeout(searchTimerRef.current);
  }, [search]);

  useEffect(() => () => clearTimeout(searchTimerRef.current), []);

  const handleDelete = async (note) => {
    try {
      const res = await fetch(`/api/notes/${note._id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      addToast('Note moved to trash', 'info');
      fetchNotes(pagination.page, search, category, sort);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handlePin = async (note) => {
    try {
      const res = await fetch(`/api/notes/${note._id}/pin`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      addToast(data.message || 'Updated pin', 'success');
      fetchNotes(pagination.page, search, category, sort);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleRestore = async (note) => {
    try {
      const res = await fetch(`/api/notes/trash/${note._id}/restore`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      addToast('Note restored', 'success');
      fetchTrash();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handlePermanentDelete = (note) => {
    setConfirmDialog({
      title: 'Delete permanently?',
      message: 'This note will be permanently deleted. This action cannot be undone.',
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          const res = await fetch(`/api/notes/trash/${note._id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
            credentials: 'include'
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message);
          addToast('Note permanently deleted', 'info');
          fetchTrash();
        } catch (err) {
          addToast(err.message, 'error');
        }
      }
    });
  };

  const handleEmptyTrash = () => {
    setConfirmDialog({
      title: 'Empty trash?',
      message: `All ${trash.length} deleted notes will be permanently removed. This action cannot be undone.`,
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          const res = await fetch('/api/notes/trash/empty', {
            method: 'DELETE',
            headers: getAuthHeaders(),
            credentials: 'include'
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message);
          addToast('Trash emptied', 'info');
          fetchTrash();
        } catch (err) {
          addToast(err.message, 'error');
        }
      }
    });
  };


  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '16px', fontSize: '13px' }}>Loading NoteVault...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated user flow: Landing Page by default
  if (!user) {
    if (viewState === 'landing') {
      return (
        <LandingPage
          onGetStarted={() => setViewState('auth')}
          onSignIn={() => setViewState('auth')}
        />
      );
    }
    return <AuthPage onBackToLanding={() => setViewState('landing')} />;
  }

  // Logged-in user view
  return (
    <div className={theme}>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <div className="app-layout">
        <Sidebar
          page={page}
          setPage={setPage}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          notesCount={pagination.total}
          trashCount={trash.length}
        />
        <main className="main-content">
          <Topbar
            search={search}
            setSearch={setSearch}
            onToggleSidebar={() => setSidebarOpen(o => !o)}
          />
          {page === 'notes' ? (
            <NotesPage
              notes={notes}
              search={search}
              category={category}
              setCategory={setCategory}
              sort={sort}
              setSort={setSort}
              pagination={pagination}
              goToPage={p => fetchNotes(p, search, category, sort)}
              onEdit={n => setModal(n)}
              onDelete={handleDelete}
              onPin={handlePin}
              onNewNote={() => setModal({})}
            />
          ) : (
            <TrashPage
              trash={trash}
              onRestore={handleRestore}
              onDelete={handlePermanentDelete}
              onEmptyTrash={handleEmptyTrash}
            />
          )}
        </main>
      </div>

      {page === 'notes' && (
        <button className="fab" onClick={() => setModal({})} title="New note">
          <Plus size={28} />
        </button>
      )}

      {modal !== null && (
        <NoteModal
          note={modal._id ? modal : null}
          onClose={() => setModal(null)}
          onSave={() => {
            setModal(null);
            fetchNotes(pagination.page, search, category, sort);
          }}
        />
      )}

      {confirmDialog !== null && (
        <ConfirmModal
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
}
