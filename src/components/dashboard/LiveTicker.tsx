import React from 'react';
import { ActivityLog } from '../../types';

export const LiveTicker = ({ logs }: { logs: ActivityLog[] }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 h-8 bg-black/90 border-t border-yellow-600/30 flex items-center overflow-hidden z-[40]">
            <div className="flex items-center px-4 shrink-0 bg-yellow-600 text-black font-bold text-[10px] uppercase h-full tracking-widest z-10">
                Live Feed
            </div>
            <div className="flex items-center gap-8 animate-marquee whitespace-nowrap pl-4 text-xs font-mono">
                {logs.length > 0 ? logs.map((log) => (
                    <span key={log.id} className="text-gray-400">
                        <span className="text-yellow-500 font-bold">{log.wolfName}</span> {log.action} <span className="text-gray-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    </span>
                )) : <span className="text-gray-600 italic">Connecting to Wolfpack Network...</span>}
            </div>
        </div>
    );
};
