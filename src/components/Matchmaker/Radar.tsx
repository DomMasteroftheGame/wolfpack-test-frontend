import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';

// Mock Data for "Ghost Wolves"
const GHOST_WOLVES = [
    { id: 'ghost1', name: 'Alpha Ghost', wolfType: 'labor', coordinates: [-0.01, 0.01], ivp: 50 },
    { id: 'ghost2', name: 'Beta Phantom', wolfType: 'finance', coordinates: [0.02, -0.015], ivp: 120 },
    { id: 'ghost3', name: 'Gamma Spirit', wolfType: 'sales', coordinates: [-0.015, -0.02], ivp: 85 },
];

interface Wolf {
    id: string;
    name: string;
    wolfType: 'labor' | 'finance' | 'sales' | string;
    ivp: number;
    coordinates: number[]; // [long, lat]
    distance?: number;
}

const Radar: React.FC = () => {
    const { currentUser } = useAuth();
    const [nearbyWolves, setNearbyWolves] = useState<Wolf[]>([]);
    const [scanning, setScanning] = useState(true);

    useEffect(() => {
        const fetchNearby = async () => {
            // TODO: Replace with real API call when geolocation is wired up
            // const res = await fetch('/api/matchmaker/nearby?lat=...&long=...');
            // const data = await res.json();

            // Simulate API delay
            setTimeout(() => {
                setNearbyWolves(GHOST_WOLVES);
                setScanning(false);
            }, 2000);
        };

        fetchNearby();
    }, []);

    // Helper to map relative coordinates to % positions on the radar
    // Center is 50%, 50%
    // We assume a simple projection where 0.05 degrees ~= Max Radar Range
    const getPosition = (targetCoords: number[]) => {
        // Current user coords (mock for now if undefined)
        const myCoords = currentUser?.profile?.location?.geo?.coordinates || [0, 0];

        const deltaX = targetCoords[0] - myCoords[0]; // Longitude diff
        const deltaY = targetCoords[1] - myCoords[1]; // Latitude diff

        // Scale factor: how much delta equals full radar radius?
        const scale = 0.05;

        // Map -scale..+scale to 0..100%
        const x = 50 + ((deltaX / scale) * 50);
        const y = 50 - ((deltaY / scale) * 50); // Invert Y because CSS top is 0

        // Clamp to circle
        return { left: `${Math.max(10, Math.min(90, x))}%`, top: `${Math.max(10, Math.min(90, y))}%` };
    };

    const getWolfColor = (type: string) => {
        switch (type) {
            case 'labor': return 'bg-blue-500 shadow-[0_0_10px_#3b82f6]';
            case 'finance': return 'bg-green-500 shadow-[0_0_10px_#22c55e]';
            case 'sales': return 'bg-purple-500 shadow-[0_0_10px_#a855f7]';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="flex flex-col items-center bg-gray-900 p-4 rounded-xl border border-gray-800 w-full max-w-md mx-auto">
            <h2 className="text-xl font-bold text-gray-100 mb-4 tracking-wider uppercase">Wolfpack Radar</h2>

            {/* Radar Container */}
            <div className="relative w-72 h-72 md:w-96 md:h-96 bg-black rounded-full border-2 border-green-900 shadow-[0_0_20px_rgba(0,255,0,0.2)] overflow-hidden">

                {/* Grid Lines */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-1/2 w-full h-px bg-green-500 transform -translate-y-1/2"></div>
                    <div className="absolute left-1/2 h-full w-px bg-green-500 transform -translate-x-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 w-2/3 h-2/3 border border-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 w-1/3 h-1/3 border border-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                {/* Scanning Animation */}
                <div className="absolute inset-0 rounded-full border-t-2 border-green-500 opacity-50 animate-spin-slow origin-center pointer-events-none"
                    style={{ animationDuration: '4s' }}>
                    <div className="absolute top-0 left-1/2 w-1/2 h-1/2 bg-gradient-to-br from-green-500/20 to-transparent transform -translate-x-full origin-bottom-right rotate-45"></div>
                </div>

                {/* Center (Current User) */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_white] z-20"></div>

                {/* Blips */}
                {nearbyWolves.map(wolf => (
                    <div
                        key={wolf.id}
                        className={`absolute w-3 h-3 rounded-full cursor-pointer transition-transform hover:scale-150 z-10 ${getWolfColor(wolf.wolfType)}`}
                        style={getPosition(wolf.coordinates)}
                        title={`${wolf.name} (${wolf.wolfType.toUpperCase()}) - IVP: ${wolf.ivp}`}
                    >
                        {/* Tooltip on Hover */}
                        <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-gray-800 text-xs text-center text-white p-2 rounded border border-gray-600 z-30">
                            <span className="font-bold block">{wolf.name}</span>
                            <span className="opacity-75 capitalize">{wolf.wolfType}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 w-full grid grid-cols-3 gap-2 text-center text-xs text-gray-400">
                <div className="flex items-center justify-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Labor</div>
                <div className="flex items-center justify-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Finance</div>
                <div className="flex items-center justify-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Sales</div>
            </div>

            {scanning && <div className="mt-2 text-green-500 text-sm animate-pulse">Scanning Sector...</div>}
        </div>
    );
};

export default Radar;
