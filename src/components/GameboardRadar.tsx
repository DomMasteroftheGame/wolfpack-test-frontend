import React from 'react';
import { Task } from '../types';

interface GameboardRadarProps {
    tasks: Task[];
}

export const GameboardRadar: React.FC<GameboardRadarProps> = ({ tasks }) => {
    // Create a 8x5 grid for 40 tasks
    const grid = Array.from({ length: 40 }, (_, i) => {
        const task = tasks[i];
        return {
            index: i + 1,
            task: task || null,
            status: task ? task.status : 'backlog'
        };
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'done': return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]';
            case 'doing': return 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] animate-pulse';
            case 'todo': return 'bg-gray-600';
            default: return 'bg-gray-800 opacity-50';
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest text-center">
                The Gameboard <span className="text-yellow-500">Radar</span>
            </h2>
            
            <div className="grid grid-cols-5 md:grid-cols-8 gap-2 md:gap-4">
                {grid.map((cell) => (
                    <div 
                        key={cell.index}
                        className={`aspect-square rounded-lg border border-gray-700 flex items-center justify-center relative group transition-all duration-300 hover:scale-105 ${getStatusColor(cell.status)}`}
                    >
                        <span className="text-xs md:text-sm font-bold text-white z-10">{cell.index}</span>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black border border-yellow-600 p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
                            <div className="text-[10px] text-yellow-500 uppercase font-bold">Task #{cell.index}</div>
                            <div className="text-xs text-white font-bold">{cell.task?.title || 'Locked'}</div>
                            {cell.task?.status === 'done' && <div className="text-[10px] text-green-400 mt-1">COMPLETED (+10 IVP)</div>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-800 border border-gray-700"></div>
                    <span className="text-xs text-gray-500 uppercase">Locked</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-600 border border-gray-500"></div>
                    <span className="text-xs text-gray-400 uppercase">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.6)]"></div>
                    <span className="text-xs text-blue-400 uppercase">Active</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.6)]"></div>
                    <span className="text-xs text-green-400 uppercase">Secured</span>
                </div>
            </div>
        </div>
    );
};
