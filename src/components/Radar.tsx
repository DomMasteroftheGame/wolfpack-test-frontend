
import React, { useEffect, useState } from 'react';
import { MatchProfile, User } from '../types.ts';
import { API_BASE_URL } from '../constants.ts';

interface RadarProps {
    user: User;
    onSelectWolf: (wolf: MatchProfile) => void;
}

export const Radar: React.FC<RadarProps> = ({ user, onSelectWolf }) => {
    const [wolves, setWolves] = useState<MatchProfile[]>([]);
    const [scanning, setScanning] = useState(true);

    useEffect(() => {
        const fetchNearby = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/matchmaker/nearby`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user._id, radiusKm: 50 })
                });
                if (res.ok) {
                    const data = await res.json();
                    setWolves(data);
                }
            } catch (e) {
                console.error("Radar offline", e);
            }
        };

        const interval = setInterval(fetchNearby, 5000); // Scan every 5s
        fetchNearby();
        return () => clearInterval(interval);
    }, [user._id]);

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'labor': return 'bg-red-500 shadow-[0_0_10px_#ef4444]';
            case 'finance': return 'bg-green-500 shadow-[0_0_10px_#22c55e]';
            case 'sales': return 'bg-blue-500 shadow-[0_0_10px_#3b82f6]';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="flex flex-col items-center h-full">
            <h2 className="text-3xl font-bold text-white uppercase tracking-widest mb-2">Tactical Radar</h2>
            <p className="text-gray-400 text-xs mb-6 font-mono">SCANNING SECTOR: {user.location || "UNKNOWN"} // RANGE: 50KM</p>

            {/* RADAR DISPLAY */}
            <div className="relative w-[340px] h-[340px] md:w-[500px] md:h-[500px] bg-gray-950 rounded-full border-4 border-gray-800 shadow-2xl overflow-hidden group">
                {/* Grid Lines */}
                <div className="absolute inset-0 rounded-full border border-gray-800 scale-75 opacity-50"></div>
                <div className="absolute inset-0 rounded-full border border-gray-800 scale-50 opacity-50"></div>
                <div className="absolute inset-0 rounded-full border border-gray-800 scale-25 opacity-50"></div>
                <div className="absolute w-full h-[1px] bg-gray-800 top-1/2 left-0 opacity-50"></div>
                <div className="absolute h-full w-[1px] bg-gray-800 left-1/2 top-0 opacity-50"></div>

                {/* Scanner Animation */}
                <div className="absolute inset-0 rounded-full border-t-2 border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-transparent animate-spin-slow origin-center z-0"></div>

                {/* Center (You) */}
                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-white z-20"></div>

                {/* Blips */}
                {wolves.map((wolf) => {
                    const [relX, relY] = wolf.coordinates || [0, 0];
                    // Map relative coords (-1 to 1) to % positions (0% to 100%)
                    // Center is 50%, 50%
                    const left = 50 + (relX * 50);
                    const top = 50 + (relY * 50);

                    return (
                        <div
                            key={wolf.id}
                            style={{ left: `${left}%`, top: `${top}%` }}
                            className={`absolute w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-150 transition-transform z-10 ${getRoleColor(wolf.role)}`}
                            onClick={() => onSelectWolf(wolf)}
                        >
                            {/* Hover Tooltip */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] px-2 py-1 rounded border border-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                                {wolf.name} ({wolf.distance})
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Legend */}
            <div className="flex gap-4 mt-8">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-xs text-gray-400 uppercase">Labor</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-xs text-gray-400 uppercase">Capital</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-xs text-gray-400 uppercase">Sales</span></div>
            </div>
        </div>
    );
};
