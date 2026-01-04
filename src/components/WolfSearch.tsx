import React, { useState, useEffect } from 'react';
import { MatchProfile, User } from '../types';
import { Search, Filter, Share2, Target } from 'lucide-react';
import { WolfProfileCard } from './WolfProfileCard';
import { matchmakerApi } from '../api';

interface WolfSearchProps {
    user: User;
    onSelectWolf: (wolf: MatchProfile) => void;
    onMessageWolf: (wolf: MatchProfile) => void;
}

export const WolfSearch: React.FC<WolfSearchProps> = ({ user, onSelectWolf, onMessageWolf }) => {
    const [wolves, setWolves] = useState<MatchProfile[]>([]);
    const [filteredWolves, setFilteredWolves] = useState<MatchProfile[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Filters
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [skillFilter, setSkillFilter] = useState<string>('');
    const [locationFilter, setLocationFilter] = useState<string>('');

    useEffect(() => {
        const fetchWolves = async () => {
            try {
                // For MVP, using default coordinates or user's if available
                // In real app, get from Context
                const token = ''; // Addauth token logic or context
                const wolvesData = await matchmakerApi.getNearbyWolves(token, 0, 0); // Mock coords for now if user loc not set

                if (wolvesData && wolvesData.length > 0) {
                    // Transform if necessary or use directly if backend matches interface
                    // Backend returns { _id, section... } 
                    // We need to map to MatchProfile
                    const mappedWolves = wolvesData.map((w: any) => ({
                        id: w._id,
                        name: w.profile?.name || 'Unknown Wolf',
                        role: w.profile?.role || 'labor',
                        tagline: w.profile?.tagline || 'Ready to work',
                        avatar: w.profile?.avatar || `https://ui-avatars.com/api/?name=${w.profile?.name || 'U'}`,
                        distance: 'Nearby', // backend doesn't return distance yet calculated relative
                        location: 'Unknown Sector',
                        skills: w.profile?.skills || [],
                        stats: w.stats || { build: 50, fund: 50, connect: 50 },
                        ratings: { self: 5, peer: 5, accuracy: 100 },
                        hunting: 'Opportunities',
                        linkedin: '#'
                    }));
                    setWolves(mappedWolves);
                    setFilteredWolves(mappedWolves);
                } else {
                    // Fallback to mock if empty (ghosts)
                    setWolves([]);
                }
            } catch (e) {
                console.error("Failed to fetch wolves", e);
            }
        };
        fetchWolves();
    }, []);

    useEffect(() => {
        let result = wolves;
        if (roleFilter !== 'all') result = result.filter(w => w.role === roleFilter);
        if (skillFilter) result = result.filter(w => w.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase())));
        if (locationFilter) result = result.filter(w => w.location?.toLowerCase().includes(locationFilter.toLowerCase()));
        setFilteredWolves(result);
    }, [roleFilter, skillFilter, locationFilter, wolves]);

    const handleInviteFriend = () => {
        const inviteLink = `${window.location.origin}/join?ref=${user._id}`;
        if (navigator.share) {
            navigator.share({
                title: 'Join my Wolfpack',
                text: 'I need a partner for my startup. Join me on Wolfpack!',
                url: inviteLink,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(inviteLink);
            alert('Invite link copied to clipboard! Share it to boost your resources.');
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-950 text-white p-4 md:p-6 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-white flex items-center gap-2">
                        <Target className="w-6 h-6 text-red-500 animate-pulse" />
                        Wolf Search
                    </h2>
                    <p className="text-gray-400 text-sm">Find your pack. Build your empire.</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleInviteFriend}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-lg flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(202,138,4,0.3)]"
                    >
                        <Share2 className="w-4 h-4" />
                        <span className="hidden md:inline">Invite & Boost (+10%)</span>
                        <span className="md:hidden">Invite</span>
                    </button>
                    <div className="flex bg-gray-900 p-1 rounded-lg border border-gray-800">
                        <button onClick={() => setViewMode('grid')} className={`px-3 py-2 rounded-md text-sm font-medium ${viewMode === 'grid' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}>Grid</button>
                        <button onClick={() => setViewMode('list')} className={`px-3 py-2 rounded-md text-sm font-medium ${viewMode === 'list' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}>List</button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-6 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:border-yellow-500 outline-none">
                        <option value="all">All Roles</option>
                        <option value="labor">Labor (Builder)</option>
                        <option value="finance">Capital (Funder)</option>
                        <option value="sales">Sales (Connector)</option>
                    </select>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input type="text" placeholder="Skills (React, Finance...)" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-yellow-500 outline-none" />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input type="text" placeholder="Location" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-yellow-500 outline-none" />
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar touch-pan-y">
                {filteredWolves.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500 text-center">
                        <Search className="w-12 h-12 mb-4 opacity-20" />
                        <p className="mb-2">No wolves found in this sector.</p>
                        <p className="text-sm max-w-md mb-6">The pack is thin here. Invite a friend to fill this role and earn a 10% resource boost for your startup.</p>
                        <button onClick={handleInviteFriend} className="px-6 py-3 bg-yellow-600 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors">
                            Invite External Wolf
                        </button>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
                        {filteredWolves.map((wolf) => (
                            <WolfProfileCard
                                key={wolf.id}
                                wolf={wolf}
                                viewMode={viewMode}
                                onSelect={onSelectWolf}
                                onMessage={onMessageWolf}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
