import React, { useState } from 'react';
import './Navbar.css';
import { useAppContext } from '../context/AppContext';

export default function Navbar({ view, onChange }) {
  const [open, setOpen] = useState(false);
  const { role } = useAppContext();

  function handleNavigate(v) {
    onChange(v);
    // close on mobile after navigating
    setOpen(false);
  }

  return (
    <>
      <div className="mobile-header">
        <button
          className="mobile-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((s) => !s)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
        <div className="brand mobile-brand">zorvyn</div>
      </div>

      {open && <div className="nav-overlay" onClick={() => setOpen(false)} aria-hidden />}

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">zorvyn</div>
        <nav className="nav">
          <div className={`nav-item ${view === 'overview' ? 'active' : ''}`} onClick={() => handleNavigate('overview')} role="button" tabIndex={0}>
            <span className="nav-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" fill="currentColor" />
              </svg>
            </span>
            <span className="nav-label">Dashboard</span>
          </div>
          <div className={`nav-item ${view === 'transactions' ? 'active' : ''}`} onClick={() => handleNavigate('transactions')} role="button" tabIndex={0}>
            <span className="nav-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" fill="currentColor" />
              </svg>
            </span>
            <span className="nav-label">Transactions</span>
          </div>
          <div className={`nav-item ${view === 'insights' ? 'active' : ''}`} onClick={() => handleNavigate('insights')} role="button" tabIndex={0}>
            <span className="nav-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17h4V7H3v10zm6 0h4V3H9v14zm6 0h4v-7h-4v7z" fill="currentColor" />
              </svg>
            </span>
            <span className="nav-label">Insights</span>
          </div>
        </nav>
        <div className="sidebar-footer">
          <span className="muted">Role</span>
          <span className="role-badge">{role || 'viewer'}</span>
        </div>
      </aside>
    </>
  );
}
