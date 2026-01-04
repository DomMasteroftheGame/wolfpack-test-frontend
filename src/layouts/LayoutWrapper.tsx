import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CoreLayout from './CoreLayout';
import { ViewMode } from '../types';

export const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Map location to ViewMode
    const getViewFromPath = (path: string): ViewMode => {
        if (path.includes('radar')) return 'radar';
        if (path.includes('gameboard') || path.includes('leaderboard')) return 'pack';
        if (path.includes('dashboard')) return 'kanban';
        if (path.includes('roadmap')) return 'roadmap';
        if (path.includes('connections')) return 'coffee';
        return 'kanban'; // Default
    };

    const view = getViewFromPath(location.pathname);

    const setView = (v: ViewMode) => {
        switch (v) {
            case 'radar': navigate('/radar'); break;
            case 'pack': navigate('/gameboard'); break;
            case 'kanban': navigate('/dashboard'); break;
            case 'roadmap': navigate('/dashboard'); break; // Assuming Roadmap is part of dashboard for now or new page
            case 'coffee': navigate('/connections'); break;
            default: navigate('/dashboard');
        }
    };

    if (!currentUser) {
        return <div className="min-h-screen bg-black text-white p-10">Authenticating...</div>;
    }

    return (
        <CoreLayout
            user={currentUser}
            view={view}
            setView={setView}
            activityLogs={[]}
            onUpdateUser={(u) => console.log("User update requested:", u)}
        >
            {children}
        </CoreLayout>
    );
};
