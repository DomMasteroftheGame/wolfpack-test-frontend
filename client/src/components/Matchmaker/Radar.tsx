import React, { useEffect, useState } from 'react';

interface Wolf {
  _id: string;
  profile: {
    name: string;
    role: 'labor' | 'finance' | 'sales';
    location: { geo: [number, number] };
  };
  stats: { ivp: number };
}

const Radar = () => {
  const [wolves, setWolves] = useState<Wolf[]>([]);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    // Mock Fetch - In real app, fetch from /api/matchmaker/radar
    // For now, we simulate the API response with the Ghost Wolves logic
    const fetchWolves = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData: Wolf[] = [
        { _id: '1', profile: { name: 'Ghost Builder', role: 'labor', location: { geo: [0.01, 0.01] } }, stats: { ivp: 500 } },
        { _id: '2', profile: { name: 'Ghost VC', role: 'finance', location: { geo: [-0.015, 0.02] } }, stats: { ivp: 1200 } },
        { _id: '3', profile: { name: 'Ghost Sales', role: 'sales', location: { geo: [0.005, -0.01] } }, stats: { ivp: 800 } },
        { _id: '4', profile: { name: 'Shadow Dev', role: 'labor', location: { geo: [-0.02, -0.02] } }, stats: { ivp: 650 } },
      ];
      setWolves(mockData);
      setScanning(false);
    };

    fetchWolves();
  }, []);

  // Helper to map relative coordinates to CSS %
  // Assuming a 50km radius map. 0.01 deg approx 1.1km.
  // We scale it up for visual effect.
  const mapToPosition = (geo: [number, number]) => {
    const scale = 2000; // Zoom factor
    const x = 50 + (geo[0] * scale);
    const y = 50 - (geo[1] * scale); // Invert Y for CSS
    return { left: `${x}%`, top: `${y}%` };
  };

  return (
    <div className="relative w-full max-w-md aspect-square bg-black rounded-full border-4 border-[#333] shadow-[0_0_50px_rgba(0,255,0,0.1)] overflow-hidden mx-auto">
      {/* Grid Lines */}
      <div className="absolute inset-0 border border-[#333] rounded-full scale-75 opacity-50"></div>
      <div className="absolute inset-0 border border-[#333] rounded-full scale-50 opacity-50"></div>
      <div className="absolute inset-0 border border-[#333] rounded-full scale-25 opacity-50"></div>
      
      {/* Crosshairs */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-[1px] bg-[#333]"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-full w-[1px] bg-[#333]"></div>
      </div>

      {/* Scanner Animation */}
      <div className="absolute inset-0 rounded-full border-t-2 border-[#FFD700] opacity-50 animate-spin [animation-duration:4s]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/20 to-transparent"></div>
      </div>

      {/* Center (User) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_white] z-20"></div>

      {/* Blips */}
      {wolves.map(wolf => {
        const pos = mapToPosition(wolf.profile.location.geo);
        const color = wolf.profile.role === 'labor' ? 'bg-blue-500' : wolf.profile.role === 'finance' ? 'bg-green-500' : 'bg-purple-500';
        
        return (
          <div 
            key={wolf._id}
            className={`absolute w-3 h-3 ${color} rounded-full shadow-[0_0_10px_currentColor] cursor-pointer hover:scale-150 transition-transform z-10 group`}
            style={pos}
          >
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-[#1a1a1a] border border-[#333] p-2 rounded hidden group-hover:block z-30">
              <p className="text-white text-xs font-bold">{wolf.profile.name}</p>
              <p className="text-gray-400 text-[10px] uppercase">{wolf.profile.role}</p>
              <p className="text-[#FFD700] text-[10px]">IVP: {wolf.stats.ivp}</p>
            </div>
          </div>
        );
      })}

      {/* Status Text */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-[#FFD700] text-xs font-mono uppercase tracking-widest animate-pulse">
          {scanning ? 'SCANNING SECTOR...' : `${wolves.length} SIGNALS DETECTED`}
        </p>
      </div>
    </div>
  );
};

export default Radar;
