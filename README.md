# Financial Dashboard

A small React-based personal finance dashboard built with Create React App and Recharts. It provides an overview of transactions, category breakdowns, monthly aggregates, simple analytics (top spending category, saving rate, average monthly expense), and transaction management with filtering, grouping and export.

This repository is a workspace for a coding exercise / assignment and includes lightweight state persistence to localStorage.

---

## Features
- Transactions list: add, edit, delete (admin role required for modifications)
- Filters: search, date range, type (income/expense), sort
- Grouping: aggregate transactions by category or month
- Export: CSV and JSON export of filtered transactions
- Charts: category pie chart and monthly income/expense trend (Recharts)
- Insights: top spending category, saving rate, average monthly expense
- Theme: light/dark toggle (persisted in localStorage)
- Mobile-friendly sidebar with responsive layout

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

3. Create production build

```bash
npm run build
```

4. Run tests

```bash
npm test
```

## Project structure (important files)
- `src/` - React source code
  - `components/` - UI components (Dashboard, Navbar, Transactions, Charts, etc.)
  - `context/AppContext.js` - central app state, selectors, and persistence
  - `utils/` - helper utilities (export, format)
  - `data/mockData.js` - sample transaction seed data
- `public/` - static html and manifest

## Theme
The app stores the selected theme in `localStorage.theme`. Changing the Theme select (top-right) toggles the `dark` class on the document root and applies the dark-mode CSS overrides.

## Notes for developers
- The app uses React functional components and hooks. State is provided using a single `AppContext` to keep the example compact.
- Derived data (categories summary, monthly aggregates, totals) are memoized in `AppContext` to avoid recomputation across components.
- Charts are implemented with `recharts` and are responsive.
- Transactions are persisted to `localStorage` (debounced) so your changes survive reloads.

## Removing or restoring mock/sample data
- The app currently seeds transactions from `src/data/mockData.js` if no `localStorage.transactions` exists. To reset to the sample dataset, clear `localStorage.transactions` in your browser or remove it via the DevTools Application tab.

## Contributing / customizations
- To add or update categories, edit the mock data or the components that render category icons/labels.
- Consider moving CSS to CSS modules or styled-components if you need stricter scoping.

## License & contact
This project is provided as-is for the assignment. Contact the author via the repository owner on GitHub for questions.
# financialdashboard

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
