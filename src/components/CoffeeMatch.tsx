import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface CoffeeShop {
  id: string;
  name: string;
  rating: number;
  priceLevel: string;
  address: string;
  distance: string;
  votes: number;
}

interface PackMember {
  id: string;
  name: string;
  avatar: string;
  status: 'active' | 'offline';
  lat: number;
  lng: number;
  role: 'Labor' | 'Capital' | 'Sales';
  lookingFor: ('Labor' | 'Capital' | 'Sales')[];
}

// Mock Data with Roles
const MOCK_MEMBERS: PackMember[] = [
  { id: 'u1', name: 'You', avatar: 'https://ui-avatars.com/api/?name=You&background=FFD700&color=000', status: 'active', lat: 30.2672, lng: -97.7431, role: 'Labor', lookingFor: ['Capital'] },
  { id: 'u2', name: 'Maverick', avatar: 'https://ui-avatars.com/api/?name=Maverick&background=333&color=FFF', status: 'active', lat: 30.2700, lng: -97.7500, role: 'Capital', lookingFor: ['Labor', 'Sales'] },
  { id: 'u3', name: 'Viper', avatar: 'https://ui-avatars.com/api/?name=Viper&background=333&color=FFF', status: 'active', lat: 30.2600, lng: -97.7400, role: 'Sales', lookingFor: ['Labor'] },
  { id: 'u4', name: 'Goose', avatar: 'https://ui-avatars.com/api/?name=Goose&background=333&color=FFF', status: 'offline', lat: 30.2650, lng: -97.7450, role: 'Labor', lookingFor: ['Capital'] },
  { id: 'u5', name: 'Iceman', avatar: 'https://ui-avatars.com/api/?name=Iceman&background=333&color=FFF', status: 'active', lat: 30.2680, lng: -97.7480, role: 'Capital', lookingFor: ['Sales'] },
];

const MOCK_SHOPS: CoffeeShop[] = [
  { id: 's1', name: 'Tactical Brew', rating: 4.8, priceLevel: '$$$', address: '101 Congress Ave', distance: '0.2 mi', votes: 0 },
  { id: 's2', name: 'Midnight Oil', rating: 4.6, priceLevel: '$$', address: '505 E 6th St', distance: '0.4 mi', votes: 0 },
  { id: 's3', name: 'The Grind', rating: 4.5, priceLevel: '$$', address: '200 Lavaca St', distance: '0.3 mi', votes: 0 },
];

