import React, { useState } from 'react';
import { formatMoneyINR } from '../utils/format';
import './Modal.css';

export default function TransactionModal({ initial, onClose, onSubmit }) {
  const init = initial || {};
  const [date, setDate] = useState(init.date || new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState(init.amount !== undefined ? String(init.amount) : '0');
  const [category, setCategory] = useState(init.category || 'Misc');
  const [type, setType] = useState(init.type || 'expense');

  function submit(e) {
    e.preventDefault();
    const n = Number(amount);
    if (!date || isNaN(n) || !category) return alert('Please provide valid values');
    onSubmit({ date, amount: n, category, type });
    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <form onSubmit={submit}>
          <h3>{init.id ? 'Edit Transaction' : 'Add Transaction'}</h3>
          <label>
            Date
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>

          <label>
            Amount
            <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <div className="small muted">Preview: {isNaN(Number(amount)) ? '-' : formatMoneyINR(Number(amount))}</div>
          </label>

          <label>
            Category
            <input value={category} onChange={(e) => setCategory(e.target.value)} />
          </label>

          <label>
            Type
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          <div className="modal-actions">
            <button type="button" className="action-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
