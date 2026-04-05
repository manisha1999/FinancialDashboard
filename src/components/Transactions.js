import React, { useMemo, useState, useEffect } from 'react';
import './Transactions.css';
import { useAppContext } from '../context/AppContext';
import { formatMoneyINR } from '../utils/format';
import TransactionModal from './TransactionModal';
import { toCSV, downloadFile } from '../utils/export';

function dateFmt(d) {
  return new Date(d).toLocaleDateString();
}

export default function Transactions() {
  const { transactions, filters, setFilters, role, addTransaction, editTransaction, deleteTransaction } = useAppContext();
  const [sortKey, setSortKey] = useState('date');
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // local debounced search input to avoid updating context on each keystroke
  const [qLocal, setQLocal] = useState(filters.q || '');
  const [groupBy, setGroupBy] = useState('none');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = useMemo(() => {
    let t = [...transactions];
    if (dateFrom) t = t.filter((x) => new Date(x.date) >= new Date(dateFrom));
    if (dateTo) t = t.filter((x) => new Date(x.date) <= new Date(dateTo));
    if (filters.q) {
      const q = filters.q.toLowerCase();
      t = t.filter((x) => (x.category || '').toLowerCase().includes(q) || String(x.amount).includes(q));
    }
    if (filters.type && filters.type !== 'all') {
      t = t.filter((x) => x.type === filters.type);
    }
    t.sort((a, b) => {
      if (sortKey === 'amount') return b.amount - a.amount;
      return new Date(b.date) - new Date(a.date);
    });
    return t;
  }, [transactions, filters.q, filters.type, sortKey, dateFrom, dateTo]);

  // debounce updating the global filters.q
  useEffect(() => {
    const id = setTimeout(() => setFilters((f) => ({ ...f, q: qLocal })), 250);
    return () => clearTimeout(id);
  }, [qLocal, setFilters]);

  // keep local input in sync if filters.q is changed elsewhere
  useEffect(() => setQLocal(filters.q || ''), [filters.q]);

  function onAdd() {
    setEditing(null);
    setShowModal(true);
  }

  function onEdit(tx) {
    setEditing(tx);
    setShowModal(true);
  }

  function onDelete(id) {
    if (window.confirm('Delete this transaction?')) deleteTransaction(id);
  }

  // prepare grouped rows if grouping is enabled
  const groupedRows = useMemo(() => {
    if (groupBy === 'none') return null;
    if (groupBy === 'category') {
      const map = {};
      filtered.forEach((t) => { map[t.category] = (map[t.category] || 0) + Number(t.amount); });
      return Object.keys(map).map((k) => (
        <tr key={k}>
          <td>{k}</td>
          <td style={{ textAlign: 'right' }}>{formatMoneyINR(map[k])}</td>
        </tr>
      ));
    }
    // month grouping
    const map = {};
    filtered.forEach((t) => {
      const m = new Date(t.date).toISOString().slice(0, 7);
      map[m] = (map[m] || 0) + Number(t.amount);
    });
    return Object.keys(map).sort().map((k) => {
      const dt = new Date(k + '-01');
      return (
        <tr key={k}>
          <td>{dt.toLocaleString('en-IN', { month: 'short', year: 'numeric' })}</td>
          <td style={{ textAlign: 'right' }}>{formatMoneyINR(map[k])}</td>
        </tr>
      );
    });
  }, [groupBy, filtered]);

  return (
    <div className="transactions">
      <div className="transactions-header">
        <div>
          <input
            placeholder="Search category or amount"
            value={qLocal}
            onChange={(e) => setQLocal(e.target.value)}
          />
          <select value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}>
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <label style={{ marginLeft: 8 }} className="small">From</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <label className="small">To</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          <label style={{ marginLeft: 8 }} className="small">Group:</label>
          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
            <option value="none">None</option>
            <option value="category">Category</option>
            <option value="month">Month</option>
          </select>
        </div>
        <div>
          <label>Sort:</label>
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
          <button
            className="action-btn"
            onClick={() => {
              const csv = toCSV(filtered, ['date', 'category', 'type', 'amount']);
              downloadFile('transactions.csv', csv, 'text/csv');
            }}
            style={{ marginLeft: 8 }}
          >
            Export CSV
          </button>
          <button
            className="action-btn"
            onClick={() => downloadFile('transactions.json', JSON.stringify(filtered, null, 2), 'application/json')}
            style={{ marginLeft: 8 }}
          >
            Export JSON
          </button>
          {role === 'admin' && (
            <button className="btn" onClick={onAdd} style={{ marginLeft: 8 }} aria-label="Add transaction">
              <svg width="14" height="14" viewBox="0 0 24 24" style={{ marginRight: 8 }} xmlns="http://www.w3.org/2000/svg">
                <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" fill="currentColor" />
              </svg>
              Add
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <TransactionModal
          initial={editing}
          onClose={() => {
            setShowModal(false);
            setEditing(null);
          }}
          onSubmit={(tx) => {
            if (!tx) return;
            if (editing) editTransaction(editing.id, tx);
            else addTransaction(tx);
            setShowModal(false);
            setEditing(null);
          }}
        />
      )}

      {groupBy !== 'none' ? (
        <table className="tx-table">
          <thead>
            <tr>
              <th>Group</th>
              <th style={{ textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>{groupedRows}</tbody>
        </table>
      ) : (
        <table className="tx-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Type</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  No transactions
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id}>
                  <td>{dateFmt(t.date)}</td>
                  <td>{t.category}</td>
                  <td>{t.type}</td>
                  <td style={{ textAlign: 'right' }}>{formatMoneyINR(t.amount)}</td>
                  <td style={{ width: 140 }}>
                    {role === 'admin' ? (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <button className="action-btn" onClick={() => onEdit(t)} aria-label="Edit transaction">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" fill="currentColor" />
                          </svg>
                          <span className="small">Edit</span>
                        </button>
                        <button className="action-btn danger" onClick={() => onDelete(t.id)} aria-label="Delete transaction">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor" />
                          </svg>
                          <span className="small">Delete</span>
                        </button>
                      </div>
                    ) : (
                      <span className="small muted">Admin only</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
