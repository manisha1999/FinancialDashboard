import React from 'react';
import './App.css';
import { AppProvider } from './context/AppContext';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <AppProvider>
      <div className="App">
        <Dashboard />
      </div>
    </AppProvider>
  );
}

export default App;
