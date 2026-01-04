import React, { useState, useEffect } from 'react';
import { Task, MatchProfile, ExecutionMethod } from '../../types';
import { GAME_BOARD, API_BASE_URL } from '../../constants';
import { getRoleConfig } from './utils';

interface TaskModalProps {
    taskId: number;
    userRole: 'labor' | 'finance' | 'sales' | null;
    currentTaskState: Task;
    wolfpack: MatchProfile[];
    onClose: () => void;
    onUpdate: (taskId: number, updates: Partial<Task>) => void;
    onGrind: (taskId: number) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ taskId, userRole, currentTaskState, wolfpack, onClose, onUpdate, onGrind }) => {
    const formatDeadline = (iso?: string) => {
        if (!iso) return '';
        const date = new Date(iso);
        const offset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - offset).toISOString().slice(0, 16);
    };

    const [scoutWolves, setScoutWolves] = useState<MatchProfile[]>([]);
    const [actualCost, setActualCost] = useState(currentTaskState.actualCost || 0);
    const [budget, setBudget] = useState(currentTaskState.budget || 0);
    const [deadline, setDeadline] = useState(formatDeadline(currentTaskState.deadline));
    const [method, setMethod] = useState<ExecutionMethod>(currentTaskState.method || null);

    const staticData = GAME_BOARD.find(g => g.id === taskId);
    const isReadOnly = currentTaskState.status === 'done';

    const getRequiredRole = (phase: string): 'labor' | 'finance' | 'sales' => {
        if (phase === 'Build') return 'labor';
        if (phase === 'Measure') return 'finance';
        return 'sales';
    };

    const handleMethodChange = (newMethod: ExecutionMethod) => {
        if (isReadOnly) return;
        setMethod(newMethod);
        onUpdate(taskId, { method: newMethod });
    };

    const handleAssign = (wolf: MatchProfile) => {
        if (isReadOnly) return;
        onUpdate(taskId, { assignedTo: wolf.role });
    };

    useEffect(() => {
        if (currentTaskState.status === 'todo' && method === 'outsource' && staticData) {
            const requiredRole = getRequiredRole(staticData.phase);
            fetch(`${API_BASE_URL}/api/matches`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: userRole, targetRole: requiredRole })
            })
                .then(res => res.json())
                .then(data => {
                    const packIds = new Set(wolfpack.map(w => w.id));
                    const scouts = data.filter((w: MatchProfile) => !packIds.has(w.id));
                    setScoutWolves(scouts);
                })
                .catch(() => { });
        } else {
            setScoutWolves([]);
        }
    }, [method, currentTaskState.status, staticData, userRole, wolfpack]);

    if (!staticData) return null;

    const assignedRole = currentTaskState.assignedTo || getRequiredRole(staticData.phase);
    const roleConfig = getRoleConfig(assignedRole);
    const grindCount = currentTaskState.grindCount || 0;
    const requiredRole = getRequiredRole(staticData.phase);
    const packMatches = wolfpack.filter(w => w.role === requiredRole);

    const handleGrind = () => { if (!isReadOnly) onGrind(taskId); };
    const handleComplete = () => { onUpdate(taskId, { status: 'done', actualCost: actualCost }); onClose(); };
    const handleMetaUpdate = () => { if (!isReadOnly) onUpdate(taskId, { budget, actualCost, deadline: deadline ? new Date(deadline).toISOString() : undefined }); }

    const getRatioFeedback = () => {
        if (grindCount === 0) return "You haven't put in the work yet. Grind before you kill.";
        if (grindCount > 10) return "High Grind. Low Efficiency. The board notices you spinning wheels.";
        const efficiency = (1 / Math.max(1, grindCount)) * 100;
        return `Efficiency Ratio: ${!isNaN(efficiency) ? efficiency.toFixed(0) : '0'}%. Looking solid.`;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="bg-gray-900 border border-yellow-600 rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600"></div>
                <div className="p-6 overflow-y-auto">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-yellow-500 text-xs font-bold uppercase tracking-widest">{staticData.phase} Phase</span>
                            <h2 className="text-2xl font-bold text-white mt-1">{staticData.name}</h2>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-500 text-[10px] uppercase font-bold mb-2 block">Execution Method</label>
                        <div className="flex gap-2 flex-wrap">
                            {['build', 'buy', 'outsource', 'partner'].map(m => (
                                <button key={m} onClick={() => handleMethodChange(m as ExecutionMethod)} disabled={isReadOnly}
                                    className={`px-3 py-1.5 rounded text-xs font-bold uppercase border transition-colors ${method === m ? 'bg-yellow-600 text-black border-yellow-600' : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'} ${isReadOnly ? 'opacity-50' : ''}`}>
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    {method === 'outsource' && currentTaskState.status === 'todo' && !isReadOnly && (
                        <div className="mb-6 bg-gray-800/50 p-4 rounded-xl border border-gray-700 animate-in fade-in slide-in-from-top-2">
                            <h4 className="text-yellow-500 text-xs font-bold uppercase mb-3">Recommended Specialists ({requiredRole})</h4>
                            {[...packMatches, ...scoutWolves].length > 0 ? (
                                <div className="space-y-2">
                                    {[...packMatches, ...scoutWolves].map(wolf => {
                                        const wConfig = getRoleConfig(wolf.role);
                                        const isPack = packMatches.some(p => p.id === wolf.id);
                                        return (
                                            <div key={wolf.id} onClick={() => handleAssign(wolf)}
                                                className={`flex items-center gap-3 p-2 bg-gray-800 rounded border-2 cursor-pointer transition group ${wConfig.colors.border} ${wConfig.colors.hoverBorder} hover:bg-gray-700`}>
                                                <img src={wolf.avatar} alt={wolf.name} className={`w-8 h-8 rounded-full border ${wConfig.colors.border} ${!isPack ? 'grayscale group-hover:grayscale-0' : ''}`} />
                                                <div className="flex-1">
                                                    <div className={`text-sm font-bold flex items-center gap-2 ${wConfig.colors.text}`}>
                                                        {wolf.name}
                                                        {currentTaskState.assignedTo === wolf.role && <span className="text-white bg-green-600 px-1.5 rounded text-[10px] uppercase">Assigned</span>}
                                                        {isPack && <span className="text-gray-500 text-[10px] uppercase border border-gray-600 px-1 rounded">Pack</span>}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400">{wolf.tagline}</div>
                                                </div>
                                                <div className={`opacity-0 group-hover:opacity-100 text-xs font-bold uppercase ${wConfig.colors.text}`}>Assign</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-3 bg-gray-800/80 rounded border border-dashed border-gray-600 text-center">
                                    <p className="text-gray-500 text-xs italic">No specialists found for {requiredRole}. <br />Check the Coffee Corner.</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-black/40 p-3 rounded-lg border border-gray-800">
                        <div>
                            <label className="text-gray-500 text-[10px] uppercase font-bold mb-1 block">Set Deadline</label>
                            <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} onBlur={handleMetaUpdate} disabled={isReadOnly}
                                className={`bg-gray-900 border border-gray-700 rounded p-1 text-sm text-white w-full focus:border-yellow-500 outline-none [color-scheme:dark] ${isReadOnly ? 'opacity-50' : ''}`} />
                        </div>
                        <div>
                            <label className="text-gray-500 text-[10px] uppercase font-bold mb-1 block">Est. Budget ($)</label>
                            <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} onBlur={handleMetaUpdate} disabled={isReadOnly}
                                className={`bg-gray-900 border border-gray-700 rounded p-1 text-sm text-white w-full focus:border-yellow-500 outline-none ${isReadOnly ? 'opacity-50' : ''}`} />
                        </div>
                        <div>
                            <label className="text-gray-500 text-[10px] uppercase font-bold mb-1 block">Actual Cost ($)</label>
                            <input type="number" value={actualCost} onChange={(e) => setActualCost(Number(e.target.value))} onBlur={handleMetaUpdate} disabled={isReadOnly}
                                className={`bg-gray-900 border border-gray-700 rounded p-1 text-sm text-white w-full focus:border-yellow-500 outline-none ${isReadOnly ? 'opacity-50' : ''}`} />
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between mb-1"><label className="text-xs text-gray-500 uppercase font-bold">Assigned Wolf</label></div>
                            <div className={`p-4 rounded-xl border-2 flex items-center justify-between shadow-lg ${roleConfig.colors.bgActive} ${roleConfig.colors.border}`}>
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl filter drop-shadow-md">{roleConfig.icon}</div>
                                    <span className={`font-bold uppercase tracking-wider ${roleConfig.colors.text}`}>{roleConfig.label}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-bold uppercase tracking-widest text-sm">The Grind (Inputs)</h3>
                            <span className="text-yellow-500 font-mono text-xl">{grindCount}</span>
                        </div>
                        <p className="text-gray-400 text-xs mb-4 italic">"{getRatioFeedback()}"</p>
                        <div className="flex gap-3">
                            <button onClick={handleGrind} disabled={isReadOnly}
                                className={`flex-1 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white font-bold py-3 rounded-lg transition active:scale-95 flex items-center justify-center gap-2 ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <span>⚡</span> {roleConfig.grindAction} (+1)
                            </button>
                        </div>
                    </div>

                    {currentTaskState.status !== 'done' && (
                        <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
                            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-4">The Kill (Result)</h3>
                            <button onClick={handleComplete}
                                className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg uppercase tracking-wider shadow-lg flex items-center justify-center gap-2">
                                <span>🏆</span> Mark Complete
                            </button>
                        </div>
                    )}

                    {currentTaskState.status === 'done' && (
                        <div className="bg-green-900/20 border border-green-600/50 p-4 rounded-xl text-center mb-6">
                            <h3 className="text-green-500 font-bold uppercase mb-2">Task Completed</h3>
                            <div className="flex justify-center gap-8 text-xs text-gray-300">
                                <div><span className="block text-gray-500 font-bold uppercase">Budget</span><span className="font-mono text-white text-lg">${currentTaskState.budget || 0}</span></div>
                                <div><span className="block text-gray-500 font-bold uppercase">Actual</span><span className={`font-mono text-lg ${currentTaskState.actualCost && currentTaskState.budget && currentTaskState.actualCost > currentTaskState.budget ? 'text-red-400' : 'text-green-400'}`}>${currentTaskState.actualCost || 0}</span></div>
                            </div>
                        </div>
                    )}

                    <button onClick={onClose} className="w-full bg-transparent text-gray-500 hover:text-white text-sm">Dismiss</button>
                </div>
            </div>
        </div>
    );
};
