import React from 'react';
import './SummaryCards.css';
import { useAppContext } from '../context/AppContext';
import { formatMoneyINR } from '../utils/format';

export default function SummaryCards() {
  const { transactions } = useAppContext();
  const total = transactions.reduce((s, t) => s + t.amount, 0);
  const income = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="summary-cards">
      <div className="card">
        <div className="card-head">
          <span className="card-icon balance" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="currentColor" />
              <path d="M12 8a4 4 0 100 8 4 4 0 000-8z" fill="#fff" opacity="0.2" />
            </svg>
          </span>
          <div className="card-title">Total Balance</div>
        </div>
        <div className="card-value">{formatMoneyINR(total)}</div>
      </div>
      <div className="card">
        <div className="card-head">
          <span className="card-icon income" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 9l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 22H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="card-title">Income</div>
        </div>
        <div className="card-value positive">{formatMoneyINR(income)}</div>
      </div>
      <div className="card">
        <div className="card-head">
          <span className="card-icon expenses" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 15l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 2h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="card-title">Expenses</div>
        </div>
        <div className="card-value negative">{formatMoneyINR(expenses)}</div>
      </div>
    </div>
  );
}
