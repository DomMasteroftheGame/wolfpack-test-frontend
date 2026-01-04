import React from 'react';
import { ActivityLog } from '../types';

interface LiveTickerProps {
    logs?: ActivityLog[];
}

const LiveTicker: React.FC<LiveTickerProps> = ({ logs = [] }) => {
    // Default logs if none provided (for initial state)
    const displayLogs = logs.length > 0 ? logs : [
        { id: '1', wolfName: 'SYSTEM', action: 'WOLFPACK OS V.28.0 ONLINE', type: 'system', timestamp: new Date().toISOString() },
        { id: '2', wolfName: 'NETWORK', action: 'SCANNING SECTOR 7', type: 'system', timestamp: new Date().toISOString() }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[40] bg-black border-t border-wolf/20 h-8 flex items-center overflow-hidden pointer-events-none">
            <div className="bg-wolf text-black font-bold text-[9px] uppercase h-full px-3 flex items-center z-10 tracking-widest shrink-0 shadow-[0_0_15px_rgba(255,179,0,0.4)]">
                Live Feed
            </div>
            <div className="animate-marquee whitespace-nowrap flex gap-12 text-[10px] font-mono uppercase tracking-widest opacity-90 pl-4 items-center">
                {displayLogs.map((log) => (
                    <span key={log.id} className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${log.type === 'kill' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' :
                            log.type === 'doing' ? 'bg-blue-500' :
                                'bg-wolf'
                            }`}></span>
                        <span className="text-wolf font-bold">{log.wolfName}</span>
                        <span className="text-gray-400">{log.action} [ {new Date(log.timestamp).toLocaleTimeString()} ]</span>
                    </span>
                ))}

                {/* Duplicate for loop smoothness if list is short */}
                {displayLogs.length < 5 && displayLogs.map((log) => (
                    <span key={`dup-${log.id}`} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                        <span className="text-wolf font-bold">{log.wolfName}</span>
                        <span className="text-gray-400">{log.action} [ {new Date(log.timestamp).toLocaleTimeString()} ]</span>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default LiveTicker;
