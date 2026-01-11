import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { placesApi } from '../api';
import { MapPin, Coffee, ShieldCheck, Loader2 } from 'lucide-react';

const MintID = () => {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    location: '',
    skills: ''
  });
  const [scanning, setScanning] = useState(false);
  const [cafes, setCafes] = useState<any[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<any>(null);

  const handleScan = async () => {
    setScanning(true);
    try {
      // Mock location for now if geolocation fails or is blocked in this env
      // In prod, use navigator.geolocation
      const lat = 40.7128;
      const long = -74.0060;
      
      // Attempt real geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const data = await placesApi.getNearbyPlaces('', position.coords.latitude, position.coords.longitude);
              setCafes(data.length ? data : mockCafes);
            } catch (e) {
              console.error("API Error", e);
              setCafes(mockCafes);
            } finally {
              setScanning(false);
            }
          },
          (err) => {
            console.warn("Geolocation failed", err);
            setCafes(mockCafes); // Fallback
            setScanning(false);
          }
        );
      } else {
        setCafes(mockCafes);
        setScanning(false);
      }
    } catch (e) {
      setCafes(mockCafes);
      setScanning(false);
    }
  };

  const mockCafes = [
    { name: "Tactical Roast HQ", address: "Sector 7", verified: true },
    { name: "Midnight Oil Cafe", address: "Downtown", verified: true },
    { name: "Grind & Hustle", address: "Financial District", verified: false },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCafe) return;

    // Save to local storage
    const role = localStorage.getItem('wolf_role');
    const profile = {
      ...formData,
      location: selectedCafe.name, // Enforce cafe name as location
      homebase_id: selectedCafe.id || 'mock-id',
      role,
      skills: formData.skills.split(',').map(s => s.trim()),
      stats: { ivp: 0, efficiency: 0 }
    };
    localStorage.setItem('wolf_profile', JSON.stringify(profile));
    
    // Navigate to Game Board
    setLocation('/game');
  };

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col items-center justify-center p-4 font-mono">
      <div className="w-full max-w-md bg-[#1a1a1a] border border-[#333] p-8 rounded-xl shadow-2xl relative overflow-hidden">
        
        {/* Tactical Header */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-50"></div>
        
        <h1 className="text-3xl font-black text-[#FFD700] mb-2 text-center tracking-tighter uppercase">Mint Your ID</h1>
        <p className="text-gray-500 text-center mb-8 text-xs uppercase tracking-widest">Initialize Wolfpack Identity Protocol</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Codename</label>
            <input 
              required
              type="text" 
              className="w-full bg-[#0a0a0a] border border-[#333] rounded p-3 text-white focus:border-[#FFD700] outline-none transition-colors"
              placeholder="e.g. Maverick"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="bg-[#111] p-4 rounded border border-[#333] relative group">
            <label className="block text-[10px] font-bold text-[#FFD700] uppercase mb-3 tracking-wider flex items-center gap-2">
              <span className="text-lg">🚀</span>
              Startup Mission (The Idea)
            </label>
            
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
              Every Wolf needs a hunt. What are you building?
            </p>

            <textarea 
              required
              rows={3}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded p-3 text-white focus:border-[#FFD700] outline-none transition-colors font-mono text-xs"
              placeholder="e.g. A marketplace for tactical coffee gear using blockchain for supply chain verification."
              value={formData.tagline}
              onChange={e => setFormData({...formData, tagline: e.target.value})}
            />
            
            <button
              type="button"
              onClick={() => {
                const ideas = [
                  "Uber for Dog Walkers but with tactical gear.",
                  "AI-powered coffee subscription for hackers.",
                  "Decentralized social network for introverts.",
                  "SaaS platform for managing wolf packs."
                ];
                setFormData({...formData, tagline: ideas[Math.floor(Math.random() * ideas.length)]});
              }}
              className="mt-2 text-[10px] text-gray-500 hover:text-[#FFD700] underline uppercase tracking-wider"
            >
              Generate Random Mission
            </button>
          </div>

          {/* HOMEBASE SELECTION - CRITICAL UPDATE */}
          <div className="bg-[#111] p-4 rounded border border-[#333] relative group">
            <label className="block text-[10px] font-bold text-[#FFD700] uppercase mb-3 tracking-wider flex items-center gap-2">
              <Coffee size={14} />
              Homebase Selection (Required)
            </label>
            
            {!selectedCafe ? (
              <div className="space-y-3">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Wolfpack Protocol requires a public <strong>Coffee Shop</strong> as your operational base.
                </p>
                
                <button
                  type="button"
                  onClick={handleScan}
                  disabled={scanning}
                  className="w-full py-3 bg-[#222] border border-[#444] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#333] hover:border-[#FFD700] transition-all flex items-center justify-center gap-2"
                >
                  {scanning ? <Loader2 className="animate-spin" size={14} /> : <MapPin size={14} />}
                  {scanning ? "Scanning Sector..." : "Scan for Local Cafes"}
                </button>

                {cafes.length > 0 && (
                  <div className="mt-3 space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                    {cafes.map((cafe, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setSelectedCafe(cafe)}
                        className="p-2 bg-[#0a0a0a] border border-[#333] hover:border-[#FFD700] cursor-pointer flex justify-between items-center group/item"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{cafe.name}</div>
                          <div className="text-[10px] text-gray-500">{cafe.address}</div>
                        </div>
                        {cafe.verified && (
                          <ShieldCheck size={14} className="text-[#FFD700]" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#0a0a0a] p-3 border border-[#FFD700] flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-[#FFD700]">{selectedCafe.name}</div>
                  <div className="text-[10px] text-gray-500">{selectedCafe.address}</div>
                </div>
                <button 
                  type="button"
                  onClick={() => setSelectedCafe(null)}
                  className="text-xs text-gray-500 hover:text-white underline"
                >
                  Change
                </button>
              </div>
            )}

            {/* MONETIZATION HINT */}
            <div className="mt-3 flex items-start gap-2 opacity-60">
              <ShieldCheck size={12} className="text-[#FFD700] mt-0.5" />
              <p className="text-[9px] text-gray-500">
                <span className="text-[#FFD700] font-bold">WOLFPACK VERIFIED:</span> Partner locations pay marketing fees to host your pack.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Top 3 Skills</label>
            <input 
              required
              type="text" 
              className="w-full bg-[#0a0a0a] border border-[#333] rounded p-3 text-white focus:border-[#FFD700] outline-none transition-colors"
              placeholder="e.g. React, Fundraising, Sales"
              value={formData.skills}
              onChange={e => setFormData({...formData, skills: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={!selectedCafe}
            className="w-full bg-[#FFD700] text-black font-black py-4 rounded-lg uppercase tracking-widest hover:bg-yellow-400 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,215,0,0.3)]"
          >
            Initialize Protocol
          </button>
        </form>
      </div>
    </div>
  );
};

export default MintID;
