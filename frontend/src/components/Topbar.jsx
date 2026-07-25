import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, Search, Sun, Moon, X } from 'lucide-react';

export default function Topbar({ search, setSearch, onToggleSidebar }) {
  const { theme, toggleTheme } = useAuth();

  return (
    <div className="topbar">
      <button className="menu-btn" onClick={onToggleSidebar}>
        <Menu size={20} />
      </button>
      <div className="search-box">
        <Search className="search-icon" size={16} />
        <input
          placeholder="Search title, content or tag..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px'
            }}
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <div className="topbar-actions">
        <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </div>
  );
}

