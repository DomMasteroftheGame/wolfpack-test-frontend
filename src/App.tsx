import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import CardSelection from './pages/CardSelection.tsx';
import StartupSelection from './pages/StartupSelection.tsx';
import KanbanBoard from './components/KanbanBoard.tsx';
import InstallPrompt from './components/InstallPrompt.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <InstallPrompt />
      <Routes>
        <Route path="/" element={<Navigate to="/select-startup" />} />
        <Route path="/select-card" element={<CardSelection />} />
        <Route path="/select-startup" element={<StartupSelection />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kanban" element={<KanbanBoard />} />
      </Routes>
    </Router>
  );
};

export default App;
