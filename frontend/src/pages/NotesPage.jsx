import React from 'react';
import NoteCard from '../components/NoteCard';
import { FileText, Plus } from 'lucide-react';

const CATEGORIES = ['Personal', 'Work', 'Study', 'Ideas', 'Shopping', 'Travel', 'Health', 'Finance'];

export default function NotesPage({
  notes,
  search,
  category,
  setCategory,
  sort,
  setSort,
  pagination,
  goToPage,
  onEdit,
  onDelete,
  onPin,
  onNewNote
}) {
  return (
    <div className="content-area">
      <div className="page-header">
        <h2 className="page-title">My Notes</h2>
        <div className="filter-row">
          <div
            className={`category-chip ${category === '' ? 'active' : ''}`}
            onClick={() => setCategory('')}
          >
            All
          </div>
          {CATEGORIES.map(c => (
            <div
              key={c}
              className={`category-chip ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </div>
          ))}
          <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="alphabetical">A-Z</option>
          </select>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><FileText size={64} /></div>
          <h3>{search ? 'No results found' : 'No notes yet'}</h3>
          <p>{search ? 'Try a different search term' : 'Create your first note to get started!'}</p>
          {!search && (
            <button className="btn btn-primary" onClick={onNewNote}>
              <Plus size={16} /> Create Note
            </button>
          )}
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map(n => (
            <NoteCard
              key={n._id}
              note={n}
              onEdit={onEdit}
              onDelete={onDelete}
              onPin={onPin}
            />
          ))}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="pagination">
          <button onClick={() => goToPage(pagination.page - 1)} disabled={pagination.page <= 1}>
            Prev
          </button>
          <span className="page-info">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button onClick={() => goToPage(pagination.page + 1)} disabled={pagination.page >= pagination.pages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
