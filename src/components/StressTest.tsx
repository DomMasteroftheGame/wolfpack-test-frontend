import React, { useState } from 'react';

export const StressTest = () => {
    const [mode, setMode] = useState<'crawl' | 'walk' | 'run'>('walk');
    const [lastActive, setLastActive] = useState<Date>(new Date());
    const [nudgeStatus, setNudgeStatus] = useState<string>('Idle');

    const simulateTimeJump = (hours: number) => {
        const newTime = new Date(lastActive.getTime() - (hours * 60 * 60 * 1000));
        setLastActive(newTime);
        checkNudge(newTime);
    };

    const checkNudge = (simulatedLastActive: Date) => {
        const now = new Date();
        const diffHours = (now.getTime() - simulatedLastActive.getTime()) / (1000 * 60 * 60);

        if (mode === 'run' && diffHours > 24) {
            setNudgeStatus(`⚠️ HARDCORE NUDGE FIRED! User inactive for ${diffHours.toFixed(1)}h. Penalty applied.`);
        } else if (mode === 'walk' && diffHours > 72) {
            setNudgeStatus(`⚠️ STANDARD NUDGE FIRED! User inactive for ${diffHours.toFixed(1)}h.`);
        } else {
            setNudgeStatus('✅ User is safe. No nudge required.');
        }
    };

    return (
        <div className="p-4 bg-gray-900 border border-red-500/50 rounded-xl mb-4">
            <h3 className="text-red-500 font-bold uppercase mb-2">🧪 Stress Test: Nudge Logic</h3>
            
            <div className="flex gap-4 mb-4">
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 uppercase">Mode</label>
                    <select value={mode} onChange={(e) => setMode(e.target.value as any)} className="bg-gray-800 text-white p-1 rounded">
                        <option value="crawl">Crawl</option>
                        <option value="walk">Walk</option>
                        <option value="run">Run (Hardcore)</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 uppercase">Simulate Inactivity</label>
                    <div className="flex gap-2">
                        <button onClick={() => simulateTimeJump(12)} className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs">12h</button>
                        <button onClick={() => simulateTimeJump(25)} className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs">25h</button>
                        <button onClick={() => simulateTimeJump(73)} className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs">73h</button>
                    </div>
                </div>
            </div>

            <div className="bg-black p-2 rounded border border-gray-800 font-mono text-xs">
                <div>Current Mode: <span className="text-yellow-500">{mode.toUpperCase()}</span></div>
                <div>Last Active: {lastActive.toLocaleString()}</div>
                <div className="mt-2 font-bold">{nudgeStatus}</div>
            </div>
        </div>
    );
};
