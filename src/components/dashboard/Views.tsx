import React, { useState, useEffect } from 'react';
import { User, Task, MatchProfile, TaskStatus, AlphaPitch } from '../../types';
import { API_BASE_URL } from '../../constants';
// Adjusted import path for AlphaPitchEditor assuming it's in components/AlphaPitch.tsx 
// If components/AlphaPitch.tsx is default export or named export? I wrote it as named export.
import { AlphaPitchEditor } from '../AlphaPitch';
import { CircularBoard } from './CircularBoard';
import { KanbanBoard } from './KanbanBoard';

export const RoadmapView = ({ user, setSelectedTaskId, onTaskUpdate }: { user: User, setSelectedTaskId: (id: number) => void, onTaskUpdate: (id: number, updates: Partial<Task>) => void }) => {
    const [view, setView] = useState<'circular' | 'kanban'>('circular');

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white uppercase tracking-widest">Roadmap</h2>
                    <p className="text-gray-400 text-sm">Phase: {user.tasks.find(t => t.status === 'doing') ? 'Execution' : 'Planning'}</p>
                </div>
                <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
                    <button onClick={() => setView('circular')} className={`px-4 py-2 rounded text-xs font-bold uppercase ${view === 'circular' ? 'bg-yellow-600 text-black shadow' : 'text-gray-400 hover:text-white'}`}>Orbit</button>
                    <button onClick={() => setView('kanban')} className={`px-4 py-2 rounded text-xs font-bold uppercase ${view === 'kanban' ? 'bg-yellow-600 text-black shadow' : 'text-gray-400 hover:text-white'}`}>Kanban</button>
                </div>
            </div>

            <div className="flex-1 relative">
                {view === 'circular' ? (
                    <div className="flex items-center justify-center h-full overflow-hidden">
                        <CircularBoard user={user} onSelectTask={setSelectedTaskId} />
                    </div>
                ) : (
                    <KanbanBoard user={user} onSelectTask={setSelectedTaskId} onStatusChange={(id, status) => onTaskUpdate(id, { status })} />
                )}
            </div>
        </div>
    );
};

