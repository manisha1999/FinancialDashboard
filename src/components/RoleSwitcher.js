import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function RoleSwitcher() {
  const { role, setRole, theme, setTheme } = useAppContext();
  return (
    <div className="role-switcher">
      <label htmlFor="role">Role:</label>
      <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="viewer">Viewer</option>
        <option value="admin">Admin</option>
      </select>

      <label style={{ marginLeft: 12 }}>Theme:</label>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
