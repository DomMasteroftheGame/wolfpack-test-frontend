import React from 'react';
import { useLocation } from 'wouter';

const CardSelection = () => {
  const [, setLocation] = useLocation();

  const handleSelect = (role: string) => {
    // Save role to local storage or state
    localStorage.setItem('wolf_role', role);
    setLocation('/mint-id'); // Next step: Mint ID
  };

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-[#FFD700] mb-2">CHOOSE YOUR PATH</h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        Your class defines your strengths in the Wolfpack. Choose wisely. This cannot be changed.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* LABOR */}
        <div 
          onClick={() => handleSelect('labor')}
          className="bg-[#1a1a1a] border border-[#333] hover:border-[#FFD700] p-6 rounded-xl cursor-pointer transition-all hover:scale-105 group"
        >
          <div className="text-5xl mb-4">🛠️</div>
          <h2 className="text-2xl font-bold text-white group-hover:text-[#FFD700]">LABOR</h2>
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">The Builder</p>
          <p className="text-gray-400 text-sm">
            You build the product. You turn vision into reality.
            <br/><br/>
            <span className="text-[#FFD700]">High Stat: BUILD</span>
          </p>
        </div>

        {/* FINANCE */}
        <div 
          onClick={() => handleSelect('finance')}
          className="bg-[#1a1a1a] border border-[#333] hover:border-[#FFD700] p-6 rounded-xl cursor-pointer transition-all hover:scale-105 group"
        >
          <div className="text-5xl mb-4">💰</div>
          <h2 className="text-2xl font-bold text-white group-hover:text-[#FFD700]">FINANCE</h2>
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">The Capital</p>
          <p className="text-gray-400 text-sm">
            You fund the mission. You allocate resources for scale.
            <br/><br/>
            <span className="text-[#FFD700]">High Stat: FUND</span>
          </p>
        </div>

        {/* SALES */}
        <div 
          onClick={() => handleSelect('sales')}
          className="bg-[#1a1a1a] border border-[#333] hover:border-[#FFD700] p-6 rounded-xl cursor-pointer transition-all hover:scale-105 group"
        >
          <div className="text-5xl mb-4">🤝</div>
          <h2 className="text-2xl font-bold text-white group-hover:text-[#FFD700]">SALES</h2>
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">The Connector</p>
          <p className="text-gray-400 text-sm">
            You sell the dream. You connect the pack to the world.
            <br/><br/>
            <span className="text-[#FFD700]">High Stat: CONNECT</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardSelection;
