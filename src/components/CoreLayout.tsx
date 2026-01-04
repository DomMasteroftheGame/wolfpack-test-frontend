import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ActivityLog, ViewMode } from '../types';
import { AlphaPitchEditor } from './AlphaPitch';

interface CoreLayoutProps {
    user: User;
    view: ViewMode;
    setView: (view: ViewMode) => void;
    activityLogs: ActivityLog[];
    onUpdateUser: (user: User) => void;
    children: React.ReactNode;
}

const getRoleConfig = (role: string | null | undefined) => {
    switch (role) {
        case 'labor': return { label: 'The Builder', icon: '🛠️', colors: { text: 'text-red-500', border: 'border-red-600' } };
        case 'finance': return { label: 'The Capital', icon: '💰', colors: { text: 'text-green-500', border: 'border-green-600' } };
        case 'sales': return { label: 'The Connector', icon: '🤝', colors: { text: 'text-blue-500', border: 'border-blue-600' } };
        default: return { label: 'Unassigned', icon: '❓', colors: { text: 'text-gray-500', border: 'border-gray-600' } };
    }
};

const LiveTicker = ({ logs }: { logs: ActivityLog[] }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 h-8 bg-black/90 border-t border-yellow-600/30 flex items-center overflow-hidden z-[40]">
            <div className="flex items-center px-4 shrink-0 bg-yellow-600 text-black font-bold text-[10px] uppercase h-full tracking-widest z-10">Live Feed</div>
            <div className="flex items-center gap-8 animate-marquee whitespace-nowrap pl-4 text-xs font-mono">
                {logs?.length > 0 ? logs.map((log) => (
                    <span key={log.id} className="text-gray-400">
                        <span className="text-yellow-500 font-bold">{log.wolfName}</span> {log.action} <span className="text-gray-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    </span>
                )) : <span className="text-gray-600 italic">Connecting to Wolfpack Network...</span>}
            </div>
        </div>
    );
};

export const CoreLayout: React.FC<CoreLayoutProps> = ({ user, view, setView, activityLogs, onUpdateUser, children }) => {
    const roleConfig = getRoleConfig(user.selected_card_id as any);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500/30 overflow-hidden flex flex-col">
            
            {/* TOP NAV */}
            <header className="h-16 border-b border-gray-800 bg-gray-950 flex items-center justify-between px-4 md:px-6 shrink-0 z-30">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center font-bold text-black text-xl shadow-[0_0_15px_rgba(202,138,4,0.4)]">
                        W
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight leading-none">WOLFPACK <span className="text-yellow-600">OS</span></h1>
                        <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">v2.4.0 // {user.location || 'GLOBAL'}</div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* IVP SCORE */}
                    <div className="hidden md:flex flex-col items-end">
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Intrinsic Value</div>
                        <div className="text-2xl font-bold text-yellow-500 font-mono leading-none">{user.ivp.toLocaleString()} <span className="text-xs text-gray-600">IVP</span></div>
                    </div>

                    {/* AVATAR */}
                    <div className="flex items-center gap-3 pl-6 border-l border-gray-800">
                        <div className="text-right hidden sm:block">
                            <div className="font-bold text-sm">{user.email.split('@')[0]}</div>
                            <div className={`text-[10px] uppercase font-bold tracking-widest ${roleConfig.colors.text}`}>{roleConfig.label}</div>
                        </div>
                        <div className={`w-10 h-10 rounded-full border-2 ${roleConfig.colors.border} bg-gray-800 overflow-hidden`}>
                            <img src={`https://ui-avatars.com/api/?name=${user.email}&background=random`} alt="Profile" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                
                {/* SIDEBAR NAV */}
                <nav className="w-20 md:w-64 bg-gray-950 border-r border-gray-800 flex flex-col shrink-0 z-20">
                    <div className="p-4 space-y-2">
                        <button onClick={() => setView('radar')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${view === 'radar' ? 'bg-yellow-600 text-black font-bold shadow-lg shadow-yellow-600/20' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}>
                            <span className="text-xl">📡</span>
                            <span className="hidden md:block text-sm uppercase tracking-wider">Wolf Search</span>
                        </button>
                        <button onClick={() => setView('pack')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${view === 'pack' ? 'bg-yellow-600 text-black font-bold shadow-lg shadow-yellow-600/20' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}>
                            <span className="text-xl">🎯</span>
                            <span className="hidden md:block text-sm uppercase tracking-wider">Gameboard</span>
                        </button>
                        <button onClick={() => setView('kanban')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${view === 'kanban' ? 'bg-yellow-600 text-black font-bold shadow-lg shadow-yellow-600/20' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}>
                            <span className="text-xl">📋</span>
                            <span className="hidden md:block text-sm uppercase tracking-wider">Kanban</span>
                        </button>
                        <button onClick={() => setView('roadmap')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${view === 'roadmap' ? 'bg-yellow-600 text-black font-bold shadow-lg shadow-yellow-600/20' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}>
                            <span className="text-xl">🗺️</span>
                            <span className="hidden md:block text-sm uppercase tracking-wider">Roadmap</span>
                        </button>
                        <button onClick={() => setView('coffee')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${view === 'coffee' ? 'bg-yellow-600 text-black font-bold shadow-lg shadow-yellow-600/20' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}>
                            <span className="text-xl">☕</span>
                            <span className="hidden md:block text-sm uppercase tracking-wider">Coffee Dates</span>
                        </button>
                    </div>

                    <div className="mt-auto p-4 border-t border-gray-800">
                        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                            <div className="text-[10px] text-gray-500 uppercase font-bold mb-2">My Alpha Pitch</div>
                            <AlphaPitchEditor 
                                initialPitch={user.alphaPitch || { headline: "I'm building the future.", strategy: "Stealth mode." }} 
                                onSave={(pitch) => {
                                    const updated = { ...user, alphaPitch: pitch };
                                    onUpdateUser(updated);
                                }}
                            />
                        </div>
                    </div>
                </nav>

                {/* MAIN CONTENT AREA */}
                <div className="flex-1 relative bg-black overflow-hidden flex flex-col">
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

                    {/* SCROLLABLE CONTAINER */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar touch-pan-y p-4 md:p-8 relative z-10">
                        {children}
                    </div>
                </div>

            </main>

            <LiveTicker logs={activityLogs} />
        </div>
    );
};
