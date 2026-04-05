import React, { useState, lazy, Suspense } from 'react';
import './Dashboard.css';
import SummaryCards from './SummaryCards';
import Transactions from './Transactions';
import RoleSwitcher from './RoleSwitcher';
import Navbar from './Navbar';
const CategoryPie = lazy(() => import('./CategoryPie'));
const BalanceTrend = lazy(() => import('./BalanceTrend'));
const Insights = lazy(() => import('./Insights'));

export default function Dashboard() {
  const [view, setView] = useState('overview');

  return (
    <div className="dashboard layout">
      <Navbar view={view} onChange={setView} />

      <div className="content">
        <div className="topbar">
          <h2>{view === 'overview' ? 'Overview' : view.charAt(0).toUpperCase() + view.slice(1)}</h2>
          <RoleSwitcher />
        </div>

        {view === 'overview' && (
          <>
            <SummaryCards />
            <div className="main-grid">
              <Suspense fallback={<div className="chart card"><div className="card-title">Loading chart…</div><div style={{padding:20}}>Loading</div></div>}>
                <CategoryPie />
              </Suspense>
              <Suspense fallback={<div className="chart card"><div className="card-title">Loading chart…</div><div style={{padding:20}}>Loading</div></div>}>
                <BalanceTrend />
              </Suspense>
            </div>
          </>
        )}

        {view === 'transactions' && (
          <div className="single-view">
            <Transactions />
          </div>
        )}

        {view === 'insights' && (
          <div className="single-view">
            <Suspense fallback={<div className="single-view"><div style={{padding:20}}>Loading insights…</div></div>}>
              <Insights />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}
