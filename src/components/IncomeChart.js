import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatMoneyINR } from '../utils/format';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function IncomeChart({ height = 220 }) {
  const { transactions } = useAppContext();

  const incomeByMonth = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const m = new Date(t.date).toISOString().slice(0, 7);
      if (!map[m]) map[m] = 0;
      const isIncome = t.type === 'income' || t.amount > 0;
      if (isIncome) map[m] += Math.abs(t.amount);
    });
    return Object.keys(map)
      .sort()
      .map((k) => {
        const dt = new Date(k + '-01');
        const label = dt.toLocaleString('en-IN', { month: 'short', year: 'numeric' });
        return {
          month: k,
          label,
          income: Math.round(map[k] * 100) / 100
        };
      });
  }, [transactions]);

  if (!incomeByMonth || incomeByMonth.length === 0) {
    return (
      <div className="chart card">
        <div className="card-title">Monthly Income</div>
        <div style={{ padding: 20 }}>No income data</div>
      </div>
    );
  }

  return (
    <div className="chart card">
      <div className="card-title">Monthly Income</div>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={incomeByMonth} margin={{ left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip formatter={(v) => formatMoneyINR(v)} />
          <Line type="monotone" dataKey="income" stroke="#00C49F" strokeWidth={2} name="Income" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
