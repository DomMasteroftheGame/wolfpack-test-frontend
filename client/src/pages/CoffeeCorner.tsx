import React, { useState } from 'react';
import { useLocation } from 'wouter';
import Radar from '../components/Matchmaker/Radar';

// Mock Profiles
const MOCK_WOLVES = [
  { id: 1, name: 'Sarah', role: 'finance', location: 'New York', skills: ['VC', 'Modeling'], tagline: 'Funding the next unicorn.' },
  { id: 2, name: 'David', role: 'labor', location: 'San Francisco', skills: ['Rust', 'AI'], tagline: 'Shipping code that matters.' },
  { id: 3, name: 'Elena', role: 'sales', location: 'London', skills: ['B2B', 'Strategy'], tagline: 'Connecting dots globally.' },
];

const CoffeeCorner = () => {
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<'swipe' | 'radar'>('swipe');
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentWolf = MOCK_WOLVES[currentIndex];

  const handleNext = () => {
    if (currentIndex < MOCK_WOLVES.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      alert("No more wolves in your area.");
    }
  };

  const handleConnect = () => {
    alert(`Invite sent to ${currentWolf.name}!`);
    handleNext();
  };

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-[#333]">
        <button onClick={() => setLocation('/game')} className="text-gray-400 hover:text-white">← Back</button>
        <h1 className="font-bold text-[#FFD700] uppercase tracking-widest">Coffee Corner</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setViewMode('swipe')}
            className={`p-2 rounded ${viewMode === 'swipe' ? 'text-[#FFD700]' : 'text-gray-500'}`}
          >
            🎴
          </button>
          <button 
            onClick={() => setViewMode('radar')}
            className={`p-2 rounded ${viewMode === 'radar' ? 'text-[#FFD700]' : 'text-gray-500'}`}
          >
            📡
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {viewMode === 'radar' ? (
          <div className="w-full max-w-md">
            <h2 className="text-center text-gray-500 text-xs uppercase tracking-widest mb-8">Tactical Overview</h2>
            <Radar />
            <p className="text-center text-gray-600 text-xs mt-8">
              Showing active signals within 50km radius.
            </p>
          </div>
        ) : (
          currentWolf ? (
            <div className="w-full max-w-sm bg-[#1a1a1a] border border-[#333] rounded-2xl overflow-hidden shadow-2xl relative">
              {/* Avatar Placeholder */}
              <div className="h-64 bg-[#222] flex items-center justify-center">
                <span className="text-6xl">
                  {currentWolf.role === 'labor' ? '🛠️' : currentWolf.role === 'finance' ? '💰' : '🤝'}
                </span>
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-white">{currentWolf.name}</h2>
                  <span className="bg-[#333] text-[#FFD700] text-xs px-2 py-1 rounded uppercase font-bold">
                    {currentWolf.role}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-4">{currentWolf.location}</p>
                
                <p className="text-gray-300 italic mb-6">"{currentWolf.tagline}"</p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {currentWolf.skills.map(skill => (
                    <span key={skill} className="bg-[#111] border border-[#333] text-gray-400 text-xs px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <button 
                    onClick={handleNext}
                    className="flex-1 py-3 rounded-xl border border-[#333] text-gray-400 hover:bg-[#222] font-bold uppercase"
                  >
                    Pass
                  </button>
                  <button 
                    onClick={handleConnect}
                    className="flex-1 py-3 rounded-xl bg-[#FFD700] text-black hover:bg-yellow-400 font-bold uppercase shadow-lg shadow-yellow-900/20"
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>You've seen everyone nearby.</p>
              <button onClick={() => setLocation('/game')} className="mt-4 text-[#FFD700] underline">Return to Grind</button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CoffeeCorner;
