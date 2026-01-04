import React from 'react';
import { Card } from '../types.ts';
import { SVG_ASSETS } from '../utils/svgAssets.ts';

interface WolfCardProps {
  card: Card;
  selected: boolean;
  onSelect: (id: string) => void;
  disabled: boolean;
}

export const WolfCard: React.FC<WolfCardProps> = ({ card, selected, onSelect, disabled }) => {
  // Use embedded SVG based on card type
  const imageUrl = SVG_ASSETS[card.type as keyof typeof SVG_ASSETS] || SVG_ASSETS.logo;

  return (
    <div
      onClick={() => !disabled && onSelect(card.id)}
      className={`
        relative cursor-pointer transition-all duration-300 transform group flex flex-col items-center justify-center p-8
        ${selected ? 'scale-105 ring-4 ring-yellow-500 shadow-2xl z-10 bg-gray-800' : 'hover:scale-105 hover:shadow-xl opacity-80 hover:opacity-100 bg-gray-900'}
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
        rounded-xl border border-gray-700 h-96 w-full
      `}
    >
      {/* Icon Container */}
      <div className="w-32 h-32 mb-6 p-4 bg-black/50 rounded-full border border-yellow-600/30 flex items-center justify-center">
        <img 
          src={imageUrl} 
          alt={card.name} 
          className="w-20 h-20 object-contain drop-shadow-lg"
          style={{ maxWidth: '80px', maxHeight: '80px', width: '100%', height: 'auto' }}
        />
      </div>

      {/* Text Content */}
      <div className="text-center z-10">
        <h3 className="text-2xl font-bold text-white mb-3 uppercase tracking-wider">{card.name}</h3>
        <p className="text-gray-400 text-sm font-medium italic px-4">"{card.description}"</p>
      </div>
      
      {/* Selection Indicator */}
      {selected && (
        <div className="absolute top-4 right-4 bg-yellow-500 text-black font-bold px-3 py-1 rounded-full shadow-lg text-xs uppercase tracking-widest animate-pulse">
          Selected
        </div>
      )}
    </div>
  );
};
