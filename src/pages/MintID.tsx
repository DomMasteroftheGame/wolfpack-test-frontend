import React, { useState } from 'react';
import { useLocation } from 'wouter';

const MintID = () => {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    location: '',
    skills: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to local storage
    const role = localStorage.getItem('wolf_role');
    const profile = {
      ...formData,
      role,
      skills: formData.skills.split(',').map(s => s.trim()),
      stats: { ivp: 0, efficiency: 0 }
    };
    localStorage.setItem('wolf_profile', JSON.stringify(profile));
    
    // Navigate to Game Board
    setLocation('/game');
  };

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1a1a1a] border border-[#333] p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-[#FFD700] mb-2 text-center">MINT YOUR ID</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">Initialize your Wolfpack Identity.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Codename</label>
            <input 
              required
              type="text" 
              className="w-full bg-[#111] border border-[#333] rounded p-3 text-white focus:border-[#FFD700] outline-none"
              placeholder="e.g. Maverick"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tagline</label>
            <input 
              required
              type="text" 
              className="w-full bg-[#111] border border-[#333] rounded p-3 text-white focus:border-[#FFD700] outline-none"
              placeholder="e.g. Building the future of finance."
              value={formData.tagline}
              onChange={e => setFormData({...formData, tagline: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Homebase (City)</label>
            <input 
              required
              type="text" 
              className="w-full bg-[#111] border border-[#333] rounded p-3 text-white focus:border-[#FFD700] outline-none"
              placeholder="e.g. New York, NY"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Top 3 Skills (Comma Separated)</label>
            <input 
              required
              type="text" 
              className="w-full bg-[#111] border border-[#333] rounded p-3 text-white focus:border-[#FFD700] outline-none"
              placeholder="e.g. React, Fundraising, Sales"
              value={formData.skills}
              onChange={e => setFormData({...formData, skills: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#FFD700] text-black font-bold py-4 rounded-lg uppercase tracking-widest hover:bg-yellow-400 transition-colors"
          >
            Initialize Protocol
          </button>
        </form>
      </div>
    </div>
  );
};

export default MintID;
