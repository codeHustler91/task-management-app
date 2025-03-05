import React from 'react';
import { Link } from 'react-router-dom';

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Management</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Tasks</Link>
            </li>
            <li>
              <Link to="/create">Create Task</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <p>© 2025 Task Management App</p>
      </footer>
    </div>
  );
}