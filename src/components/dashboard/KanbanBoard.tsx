import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types/index';
import { GAME_BOARD } from '../../constants';
import { getRoleConfig } from './utils';

// --- COMPONENT: KANBAN BOARD (Drag & Drop) ---
interface KanbanBoardProps {
    tasks: Task[];
    onSelectTask: (id: string) => void;
    onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export const KanbanBoard = ({ tasks, onSelectTask, onStatusChange }: KanbanBoardProps) => {
    const [draggedId, setDraggedId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedId(id);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
        e.preventDefault();
        if (draggedId) {
            onStatusChange(draggedId, status);
            setDraggedId(null);
        }
    };

    const columns: { id: TaskStatus, label: string, color: string }[] = [
        { id: TaskStatus.TODO, label: 'To Do', color: 'border-l-4 border-gray-600' },
        { id: TaskStatus.IN_PROGRESS, label: 'The Grind', color: 'border-l-4 border-blue-500' },
        { id: TaskStatus.DONE, label: 'The Kill', color: 'border-l-4 border-green-500' }
    ];

    return (
        <div className="flex flex-col md:flex-row gap-4 min-h-[500px] md:h-[calc(100vh-180px)] md:overflow-hidden">
            {columns.map(col => (
                <div
                    key={col.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, col.id)}
                    className="flex-1 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 flex flex-col min-w-0 shadow-xl"
                >
                    <div className={`p-4 ${col.color} bg-gray-900/80 rounded-t-xl sticky top-0 z-10 flex justify-between items-center border-b border-gray-800`}>
                        <h3 className="font-bold uppercase tracking-widest text-sm text-gray-200">{col.label}</h3>
                        <span className="bg-black/50 border border-gray-700 text-gray-400 text-xs px-2 py-0.5 rounded font-mono">
                            {tasks.filter(t => t.status === col.id).length}
                        </span>
                    </div>

                    {/* On mobile, allow full height. On desktop, scroll internally. */}
                    <div className="p-3 space-y-3 flex-1 md:overflow-y-auto scrollbar-hide">
                        {tasks.filter(t => t.status === col.id).map(task => {
                            // Try to find static data, but fallback to task properties if not found (dynamic tasks)
                            const staticData = GAME_BOARD.find(g => g.id === parseInt(task.id)) || { name: task.title, phase: 'Ops' };
                            const roleConfig = task.assigned_to && task.assigned_to.length > 0 ? getRoleConfig(task.assigned_to[0]) : null;

                            // Parse 'pace' if it exists or use heat default
                            const heat = 0;

                            return (
                                <div
                                    key={task.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, task.id)}
                                    onClick={() => onSelectTask(task.id)}
                                    className={`bg-gray-800 p-3 rounded border border-gray-700 hover:border-yellow-500 cursor-grab active:cursor-grabbing transition shadow-lg group hover:bg-gray-750 relative overflow-hidden`}
                                >
                                    <div className="flex justify-between items-start mb-2 relative z-10">
                                        <span className="text-[10px] text-gray-500 font-bold bg-black/40 px-1.5 py-0.5 rounded border border-gray-700">#{task.step_number || '?'}</span>
                                        <span className={`text-[9px] uppercase font-bold tracking-wider ${staticData.phase === 'Build' ? 'text-red-400' : staticData.phase === 'Measure' ? 'text-green-400' : 'text-blue-400'}`}>{staticData.phase}</span>
                                    </div>

                                    <p className="text-sm font-bold text-gray-200 leading-tight group-hover:text-white mb-3 relative z-10">{task.title}</p>

                                    <div className="flex justify-between items-center relative z-10">
                                        <div className="flex-1"></div>
                                        {roleConfig && (
                                            <div className="text-lg opacity-80 group-hover:opacity-100" title={roleConfig.label}>{roleConfig.icon}</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {tasks.filter(t => t.status === col.id).length === 0 && (
                            <div className="h-24 md:h-full flex flex-col items-center justify-center opacity-30">
                                <span className="text-4xl mb-2 text-gray-600">⊕</span>
                                <span className="text-gray-500 text-xs italic font-bold uppercase tracking-widest">Empty Sector</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