const CoffeeMatch: React.FC = () => {
  const [step, setStep] = useState<'members' | 'calculating' | 'voting' | 'confirmed'>('members');
  const [selectedMembers, setSelectedMembers] = useState<string[]>(['u1']);
  const [shops, setShops] = useState<CoffeeShop[]>(MOCK_SHOPS);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [centroid, setCentroid] = useState<{lat: number, lng: number} | null>(null);
  
  // Filters
  const [filterRole, setFilterRole] = useState<'All' | 'Labor' | 'Capital' | 'Sales'>('All');
  const [filterLookingFor, setFilterLookingFor] = useState<'All' | 'Labor' | 'Capital' | 'Sales'>('All');

  const toggleMember = (id: string) => {
    if (id === 'u1') return; // Cannot deselect self
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter(m => m !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  const calculateConsensus = () => {
    setStep('calculating');
    
    // Mock Centroid Calculation
    const activeMembers = MOCK_MEMBERS.filter(m => selectedMembers.includes(m.id));
    const totalLat = activeMembers.reduce((sum, m) => sum + m.lat, 0);
    const totalLng = activeMembers.reduce((sum, m) => sum + m.lng, 0);
    
    const center = {
      lat: totalLat / activeMembers.length,
      lng: totalLng / activeMembers.length
    };
    
    setCentroid(center);

    // Simulate API delay
    setTimeout(() => {
      setStep('voting');
    }, 2000);
  };

  const handleVote = (shopId: string) => {
    if (userVote) return; // Already voted
    setUserVote(shopId);
    
    // Simulate other votes
    const updatedShops = shops.map(shop => {
      if (shop.id === shopId) {
        return { ...shop, votes: shop.votes + 1 };
      }
      // Randomly add votes to others to simulate group activity
      if (Math.random() > 0.7) {
        return { ...shop, votes: shop.votes + 1 };
      }
      return shop;
    });
    
    setShops(updatedShops);

    // Check for consensus (simple majority or just wait)
    setTimeout(() => {
      setStep('confirmed');
    }, 1500);
  };

  const filteredMembers = MOCK_MEMBERS.filter(member => {
    if (member.id === 'u1') return true; // Always show self
    if (filterRole !== 'All' && member.role !== filterRole) return false;
    if (filterLookingFor !== 'All' && !member.lookingFor.includes(filterLookingFor)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white p-4 font-sans flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-2xl font-bold text-[#FFD700] uppercase tracking-widest">
            Pack Protocol
          </h1>
          <div className="text-xs text-gray-500 font-mono">
            STATUS: {step === 'members' ? 'ASSEMBLING' : step === 'calculating' ? 'TRIANGULATING' : step === 'voting' ? 'VOTING' : 'LOCKED'}
          </div>
        </div>

        {step === 'members' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">Assemble Your Pack</h2>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-[#111] border border-gray-800 rounded-lg">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 uppercase">Role</label>
                <select 
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as any)}
                  className="bg-black border border-gray-700 text-white text-sm rounded px-2 py-1 focus:border-[#FFD700] outline-none"
                >
                  <option value="All">All Roles</option>
                  <option value="Labor">Labor</option>
                  <option value="Capital">Capital</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 uppercase">Looking For</label>
                <select 
                  value={filterLookingFor}
                  onChange={(e) => setFilterLookingFor(e.target.value as any)}
                  className="bg-black border border-gray-700 text-white text-sm rounded px-2 py-1 focus:border-[#FFD700] outline-none"
                >
                  <option value="All">Any</option>
                  <option value="Labor">Labor</option>
                  <option value="Capital">Capital</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {filteredMembers.map(member => (
                <div 
                  key={member.id}
                  onClick={() => toggleMember(member.id)}
                  className={`
                    flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all relative overflow-hidden
                    ${selectedMembers.includes(member.id) 
                      ? 'bg-[#1a1a1a] border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.1)]' 
                      : 'bg-black border-gray-800 hover:border-gray-600'}
                  `}
                >
                  <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full border border-gray-600" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-sm">{member.name}</div>
                      <div className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                        {member.role}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Seeking: <span className="text-gray-400">{member.lookingFor.join(', ')}</span>
                    </div>
                    <div className={`text-xs mt-1 ${member.status === 'active' ? 'text-green-500' : 'text-gray-500'}`}>
                      {member.status === 'active' ? '● Active' : '○ Offline'}
                    </div>
                  </div>
                  {selectedMembers.includes(member.id) && (
                    <div className="text-[#FFD700] text-xl">✓</div>
                  )}
                </div>
              ))}
            </div>
            <button 
              onClick={calculateConsensus}
              disabled={selectedMembers.length < 2}
              className={`
                w-full py-4 rounded font-bold uppercase tracking-widest transition-all
                ${selectedMembers.length >= 2 
                  ? 'bg-[#FFD700] text-black hover:bg-[#E5C100] shadow-lg' 
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
              `}
            >
              Initiate Consensus
            </button>
          </div>
        )}

        {step === 'calculating' && (
          <div className="flex flex-col items-center justify-center h-64 animate-in fade-in">
            <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mb-6"></div>
            <div className="text-[#FFD700] font-mono text-sm animate-pulse">CALCULATING GEOGRAPHIC CENTROID...</div>
            <div className="text-gray-500 text-xs mt-2">Triangulating {selectedMembers.length} signals</div>
          </div>
        )}

        {step === 'voting' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-lg font-bold text-white mb-2 uppercase tracking-wider">Neutral Ground Identified</h2>
            <p className="text-gray-400 text-sm mb-6">Gemini has identified 3 tactical locations near the pack centroid.</p>
            
            <div className="space-y-4">
              {shops.map(shop => (
                <div 
                  key={shop.id}
                  onClick={() => handleVote(shop.id)}
                  className={`
                    relative overflow-hidden p-4 rounded-lg border transition-all cursor-pointer group
                    ${userVote === shop.id 
                      ? 'bg-[#1a1a1a] border-[#FFD700]' 
                      : 'bg-black border-gray-800 hover:border-gray-600'}
                  `}
                >
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <h3 className="font-bold text-[#FFD700]">{shop.name}</h3>
                      <div className="text-xs text-gray-400 mt-1">{shop.address} • {shop.distance}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-300">★ {shop.rating}</span>
                        <span className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-300">{shop.priceLevel}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-2xl font-bold text-gray-700 group-hover:text-gray-500 transition-colors">
                        {shop.votes} <span className="text-xs font-normal">VOTES</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar Background */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-[#FFD700]/10 transition-all duration-500"
                    style={{ width: `${(shop.votes / selectedMembers.length) * 100}%` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'confirmed' && (
          <div className="text-center animate-in zoom-in duration-300">
            <div className="inline-block p-4 rounded-full bg-[#FFD700]/20 border-2 border-[#FFD700] mb-6">
              <svg className="w-12 h-12 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-widest">Target Locked</h2>
            <p className="text-gray-400 mb-8">The pack has spoken. Rendezvous coordinates set.</p>
            
            <div className="bg-[#111] border border-[#333] p-6 rounded-lg max-w-sm mx-auto mb-8">
              <h3 className="text-xl font-bold text-[#FFD700] mb-2">
                {shops.sort((a, b) => b.votes - a.votes)[0].name}
              </h3>
              <p className="text-gray-400 text-sm">101 Congress Ave, Austin, TX</p>
              <div className="mt-4 pt-4 border-t border-[#333] flex justify-between text-xs text-gray-500 font-mono">
                <span>ETA: 15 MINS</span>
                <span>STATUS: CONFIRMED</span>
              </div>
            </div>

            <button 
              onClick={() => setStep('members')}
              className="text-gray-500 hover:text-white text-sm underline decoration-dotted underline-offset-4"
            >
              Initiate New Protocol
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoffeeMatch;
