import React from 'react';

interface GhostBarProps {
    label: string;
    selfScore: number;
    publicScore: number;
    color: 'labor' | 'finance' | 'sales' | 'red' | 'green' | 'blue'; // Support both naming conventions
}

const GhostBar: React.FC<GhostBarProps> = ({ label, selfScore, publicScore, color }) => {
    const getColorClasses = (c: string) => {
        // Map legacy colors to new roles if needed, or handle direct role names
        if (c === 'red' || c === 'labor') return { bg: 'bg-labor', text: 'text-labor', border: 'border-labor', shadow: 'shadow-neon-red' };
        if (c === 'green' || c === 'finance') return { bg: 'bg-finance', text: 'text-finance', border: 'border-finance', shadow: 'shadow-neon-green' };
        if (c === 'blue' || c === 'sales') return { bg: 'bg-sales', text: 'text-sales', border: 'border-sales', shadow: 'shadow-neon-blue' };
        return { bg: 'bg-gray-600', text: 'text-gray-500', border: 'border-gray-600', shadow: 'shadow-none' };
    };

    const colors = getColorClasses(color);
    
    // Visual Tension: If Reality (Public) < Ego (Self), the gap pulsates
    const isUnderperforming = publicScore < selfScore;

    return (
        <div className="mb-4 font-mono">
            <div className="flex justify-between items-end mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${colors.text}`}>{label}</span>
                <div className="flex gap-2 text-[9px]">
                    <span className="text-gray-500">EGO: {selfScore}</span>
                    <span className="text-white">REALITY: {publicScore}</span>
                </div>
            </div>

            {/* Container */}
            <div className={`h-4 w-full bg-black border ${colors.border} rounded-sm relative overflow-hidden`}>
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzjwqheq4f///2eE8UEcgAAAE4QfwrWp3CgAAAAASUVORK5CYII=')] opacity-20 pointer-events-none"></div>

                {/* Self Score (The Ego - Ghost) */}
                <div
                    className="absolute top-0 left-0 h-full bg-white/10 border-r border-white/20"
                    style={{ width: `${selfScore}%` }}
                ></div>

                {/* Public Score (The Reality - Solid) */}
                <div
                    className={`absolute top-0 left-0 h-full ${colors.bg} ${colors.shadow} transition-all duration-500`}
                    style={{ width: `${publicScore}%` }}
                ></div>

                {/* Tension Zone (The Gap) */}
                {isUnderperforming && (
                    <div 
                        className="absolute top-0 h-full bg-red-500/20 animate-pulse"
                        style={{ 
                            left: `${publicScore}%`, 
                            width: `${selfScore - publicScore}%` 
                        }}
                    ></div>
                )}

                {/* Marker Line */}
                <div className="absolute top-0 bottom-0 w-px bg-white/50 z-10" style={{ left: `${publicScore}%` }}></div>
            </div>
        </div>
    );
};

export default GhostBar;
