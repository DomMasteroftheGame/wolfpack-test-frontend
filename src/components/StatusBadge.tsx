import React from 'react';
import { TaskStatus } from '../types';

interface StatusBadgeProps {
    status: TaskStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const styles: Record<string, string> = {
        [TaskStatus.BACKLOG]: "bg-gray-800 text-gray-400 border-gray-700", // Todo/Backlog
        [TaskStatus.TODO]: "bg-gray-800 text-gray-400 border-gray-700",
        [TaskStatus.IN_PROGRESS]: "bg-blue-900/30 text-blue-400 border-blue-800 animate-pulse", // Doing
        [TaskStatus.DONE]: "bg-green-900/30 text-green-400 border-green-800", // Done
        // Default fallback
        'default': "bg-gray-800 text-gray-400 border-gray-700"
    };

    // Normalize status string just in case
    const statusKey = Object.keys(styles).includes(status) ? status : 'default';

    return (
        <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${styles[statusKey]}`}>
            {status.replace(/_/g, ' ')}
        </span>
    );
};
