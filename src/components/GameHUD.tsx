import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAssetUrl } from '../utils/assets';
import { ViewMode } from '../types';

interface GameHUDProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({ currentView, onViewChange }) => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  // Map selected_card_id to classType logic (simplified for now)
  const classType = currentUser.classType || (currentUser.selected_card_id as any) || 'labor';

  // Dynamic Class Styling
  const getClassColor = (type: string) => {
    if (type === 'labor') return 'border-red-500 shadow-neon-red text-red-500';
    if (type === 'finance') return 'border-green-500 shadow-neon-green text-green-500';
    if (type === 'sales') return 'border-blue-500 shadow-neon-blue text-blue-500';
    return 'border-gray-500 text-gray-400';
  };

  const classColor = getClassColor(classType);
  const borderColor = classColor.split(' ')[0];
  const shadowColor = classColor.split(' ')[1];

  return (
    <div className="fixed top-0 left-0 w-full h-16 bg-void/90 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-between px-4 shadow-lg">
      
      {/* SECTION 1: WHO AM I? (The Identity Card) */}
      <div className={`flex items-center space-x-3 border p-1.5 rounded-lg bg-black/50 transition-all ${borderColor} ${shadowColor}`}>
        <div className="w-8 h-8 rounded overflow-hidden bg-gray-900">
             <img 
                src={getAssetUrl(`card_${classType}.png`)} 
                alt="My Class" 
                className="w-full h-full object-cover"
                onError={(e) => {
                    // Fallback to avatar if card image fails
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${currentUser.email}&background=random`;
                }}
            />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[8px] text-gray-400 font-mono uppercase tracking-widest mb-0.5">OPERATOR</span>
          <span className="text-white font-bold uppercase text-xs">{currentUser.name || currentUser.email.split('@')[0]}</span>
        </div>
      </div>

      {/* SECTION 2: THE RADAR (Navigation) */}
      <div className="hidden md:flex space-x-8 text-sm font-bold tracking-widest text-gray-500">
        <button 
            onClick={() => onViewChange('radar')}
            className={`transition-all hover:text-gold ${currentView === 'radar' ? 'text-white border-b-2 border-gold pb-1' : ''}`}
        >
            RADAR
        </button>
        <button 
            onClick={() => onViewChange('kanban')}
            className={`transition-all hover:text-gold ${currentView === 'kanban' ? 'text-white border-b-2 border-gold pb-1' : ''}`}
        >
            BOARD
        </button>
        <button 
            onClick={() => onViewChange('pack')}
            className={`transition-all hover:text-gold ${currentView === 'pack' ? 'text-white border-b-2 border-gold pb-1' : ''}`}
        >
            PACK
        </button>
      </div>

      {/* SECTION 3: RESOURCES */}
      <div className="flex items-center space-x-3 bg-black/50 px-3 py-1 rounded border border-gray-800">
        <div className="flex flex-col items-end leading-none">
            <span className="text-gold font-mono text-lg font-bold">{currentUser.ivp || 0}</span>
        </div>
        <span className="text-[10px] text-gray-500 font-mono tracking-widest">IVP</span>
      </div>
    </div>
  );
};
