
import React from 'react';
import { AlphaPitch } from '../types.ts';

interface AlphaPitchProps {
  alphaPitch: AlphaPitch;
  onChange: (newPitch: AlphaPitch) => void;
  userRole: 'labor' | 'finance' | 'sales';
}

const HEADLINE_MAX = 60;
const STRATEGY_MAX = 140;

const getRoleStyles = (role: 'labor' | 'finance' | 'sales') => {
    switch (role) {
        case 'labor': return { border: 'border-red-600', text: 'text-red-500', bar: 'bg-red-500', glow: 'shadow-red-900/40' };
        case 'finance': return { border: 'border-green-600', text: 'text-green-500', bar: 'bg-green-500', glow: 'shadow-green-900/40' };
        case 'sales': return { border: 'border-blue-600', text: 'text-blue-500', bar: 'bg-blue-500', glow: 'shadow-blue-900/40' };
        default: return { border: 'border-gray-600', text: 'text-gray-500', bar: 'bg-gray-500', glow: 'shadow-gray-900/40' };
    }
};

const CharacterCounter = ({ current, max, label, type }: { current: number, max: number, label: string, type: 'headline' | 'strategy' }) => {
    const percentage = (current / max) * 100;
    let colorClass = 'bg-green-500';
    if (percentage > 80) colorClass = 'bg-yellow-500';
    if (percentage > 100) colorClass = 'bg-red-500';

    return (
        <div className="flex flex-col gap-1 mt-1">
             <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500">
                 <span>{label}</span>
                 <span className={percentage > 100 ? 'text-red-500' : ''}>{current}/{max}</span>
             </div>
             <div className="h-1 w-full bg-gray-800 rounded overflow-hidden">
                 <div className={`h-full transition-all duration-300 ${colorClass}`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
             </div>
             {percentage > 100 && (
                 <span className="text-red-400 text-[10px] font-bold uppercase tracking-tighter animate-pulse mt-0.5">
                     {type === 'headline' ? "Too slow. Sharpen your blade." : "You're rambling. The pack stopped listening."}
                 </span>
             )}
        </div>
    );
};

export const AlphaPitchEditor: React.FC<AlphaPitchProps> = ({ alphaPitch, onChange, userRole }) => {
    const styles = getRoleStyles(userRole);

    const handleHeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...alphaPitch, headline: e.target.value });
    };

    const handleStrategyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange({ ...alphaPitch, strategy: e.target.value });
    };

    return (
        <div className="bg-gray-900 rounded-3xl border border-gray-700 shadow-2xl p-6 md:p-8 my-8">
            <h2 className="text-2xl font-bold text-white text-center mb-6 uppercase tracking-wider">Alpha Pitch</h2>
            
            <div className="flex flex-col md:flex-row gap-8">
                {/* LEFT: THE FORGE */}
                <div className="flex-1 space-y-6">
                    <h3 className="text-yellow-500 text-xs font-bold uppercase tracking-widest border-b border-gray-800 pb-2">The Forge (Input)</h3>
                    
                    <div>
                        <input 
                            type="text" 
                            value={alphaPitch.headline} 
                            onChange={handleHeadlineChange}
                            placeholder="Get X result for Y people..."
                            className="w-full bg-gray-800 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        />
                        <CharacterCounter current={alphaPitch.headline.length} max={HEADLINE_MAX} label="The Hook (Headline)" type="headline" />
                    </div>

                    <div>
                        <textarea 
                            value={alphaPitch.strategy} 
                            onChange={handleStrategyChange}
                            placeholder="Explaining the offer and specific outcome..."
                            rows={4}
                            className="w-full bg-gray-800 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                        />
                         <CharacterCounter current={alphaPitch.strategy.length} max={STRATEGY_MAX} label="The Strategy (Details)" type="strategy" />
                    </div>
                </div>

                {/* RIGHT: THE CARD (PREVIEW) */}
                <div className="flex-1 flex flex-col">
                     <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest border-b border-gray-800 pb-2 mb-6 text-right">The Card (Preview)</h3>
                     
                     <div className={`w-full max-w-sm mx-auto bg-gray-900 rounded-2xl border-2 shadow-2xl overflow-hidden relative flex flex-col ${styles.border} ${styles.glow}`}>
                        {/* Header */}
                        <div className="bg-black/40 p-3 flex justify-between items-center border-b border-gray-800">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider truncate">YOU</h2>
                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-lg bg-gray-800 ${styles.border}`}>
                                {userRole === 'labor' ? '🛠️' : userRole === 'finance' ? '💰' : '🤝'}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 bg-gray-800 flex-1 flex flex-col justify-center min-h-[200px]">
                            {/* Headline */}
                            <div className="mb-4">
                                <h4 className={`text-xl font-bold leading-tight ${styles.text} ${!alphaPitch.headline && 'opacity-30'}`}>
                                    "{alphaPitch.headline || "Your Hook Goes Here..."}"
                                </h4>
                            </div>
                            
                            {/* Strategy */}
                            <div className="border-t border-gray-700 pt-4">
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block mb-1">STRATEGY</span>
                                <p className={`text-sm text-gray-300 italic ${!alphaPitch.strategy && 'opacity-30'}`}>
                                    {alphaPitch.strategy || "Your strategy details will appear here..."}
                                </p>
                            </div>
                        </div>

                        {/* Footer Decoration */}
                        <div className="h-2 w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                     </div>
                </div>
            </div>
        </div>
    );
};
