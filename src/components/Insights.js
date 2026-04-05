import React, { useMemo } from 'react';
import './Insights.css';
import { useAppContext } from '../context/AppContext';
import { formatMoneyINR } from '../utils/format';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFE', '#FF6B8A'];

// helper kept simple: we'll compute income/expense per-month inside the component

export default function Insights() {
  const { monthlyAggregates, totalIncome, totalExpenses, transactions } = useAppContext();

  // compute highest spending category from expenses only
  const highestCategory = (() => {
    if (!transactions || transactions.length === 0) return null;
    const map = {};
    transactions.forEach((t) => {
      const amt = Number(t.amount) || 0;
      const isExpense = t.type === 'expense' || amt < 0;
      if (!isExpense) return;
      const k = t.category || 'Misc';
      map[k] = (map[k] || 0) + Math.abs(amt);
    });
    const arr = Object.keys(map).map((k) => ({ name: k, value: Math.round(map[k] * 100) / 100 }));
    arr.sort((a, b) => b.value - a.value);
    return arr[0] || null;
  })();

  // use monthlyAggregates provided by context
  const incomeExpenseByMonth = monthlyAggregates || [];

  const savingRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const avgMonthlyExpense = useMemo(() => {
    if (!monthlyAggregates || monthlyAggregates.length === 0) return 0;
    const monthsWithExpense = monthlyAggregates.filter((m) => m.expense > 0);
    if (monthsWithExpense.length === 0) return 0;
    const total = monthsWithExpense.reduce((s, m) => s + (m.expense || 0), 0);
    return Math.round((total / monthsWithExpense.length) * 100) / 100;
  }, [monthlyAggregates]);

  return (
    <div className="insights">
      <div className="summary-cards" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-head">
            <span className="card-icon expenses" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19 15l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 2h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="card-title">Top spending</div>
          </div>
          <div className="card-value">{highestCategory ? `${highestCategory.name} (${formatMoneyINR(highestCategory.value)})` : '—'}</div>
        </div>

        <div className="card">
          <div className="card-head">
            <span className="card-icon balance" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1C6.48 1 2 5.48 2 11s4.48 10 10 10 10-4.48 10-10S17.52 1 12 1zm1 15h-2v-6h2v6zm0-8h-2V7h2v1z" fill="currentColor" />
              </svg>
            </span>
            <div className="card-title">Saving rate</div>
          </div>
          <div className="card-value">{totalIncome > 0 ? `${savingRate.toFixed(1)}%` : '—'}</div>
        </div>

        <div className="card">
          <div className="card-head">
            <span className="card-icon expenses" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7h10v2H7V7zm0 4h10v6H7v-6z" fill="currentColor" />
              </svg>
            </span>
            <div className="card-title">Avg monthly expense</div>
          </div>
          <div className="card-value">{formatMoneyINR(avgMonthlyExpense)}</div>
        </div>
      </div>

      <div className="chart card">
        <div className="card-title"><span className="chart-icon" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" fill="currentColor" />
            </svg>
          </span> Income &amp; Expenses</div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={incomeExpenseByMonth} margin={{ left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip formatter={(v) => formatMoneyINR(v)} />
            <Line type="monotone" dataKey="income" stroke="#00C49F" strokeWidth={2} name="Income" />
            <Line type="monotone" dataKey="expense" stroke="#FF6B6B" strokeWidth={2} name="Expense" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
