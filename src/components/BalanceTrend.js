import React, { useMemo } from 'react';
import './BalanceTrend.css';
import { useAppContext } from '../context/AppContext';
import { formatMoneyINR } from '../utils/format';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function BalanceTrend({ height = 260 }) {
    const { monthlyAggregates } = useAppContext();

    // build cumulative balance series from monthlyAggregates provided by context
    const series = useMemo(() => {
        let cum = 0;
        return (monthlyAggregates || []).map((m) => {
            cum += Number(m.net || 0);
            return { month: m.month, label: m.label, balance: Math.round(cum * 100) / 100 };
        });
    }, [monthlyAggregates]);

    if (!series || series.length === 0) {
        return (
            <div className="chart card">
                <div className="card-title">Balance Trend</div>
                <div style={{ padding: 20 }}>No data</div>
            </div>
        );
    }

    return (
        <div className="chart card">
            <div className="card-title">Balance Trend</div>
            <ResponsiveContainer width="100%" height={height}>
                <LineChart data={series} margin={{ left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip formatter={(v) => formatMoneyINR(v)} />
                    <Line type="monotone" dataKey="balance" stroke="#3756C3" strokeWidth={2} name="Balance" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
