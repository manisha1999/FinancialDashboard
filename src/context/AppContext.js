import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import mockTransactions from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [role, setRole] = useState('viewer');
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'light';
    } catch (e) {
      return 'light';
    }
  });
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('transactions');
      return saved ? JSON.parse(saved) : mockTransactions;
    } catch (e) {
      return mockTransactions;
    }
  });
  const [filters, setFilters] = useState(() => {
    try {
      const saved = localStorage.getItem('filters');
      return saved ? JSON.parse(saved) : { q: '', type: 'all' };
    } catch (e) {
      return { q: '', type: 'all' };
    }
  });

  // persist transactions to localStorage — debounced to avoid IO spikes
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem('transactions', JSON.stringify(transactions));
      } catch (e) {}
    }, 300);
    return () => clearTimeout(id);
  }, [transactions]);

  // persist role and theme immediately
  useEffect(() => {
    try {
      localStorage.setItem('role', role);
    } catch (e) {}
  }, [role]);

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {}
    // apply theme class to document root
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  // persist filters (debounced)
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem('filters', JSON.stringify(filters));
      } catch (e) {}
    }, 250);
    return () => clearTimeout(id);
  }, [filters]);

  const addTransaction = useCallback((tx) => {
    setTransactions((t) => [{ ...tx, id: Date.now() }, ...t]);
  }, []);

  const editTransaction = useCallback((id, patch) => {
    setTransactions((t) => t.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((t) => t.filter((x) => x.id !== id));
  }, []);

  
  // Derived selectors (memoized) to avoid repeating heavy computations in many components
  const categoriesSummary = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const k = t.category || 'Misc';
      map[k] = (map[k] || 0) + Math.abs(Number(t.amount) || 0);
    });
    return Object.keys(map)
      .map((k) => ({ name: k, value: Math.round(map[k] * 100) / 100 }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const monthlyAggregates = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const m = new Date(t.date).toISOString().slice(0, 7);
      if (!map[m]) map[m] = { income: 0, expense: 0, net: 0 };
      const amt = Number(t.amount) || 0;
      const isIncome = t.type === 'income' || amt > 0;
      if (isIncome) map[m].income += Math.abs(amt);
      else map[m].expense += Math.abs(amt);
      map[m].net += amt;
    });
    return Object.keys(map)
      .sort()
      .map((k) => {
        const dt = new Date(k + '-01');
        return {
          month: k,
          label: dt.toLocaleString('en-IN', { month: 'short', year: 'numeric' }),
          income: Math.round(map[k].income * 100) / 100,
          expense: Math.round(map[k].expense * 100) / 100,
          net: Math.round(map[k].net * 100) / 100
        };
      });
  }, [transactions]);

  const totalIncome = useMemo(() => transactions.reduce((s, t) => s + (t.type === 'income' || t.amount > 0 ? Math.abs(Number(t.amount) || 0) : 0), 0), [transactions]);
  const totalExpenses = useMemo(() => transactions.reduce((s, t) => s + (t.type === 'expense' || t.amount < 0 ? Math.abs(Number(t.amount) || 0) : 0), 0), [transactions]);
  const totalBalance = useMemo(() => transactions.reduce((s, t) => s + Number(t.amount || 0), 0), [transactions]);

  const value = useMemo(
    () => ({
      role,
      setRole,
      theme,
      setTheme,
      transactions,
      addTransaction,
      editTransaction,
      deleteTransaction,
      filters,
      setFilters,
      // selectors
      categoriesSummary,
      monthlyAggregates,
      totalIncome,
      totalExpenses,
      totalBalance,
      // (no sync utility)
    }),
    [
      role,
      setRole,
      theme,
      setTheme,
      transactions,
      addTransaction,
      editTransaction,
      deleteTransaction,
      filters,
      setFilters,
      categoriesSummary,
      monthlyAggregates,
      totalIncome,
      totalExpenses,
      totalBalance,
      // (no sync utility)
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
