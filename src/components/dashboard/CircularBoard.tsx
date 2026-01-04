import React from 'react';
import { User } from '../../types';
import { GAME_BOARD } from '../../constants';

// --- COMPONENT: CIRCULAR GAME BOARD ---
export const CircularBoard = ({ user, onSelectTask }: { user: User, onSelectTask: (id: number) => void }) => {
    // 40 tasks in a circle
    const radius = 150;
    const center = 180; // container size / 2

    return (
        <div className="relative w-[360px] h-[360px] mx-auto animate-in zoom-in-50 duration-700">
            {/* Center Hub */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gray-900 border-4 border-yellow-600 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.3)] z-10">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Valuation</span>
                <span className="text-2xl font-mono text-white font-bold">${user.ivp.toLocaleString()}</span>
                <div className={`mt-1 text-[10px] px-2 py-0.5 rounded font-bold uppercase ${user.pace === 'run' ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                    {user.pace} Pace
                </div>
            </div>

            {/* Orbit Rings */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-gray-800 opacity-50 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-gray-800 opacity-50 pointer-events-none"></div>

            {/* Game Nodes */}
            {GAME_BOARD.map((task, index) => {
                // Calculate position on circle
                const angle = (index / 40) * 360 - 90; // Start at top
                const angleRad = (angle * Math.PI) / 180;
                const x = center + radius * Math.cos(angleRad);
                const y = center + radius * Math.sin(angleRad);

                const userTask = user.tasks.find(t => t.id === task.id);
                const status = userTask?.status || 'todo';
                const assigned = !!userTask?.assignedTo;
                const heat = userTask?.heat || 0; // The "Grind" level

                let bgColor = 'bg-gray-800';
                let borderColor = 'border-gray-700';
                let animation = '';

                if (status === 'done') {
                    bgColor = 'bg-green-600';
                    borderColor = 'border-green-400';
                } else if (status === 'doing') {
                    bgColor = 'bg-blue-600';
                    borderColor = 'border-blue-400';
                    if (heat > 50) {
                        // High heat warning (grinding without killing)
                        bgColor = 'bg-red-600';
                        borderColor = 'border-red-400';
                        animation = 'animate-pulse';
                    }
                } else if (assigned) {
                    bgColor = 'bg-gray-700';
                    borderColor = 'border-yellow-600';
                }

                return (
                    <div
                        key={task.id}
                        onClick={() => onSelectTask(task.id)}
                        style={{ left: `${x}px`, top: `${y}px` }}
                        className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 ${bgColor} ${borderColor} ${animation} cursor-pointer hover:scale-150 transition-transform shadow-lg z-20 flex items-center justify-center group`}
                    >
                        {status === 'done' && <span className="text-[8px]">✓</span>}
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/90 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-gray-700 z-50">
                            #{task.id} {task.name}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
