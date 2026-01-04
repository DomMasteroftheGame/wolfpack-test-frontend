import React from 'react';
import { MatchProfile } from '../types';
import { Shield, Star, Zap, MessageSquare, UserPlus, MapPin } from 'lucide-react';

interface WolfProfileCardProps {
    wolf: MatchProfile;
    viewMode: 'grid' | 'list';
    onSelect: (wolf: MatchProfile) => void;
    onMessage: (wolf: MatchProfile) => void;
}

const getRoleStyles = (role: string) => {
    switch (role) {
        case 'labor': return {
            border: 'border-labor',
            bg: 'bg-red-950/20',
            text: 'text-labor',
            badge: 'bg-labor/10 text-labor border-labor',
            glow: 'shadow-neon-red',
            btn: 'bg-labor hover:bg-red-600 text-black'
        };
        case 'finance': return {
            border: 'border-finance',
            bg: 'bg-green-950/20',
            text: 'text-finance',
            badge: 'bg-finance/10 text-finance border-finance',
            glow: 'shadow-neon-green',
            btn: 'bg-finance hover:bg-green-600 text-black'
        };
        case 'sales': return {
            border: 'border-sales',
            bg: 'bg-blue-950/20',
            text: 'text-sales',
            badge: 'bg-sales/10 text-sales border-sales',
            glow: 'shadow-neon-blue',
            btn: 'bg-sales hover:bg-blue-600 text-black'
        };
        default: return {
            border: 'border-gray-700',
            bg: 'bg-gray-900',
            text: 'text-gray-400',
            badge: 'bg-gray-800 text-gray-400 border-gray-700',
            glow: '',
            btn: 'bg-gray-600 hover:bg-gray-500 text-white'
        };
    }
};

export const WolfProfileCard: React.FC<WolfProfileCardProps> = ({ wolf, viewMode, onSelect, onMessage }) => {
    const styles = getRoleStyles(wolf.role);

    if (viewMode === 'list') {
        return (
            <div className={`flex items-center p-4 gap-4 bg-charcoal border ${styles.border} rounded-lg hover:bg-gray-800 transition-all group relative overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-${wolf.role === 'labor' ? 'red' : wolf.role === 'finance' ? 'green' : 'blue'}-900/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                
                <div className={`relative w-12 h-12 rounded overflow-hidden flex-shrink-0 border ${styles.border}`}>
                    <img src={wolf.avatar} alt={wolf.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-heading text-white truncate tracking-widest">{wolf.name}</h3>
                        <span className={`px-2 py-0.5 rounded-sm text-[10px] uppercase font-bold border ${styles.badge}`}>
                            {wolf.role === 'labor' ? 'Builder' : wolf.role === 'finance' ? 'Capital' : 'Connector'}
                        </span>
                    </div>
                    <p className="text-gray-400 text-xs truncate font-mono">{wolf.tagline}</p>
                </div>

                <div className="flex items-center gap-4 mr-4 font-mono">
                    <div className="text-center">
                        <div className="text-[10px] text-gray-500 uppercase">Trust</div>
                        <div className="text-sm font-bold text-gold">{wolf.ratings?.peer || '-'}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] text-gray-500 uppercase">Acc</div>
                        <div className="text-sm font-bold text-blue-400">{wolf.ratings?.accuracy || '-'}%</div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => onMessage(wolf)} className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors">
                        <MessageSquare className="w-4 h-4" />
                    </button>
                    <button onClick={() => onSelect(wolf)} className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors">
                        <UserPlus className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    }

    // GRID VIEW (Trading Card)
    return (
        <div className={`bg-charcoal border ${styles.border} rounded-lg overflow-hidden transition-all duration-300 group hover:transform hover:-translate-y-1 hover:shadow-2xl ${styles.glow} flex flex-col h-full relative`}>
            
            {/* Holographic Overlay Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-20 pointer-events-none z-10 transition-opacity"></div>

            {/* Header / Avatar */}
            <div className="relative h-40 bg-black border-b border-gray-800">
                <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-charcoal`} />
                <img src={wolf.avatar} alt={wolf.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                
                <div className="absolute top-3 right-3 z-20">
                    <span className={`px-2 py-1 rounded-sm text-[10px] uppercase font-bold border backdrop-blur-md ${styles.badge}`}>
                        {wolf.role === 'labor' ? 'Builder' : wolf.role === 'finance' ? 'Capital' : 'Connector'}
                    </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 z-20">
                    <h3 className="font-heading text-xl text-white truncate shadow-black drop-shadow-md tracking-widest">{wolf.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-300 font-mono">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        {wolf.location} <span className="text-gray-600">//</span> {wolf.distance}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-4 flex-1 flex flex-col relative z-20">
                <p className="text-gray-300 text-sm italic mb-4 line-clamp-2 min-h-[2.5rem] font-mono border-l-2 border-gray-700 pl-3">
                    "{wolf.tagline}"
                </p>

                {/* Stats Grid (HUD Style) */}
                <div className="grid grid-cols-3 gap-px bg-gray-800 border border-gray-700 rounded-sm overflow-hidden mb-4 font-mono">
                    <div className="bg-gray-900 p-2 text-center group/stat hover:bg-gray-800 transition-colors">
                        <div className="text-[10px] text-gray-500 uppercase mb-1 flex justify-center"><Shield className="w-3 h-3" /></div>
                        <div className="text-sm font-bold text-white">{wolf.ratings?.self || '-'}</div>
                        <div className="text-[9px] text-gray-600 uppercase">Self</div>
                    </div>
                    <div className="bg-gray-900 p-2 text-center group/stat hover:bg-gray-800 transition-colors border-l border-r border-gray-800">
                        <div className="text-[10px] text-gray-500 uppercase mb-1 flex justify-center"><Star className="w-3 h-3 text-gold" /></div>
                        <div className="text-sm font-bold text-gold">{wolf.ratings?.peer || '-'}</div>
                        <div className="text-[9px] text-gray-600 uppercase">Peer</div>
                    </div>
                    <div className="bg-gray-900 p-2 text-center group/stat hover:bg-gray-800 transition-colors">
                        <div className="text-[10px] text-gray-500 uppercase mb-1 flex justify-center"><Zap className="w-3 h-3 text-blue-600" /></div>
                        <div className="text-sm font-bold text-blue-400">{wolf.ratings?.accuracy || '-'}%</div>
                        <div className="text-[9px] text-gray-600 uppercase">Acc</div>
                    </div>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1 mb-4 flex-1 content-start font-mono">
                    {wolf.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-gray-800 text-gray-400 text-[10px] rounded-sm border border-gray-700 uppercase">
                            {skill}
                        </span>
                    ))}
                    {wolf.skills.length > 3 && <span className="px-2 py-0.5 text-gray-600 text-[10px]">+ {wolf.skills.length - 3}</span>}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 mt-auto font-heading tracking-widest">
                    <button 
                        onClick={() => onMessage(wolf)}
                        className="flex items-center justify-center gap-2 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold uppercase rounded-sm border border-gray-700 transition-colors"
                    >
                        <MessageSquare className="w-3 h-3" /> Comms
                    </button>
                    <button 
                        onClick={() => onSelect(wolf)}
                        className={`flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase rounded-sm transition-colors shadow-lg ${styles.btn}`}
                    >
                        <UserPlus className="w-3 h-3" /> Recruit
                    </button>
                </div>
            </div>
        </div>
    );
};
