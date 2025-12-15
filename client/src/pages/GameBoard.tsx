import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

// Mock Data for Game Board Nodes
const NODES = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  label: `Task ${i + 1}`,
  phase: i < 10 ? 'Ideation' : i < 20 ? 'Build' : i < 30 ? 'Growth' : 'Scale'
}));

const GameBoard = () => {
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState<any>(null);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [grindCount, setGrindCount] = useState(0);
  const [killCount, setKillCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('wolf_profile');
    if (!saved) {
      setLocation('/');
      return;
    }
    setProfile(JSON.parse(saved));
  }, [setLocation]);

  const handleGrind = () => {
    setGrindCount(prev => prev + 1);
    // Visual feedback logic here
  };

  const handleKill = () => {
    setKillCount(prev => prev + 1);
    setActiveNode(null); // Close modal
    // Update stats logic
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#111] text-white overflow-hidden flex flex-col">
      {/* HUD */}
      <div className="bg-[#1a1a1a] border-b border-[#333] p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center text-xl">
            {profile.role === 'labor' ? '🛠️' : profile.role === 'finance' ? '💰' : '🤝'}
          </div>
          <div>
            <h2 className="font-bold text-white uppercase">{profile.name}</h2>
            <p className="text-xs text-[#FFD700] uppercase tracking-wider">IVP: {killCount * 100}</p>
          </div>
        </div>
        
        <div className="flex gap-6 text-sm font-mono">
          <div>
            <span className="text-gray-500 block text-[10px] uppercase">Grind</span>
            <span className="text-white font-bold">{grindCount}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] uppercase">Kills</span>
            <span className="text-white font-bold">{killCount}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] uppercase">Efficiency</span>
            <span className="text-[#FFD700] font-bold">
              {grindCount > 0 ? Math.round((killCount / grindCount) * 100) : 0}%
            </span>
          </div>
        </div>

        <button 
          onClick={() => setLocation('/coffee')}
          className="bg-[#333] hover:bg-[#444] text-white px-4 py-2 rounded text-xs font-bold uppercase"
        >
          Coffee Corner
        </button>
      </div>

      {/* BOARD AREA */}
      <div className="flex-1 relative overflow-auto p-8 flex items-center justify-center">
        <div className="relative w-[600px] h-[600px] border-4 border-[#333] rounded-full flex items-center justify-center">
          {/* Center Hub */}
          <div className="absolute text-center">
            <h3 className="text-2xl font-bold text-[#FFD700] uppercase tracking-widest">The Grind</h3>
            <p className="text-gray-500 text-xs mt-2">Phase: {activeNode ? NODES[activeNode-1].phase : 'Select Task'}</p>
          </div>

          {/* Nodes */}
          {NODES.map((node, i) => {
            const angle = (i / 40) * 2 * Math.PI;
            const radius = 290; // slightly less than container
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <div
                key={node.id}
                onClick={() => setActiveNode(node.id)}
                className={`absolute w-8 h-8 rounded-full border-2 cursor-pointer transition-all hover:scale-125 flex items-center justify-center text-[10px] font-bold
                  ${activeNode === node.id ? 'bg-[#FFD700] border-white text-black scale-125 z-10' : 'bg-[#1a1a1a] border-[#333] text-gray-500 hover:border-[#FFD700]'}
                `}
                style={{
                  transform: `translate(${x}px, ${y}px)`
                }}
              >
                {node.id}
              </div>
            );
          })}
        </div>
      </div>

      {/* TASK MODAL */}
      {activeNode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#FFD700] w-full max-w-md rounded-xl p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">TASK {activeNode}</h3>
                <p className="text-[#FFD700] text-xs uppercase tracking-widest">{NODES[activeNode-1].phase} Phase</p>
              </div>
              <button onClick={() => setActiveNode(null)} className="text-gray-500 hover:text-white">✕</button>
            </div>

            <div className="space-y-4 mb-8">
              <div className="bg-[#111] p-4 rounded border border-[#333]">
                <p className="text-gray-400 text-sm">
                  Execute the required actions to complete this milestone. 
                  Efficiency matters. Don't fake the work.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleGrind}
                className="bg-[#333] hover:bg-[#444] text-white py-4 rounded font-bold uppercase tracking-wider border border-transparent hover:border-gray-500"
              >
                Grind (+1)
              </button>
              <button 
                onClick={handleKill}
                className="bg-[#FFD700] hover:bg-yellow-400 text-black py-4 rounded font-bold uppercase tracking-wider"
              >
                Kill (Complete)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