export const ScoutView = ({ user, onAdd }: { user: User, onAdd: (wolf: MatchProfile) => void }) => {
    const [roleFilter, setRoleFilter] = useState('');
    const [results, setResults] = useState<MatchProfile[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(`${API_BASE_URL}/api/matches`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id, role: user.selected_card_id, targetRole: roleFilter || undefined })
        })
            .then(res => res.json())
            .then(data => {
                const packIds = new Set(user.wolfpack.map(w => w.id));
                setResults(data.filter((w: MatchProfile) => !packIds.has(w.id)));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [roleFilter, user._id, user.selected_card_id, user.wolfpack]);

    return (
        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 h-full overflow-y-auto">
            <h3 className="text-white font-bold uppercase tracking-widest mb-4">Scout Talent</h3>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                {['', 'labor', 'finance', 'sales'].map(r => (
                    <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-1 rounded text-xs font-bold uppercase border whitespace-nowrap ${roleFilter === r ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                        {r || 'All Roles'}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 gap-3">
                {loading ? <div className="text-gray-500 text-sm animate-pulse">Scanning network...</div> : results.map(wolf => (
                    <div key={wolf.id} className="bg-gray-900 border border-gray-800 p-3 rounded-lg flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <img src={wolf.avatar} className="w-10 h-10 rounded-full" />
                            <div>
                                <h4 className="font-bold text-white text-sm">{wolf.name}</h4>
                                <span className="text-[10px] text-blue-400 font-bold uppercase">{wolf.role}</span>
                            </div>
                        </div>
                        <button onClick={() => onAdd(wolf)} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded font-bold uppercase text-[10px]">
                            + Add
                        </button>
                    </div>
                ))}
                {!loading && results.length === 0 && <div className="text-gray-500 text-sm italic p-4 text-center">No stray wolves found in this sector.</div>}
            </div>
        </div>
    );
};

export const PackView = ({ user, onUpdatePack, onSchedule, onSelectWolf }: { user: User, onUpdatePack: (pack: MatchProfile[]) => void, onSchedule: (wolf: MatchProfile) => void, onSelectWolf: (wolf: MatchProfile) => void }) => {
    return (
        <div className="h-full flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col">
                <h2 className="text-3xl font-bold text-white uppercase tracking-widest mb-6">The Pack</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 pb-4">
                    {user.wolfpack.map(wolf => (
                        <div key={wolf.id} onClick={() => onSelectWolf(wolf)} className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-yellow-500 cursor-pointer group transition-all relative">
                            <div className="flex items-center gap-4 mb-3">
                                <img src={wolf.avatar} className="w-12 h-12 rounded-full border-2 border-gray-600 group-hover:border-yellow-500 transition-colors" />
                                <div>
                                    <h3 className="font-bold text-white">{wolf.name}</h3>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">{wolf.role}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-300 italic mb-3 line-clamp-2">"{wolf.tagline}"</p>
                            <div className="flex justify-between items-center mt-auto">
                                <div className="flex gap-1 flex-wrap">
                                    {wolf.skills.slice(0, 2).map(s => <span key={s} className="text-[10px] bg-gray-700 px-1.5 py-0.5 rounded text-gray-300">{s}</span>)}
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); onSchedule(wolf); }} className="text-xs bg-gray-700 hover:bg-yellow-600 hover:text-black text-white px-2 py-1 rounded font-bold uppercase transition-colors z-10">
                                    ☕ Coffee
                                </button>
                            </div>
                        </div>
                    ))}
                    {user.wolfpack.length === 0 && <div className="text-gray-500 italic p-4 border border-dashed border-gray-700 rounded-xl">You are a lone wolf. Scout talent to build your pack.</div>}
                </div>
            </div>

            <div className="w-full md:w-80 shrink-0">
                <ScoutView user={user} onAdd={(wolf) => {
                    if (user.wolfpack.length >= 12) return alert("Pack Full");
                    onUpdatePack([...user.wolfpack, wolf]);
                }} />
            </div>
        </div>
    );
};

export const IntelView = ({ user }: { user: User }) => {
    return (
        <div className="h-full overflow-y-auto pb-8">
            <h2 className="text-3xl font-bold text-white uppercase tracking-widest mb-6">Intelligence</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 text-gray-700/20 text-9xl font-bold group-hover:text-yellow-600/10 transition-colors">$</div>
                    <h3 className="text-gray-500 text-xs font-bold uppercase mb-2 relative z-10">Valuation (IVP)</h3>
                    <div className="text-4xl font-mono font-bold text-yellow-500 relative z-10">${user.ivp.toLocaleString()}</div>
                    <div className="mt-2 text-xs text-green-400 flex items-center gap-1 relative z-10">
                        <span>▲</span> Projected Growth
                    </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 text-gray-700/20 text-9xl font-bold group-hover:text-red-600/10 transition-colors">🔥</div>
                    <h3 className="text-gray-500 text-xs font-bold uppercase mb-2 relative z-10">Burn Rate</h3>
                    <div className="text-4xl font-mono font-bold text-red-500 relative z-10">{user.pace === 'run' ? 'HIGH' : user.pace === 'walk' ? 'MED' : 'LOW'}</div>
                    <div className="mt-2 text-xs text-gray-400 relative z-10">Based on {user.pace} pace</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 text-gray-700/20 text-9xl font-bold group-hover:text-blue-600/10 transition-colors">⏳</div>
                    <h3 className="text-gray-500 text-xs font-bold uppercase mb-2 relative z-10">Runway</h3>
                    <div className="text-4xl font-mono font-bold text-blue-500 relative z-10">∞</div>
                    <div className="mt-2 text-xs text-gray-400 relative z-10">Bootstrapped Mode</div>
                </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 mb-8">
                <h3 className="text-white font-bold uppercase tracking-widest mb-6">Wolf Math (Efficiency)</h3>
                <div className="space-y-6">
                    {['labor', 'finance', 'sales'].map(role => {
                        const stats = user.roleHistory[role as 'labor' | 'finance' | 'sales'];
                        const label = role === 'labor' ? 'Build' : role === 'finance' ? 'Fund' : 'Connect';
                        const color = role === 'labor' ? 'bg-red-500' : role === 'finance' ? 'bg-green-500' : 'bg-blue-500';
                        const text = role === 'labor' ? 'text-red-500' : role === 'finance' ? 'text-green-500' : 'text-blue-500';
                        return (
                            <div key={role}>
                                <div className="flex justify-between text-xs font-bold text-gray-300 mb-2">
                                    <span className="uppercase tracking-wider">{label} Operations</span>
                                    <span className={text}>{stats.efficiency}% Efficiency</span>
                                </div>
                                <div className="h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
                                    <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${Math.min(stats.efficiency, 100)}%` }}></div>
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
                                    <span>Kills (Outputs): {stats.kill}</span>
                                    <span>Grinds (Inputs): {stats.grind}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export const ProfileView = ({ user, onUpdateProfile }: { user: User, onUpdateProfile: (u: User) => void }) => {
    const handlePitchChange = (newPitch: AlphaPitch) => {
        onUpdateProfile({ ...user, alphaPitch: newPitch });
        fetch(`${API_BASE_URL}/api/user/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id, alphaPitch: newPitch })
        }).catch(err => console.warn(err));
    };

    const handlePaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPace = e.target.value as any;
        onUpdateProfile({ ...user, pace: newPace });
        fetch(`${API_BASE_URL}/api/user/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id, pace: newPace })
        }).catch(err => console.warn(err));
    };

    return (
        <div className="h-full overflow-y-auto pb-20">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-8 flex flex-col md:flex-row items-center gap-6 shadow-xl">
                <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-full bg-gray-700 border-4 border-yellow-600 flex items-center justify-center text-3xl font-bold text-yellow-500 shadow-lg">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'W'}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-yellow-600 text-black text-[10px] font-bold px-2 py-1 rounded-full border-2 border-gray-900 uppercase tracking-wide">
                        LVL {Math.floor(user.ivp / 1000) + 1}
                    </div>
                </div>
                <div className="text-center md:text-left flex-1">
                    <h2 className="text-3xl font-bold text-white">{user.name || "Wolf"}</h2>
                    <p className={`font-bold uppercase text-sm mb-2 tracking-wider ${user.selected_card_id === 'labor' ? 'text-red-500' : user.selected_card_id === 'finance' ? 'text-green-500' : 'text-blue-500'}`}>
                        {user.selected_card_id === 'labor' ? 'The Builder' : user.selected_card_id === 'finance' ? 'The Capital' : 'The Connector'}
                    </p>
                    <p className="text-gray-400 italic text-sm">"{user.bio || 'Ready to hunt.'}"</p>
                </div>
                <div className="text-center md:text-right bg-black/20 p-4 rounded-xl border border-gray-700/50">
                    <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Location</div>
                    <div className="text-white font-mono text-sm">{user.location || "Unknown"}</div>
                </div>
            </div>

            <div className="mb-8">
                {user.alphaPitch && user.selected_card_id && (
                    <AlphaPitchEditor
                        alphaPitch={user.alphaPitch || { headline: '', strategy: '' }}
                        onChange={handlePitchChange}
                        userRole={user.selected_card_id as any}
                    />
                )}
            </div>

            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h3 className="text-white font-bold uppercase tracking-widest mb-6 border-b border-gray-700 pb-2">Global Settings</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-900 rounded-xl border border-gray-800">
                        <div>
                            <div className="text-white text-sm font-bold uppercase tracking-wide">Execution Pace</div>
                            <div className="text-gray-500 text-xs mt-1">Impacts burn rate and grind speed.</div>
                        </div>
                        <select
                            value={user.pace}
                            onChange={handlePaceChange}
                            className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg p-2 outline-none focus:border-yellow-500 transition-colors">
                            <option value="crawl">Crawl (Safe)</option>
                            <option value="walk">Walk (Steady)</option>
                            <option value="run">Run (High Burn)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};
