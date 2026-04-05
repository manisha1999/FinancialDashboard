import React, { useMemo } from 'react';
import './ExpensesChart.css';
import { useAppContext } from '../context/AppContext';
import { formatMoneyINR } from '../utils/format';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function ExpensesChart({ height = 220 }) {
  const { monthlyAggregates } = useAppContext();
  const expensesByMonth = (monthlyAggregates || []).map((m) => ({ month: m.month, label: m.label, expense: m.expense }));

  if (!expensesByMonth || expensesByMonth.length === 0) {
    return (
      <div className="chart card">
        <div className="card-title">Monthly Expenses</div>
        <div style={{ padding: 20 }}>No expense data</div>
      </div>
    );
  }

  return (
    <div className="chart card">
      <div className="card-title">Monthly Expenses</div>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={expensesByMonth} margin={{ left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip formatter={(v) => formatMoneyINR(v)} />
          <Line type="monotone" dataKey="expense" stroke="#FF6B6B" strokeWidth={2} name="Expense" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
