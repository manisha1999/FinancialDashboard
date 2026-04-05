import React from 'react';
import './CategoryPie.css';
import { useAppContext } from '../context/AppContext';
import { formatMoneyINR } from '../utils/format';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFE', '#FF6B8A'];

function pickEmoji(n) {
  const key = (n || '').toLowerCase();
  if (key.includes('rent') || key.includes('home') || key.includes('house')) return '🏠';
  if (key.includes('groc') || key.includes('super')) return '🛒';
  if (key.includes('food') || key.includes('restau') || key.includes('dine')) return '🍔';
  if (key.includes('trans') || key.includes('fuel') || key.includes('taxi') || key.includes('uber') || key.includes('bus') || key.includes('car')) return '🚗';
  if (key.includes('util') || key.includes('electric') || key.includes('water') || key.includes('bill')) return '💡';
  if (key.includes('enter') || key.includes('movie') || key.includes('netflix') || key.includes('leisure')) return '🎬';
  if (key.includes('shopping') || key.includes('shop')) return '🛍️';
  if (key.includes('salary') || key.includes('income') || key.includes('pay')) return '💼';
  return '📦';
}

export default function CategoryPie({ height = 260 }) {
  const { categoriesSummary } = useAppContext();
  const byCategory = categoriesSummary || [];

  if (!byCategory || byCategory.length === 0) {
    return (
      <div className="chart card">
        <div className="card-title">Spending by Category</div>
        <div style={{ padding: 20 }}>No category data</div>
      </div>
    );
  }

  return (
    <div className="chart card">
      <div className="card-title">Spending by Category</div>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={byCategory}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={(props) => {
              const { cx, cy, midAngle, outerRadius, index } = props;
              const RAD = Math.PI / 180;
              const x = cx + (outerRadius + 12) * Math.cos(-midAngle * RAD);
              const y = cy + (outerRadius + 12) * Math.sin(-midAngle * RAD);
              const emoji = pickEmoji(props.payload && props.payload.name);
              return (
                <g key={`label-${index}`} transform={`translate(${x}, ${y})`} aria-hidden>
                  <text x={0} y={0} textAnchor="middle" dominantBaseline="central" fontSize={16}>
                    {emoji}
                  </text>
                </g>
              );
            }}
          >
            {byCategory.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => formatMoneyINR(v)} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
