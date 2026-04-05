# Financial Dashboard

A concise React-based personal finance dashboard demo built with Create React App and Recharts. It offers transaction management, category breakdowns, monthly aggregates, basic insights, and light/dark theming.

## Quick start

Requirements: Node.js (>=14), npm

1. Install dependencies

```bash
npm install
```

2. Run development server

```bash
npm start
```



## Features
- Transactions: add, edit, delete (admin role required for write actions)
- Filters: search, date range, type (income/expense), sort
- Grouping: aggregate by category or month
- Export: CSV and JSON for filtered results
- Charts: category pie and monthly income/expense trend (Recharts)
- Insights: top spending category, saving rate, avg monthly expense
- Theme: light/dark toggle (persisted)

## Project structure (high level)
- `src/` - application source
  - `components/` - UI components
  - `context/AppContext.js` - app state, selectors, persistence
  - `utils/` - helpers (export, format)
  - `data/mockData.js` - sample seed data
- `public/` - static files

## Developer notes
- State is provided via `AppContext`. Derived selectors are memoized to reduce work in child components.
- Transactions persist to `localStorage` (debounced). To reset sample data, clear `localStorage.transactions` in the browser.
- Dark mode is applied by toggling the `dark` class on the document root; styles live in `src/App.css`.

## License & contact
Provided as-is for the assignment. For questions, reach the repository owner on GitHub.

