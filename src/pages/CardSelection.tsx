import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WolfCard } from '../components/WolfCard.tsx';
import { SVG_ASSETS } from '../utils/svgAssets.ts';
import { Card, User } from '../types.ts';
import { API_BASE_URL } from '../constants.ts';

// --- MENTOR COMPONENT ---
const MentorBubble = ({ message }: { message: string }) => (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3 bg-gray-900 border border-yellow-600 rounded-2xl p-4 shadow-2xl max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-500">
        <img 
            src="https://ui-avatars.com/api/?name=Dom&background=FFD700&color=000" 
            alt="Dom" 
            className="w-12 h-12 rounded-full border-2 border-yellow-500"
        />
        <div>
            <h4 className="text-yellow-500 font-bold text-xs uppercase tracking-wider">Dom (Co-Founder)</h4>
            <p className="text-white text-sm leading-tight italic">"{message}"</p>
        </div>
    </div>
);

const CardSelection: React.FC = () => {
  const navigate = useNavigate();
  
  // Game State
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  
  // Profile Setup State (Mint ID)
  const [mintStep, setMintStep] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileLocation, setProfileLocation] = useState('');
  const [profileSkills, setProfileSkills] = useState('');
  const [profileBio, setProfileBio] = useState('');
  
  // UI State
  const [loading, setLoading] = useState(false);

  // Helper: Robust JSON parsing
  const safeJsonParse = async (response: Response) => {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json();
    } else {
      const text = await response.text();
      const isHtml = text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html');
      if (isHtml) {
        throw new Error(`The server at ${response.url} returned an HTML page (likely a 404 or maintenance page) instead of JSON data.`);
      }
      throw new Error(`Unexpected response format from HQ: ${text.substring(0, 50)}...`);
    }
  };

  // Sync local session
  useEffect(() => {
    const storedUser = localStorage.getItem('wolfpack_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // If user hasn't selected a startup yet, send them back
        if (!parsedUser.selected_product_id) {
            navigate('/select-startup');
            return;
        }

        // If user already has a card and profile, go to dashboard
        if (parsedUser.selected_card_id && parsedUser.onboardingStep >= 2) {
            navigate('/dashboard');
        } else if (parsedUser.selected_card_id) {
            // If card selected but profile not minted
            setMintStep(true);
            setSelectedCardId(parsedUser.selected_card_id);
        }

      } catch (e) {
        localStorage.removeItem('wolfpack_user');
        navigate('/select-startup');
      }
    } else {
        navigate('/select-startup');
    }
  }, [navigate]);

  // Fetch cards
  useEffect(() => {
    const fetchCards = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/cards`);
            if (!res.ok) throw new Error('Failed to load identity cards');
            const data = await safeJsonParse(res);
            setCards(data);
        } catch (err) {
            console.warn("Card fetch error, using defaults:", err);
            setCards([
                { id: "c1", type: "labor", name: "The Builder", description: "I get things done." },
                { id: "c2", type: "finance", name: "The Capital", description: "I fund the vision." },
                { id: "c3", type: "sales", name: "The Connector", description: "I connect the dots." }
            ]);
        }
    };
    fetchCards();
  }, []);

  const handleConfirmSelection = async () => {
    if (!selectedCardId || !user) return;
    setLoading(true);
    try {
        await fetch(`${API_BASE_URL}/api/cards/select`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id, cardId: selectedCardId })
        });
    } catch (e) { console.warn("Selection sync delayed", e); }

    const updatedUser = { ...user, selected_card_id: selectedCardId };
    setUser(updatedUser);
    localStorage.setItem('wolfpack_user', JSON.stringify(updatedUser));
    setMintStep(true);
    setLoading(false);
  };

  const handleMintIdentity = async () => {
    if (!user) return;
    setLoading(true);
    const skillsArray = profileSkills.split(',').map(s => s.trim()).filter(s => s.length > 0);

    try {
        await fetch(`${API_BASE_URL}/api/user/profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user._id,
                name: profileName || user.email.split('@')[0],
                location: profileLocation,
                skills: skillsArray,
                bio: profileBio
            })
        });
    } catch (e) { console.warn("Profile sync delayed", e); }

    const updatedUser = { 
        ...user, 
        name: profileName, 
        location: profileLocation, 
        skills: skillsArray,
        bio: profileBio,
        onboardingStep: 2 // Step 2 is Identity Minted
    };
    
    setUser(updatedUser);
    localStorage.setItem('wolfpack_user', JSON.stringify(updatedUser));
    setLoading(false);
    navigate('/dashboard');
  };

  if (!user) return null;

  // Profile Minting Screen
  if (mintStep) {
      return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
             <div className="w-full max-w-lg bg-gray-900 border border-yellow-600 rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-right">
                 <div className="text-center mb-6">
                     <h2 className="text-3xl font-extrabold text-white uppercase tracking-widest">Mint Your ID</h2>
                     <p className="text-gray-400 text-sm mt-2">The pack needs to know who you are and where you hunt.</p>
                 </div>
                 
                 <div className="space-y-6">
                     <div>
                         <label className="block text-gray-500 text-xs font-bold uppercase mb-2">Wolf Name</label>
                         <input type="text" value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="e.g. Maverick" className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:border-yellow-500 outline-none" />
                     </div>
                     <div>
                         <label className="block text-gray-500 text-xs font-bold uppercase mb-2">Territory (City)</label>
                         <input type="text" value={profileLocation} onChange={e => setProfileLocation(e.target.value)} placeholder="e.g. Austin, TX" className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:border-yellow-500 outline-none" />
                         <p className="text-[10px] text-gray-500 mt-1">*Used for location-based matching.</p>
                     </div>
                     <div>
                         <label className="block text-gray-500 text-xs font-bold uppercase mb-2">Skills (Comma Separated)</label>
                         <input type="text" value={profileSkills} onChange={e => setProfileSkills(e.target.value)} placeholder="e.g. React, Fundraising, Sales" className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:border-yellow-500 outline-none" />
                     </div>
                     <div>
                         <label className="block text-gray-500 text-xs font-bold uppercase mb-2">Tagline</label>
                         <input type="text" value={profileBio} onChange={e => setProfileBio(e.target.value)} placeholder="e.g. I build scalable backends." className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:border-yellow-500 outline-none" />
                     </div>
                     
                     <button onClick={handleMintIdentity} disabled={!profileName || !profileLocation || loading} className={`w-full py-4 rounded-lg font-bold uppercase tracking-wider ${profileName && profileLocation ? 'bg-yellow-600 hover:bg-yellow-500 text-black' : 'bg-gray-800 text-gray-600'}`}>
                         {loading ? 'Minting...' : 'Initialize Profile'}
                     </button>
                 </div>
             </div>
        </div>
      );
  }

  // Card Selection Screen
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 relative">
      
      {/* PERSISTENT STARTUP CARD */}
      <div className="absolute top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-40">
        <div className="bg-gray-800/90 backdrop-blur border border-blue-500/50 rounded-xl p-4 shadow-lg">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Your Mission</h3>
                <span className="text-[10px] bg-blue-900 text-blue-200 px-2 py-0.5 rounded">LOCKED</span>
            </div>
            <div className="text-white font-bold text-lg leading-tight mb-1">{user.alphaPitch?.headline || 'Stealth Startup'}</div>
            <div className="text-gray-400 text-xs">{user.alphaPitch?.strategy || 'Classified Strategy'}</div>
        </div>
      </div>

      <div className="mb-8 text-center mt-20 md:mt-0">
        <img src={SVG_ASSETS.logo} alt="Wolfpack Logo" className="h-24 w-auto mx-auto mb-4 object-contain opacity-90" style={{ maxHeight: '96px' }} />
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400 mb-2">Choose Your Path</h1>
        <p className="text-gray-200 text-lg max-w-lg mx-auto">Your identity defines your role in the pack. This choice is permanent.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full mb-12">
        {cards.map((card) => (
          <WolfCard
            key={card.id}
            card={card}
            selected={selectedCardId === card.id}
            onSelect={setSelectedCardId}
            disabled={loading}
          />
        ))}
      </div>

      <div className="fixed bottom-8 left-0 right-0 flex justify-center px-4 z-50">
        <button
          onClick={handleConfirmSelection}
          disabled={!selectedCardId || loading}
          className={`w-full max-w-md py-4 px-8 rounded-full text-lg font-bold tracking-widest uppercase shadow-2xl transition-all ${selectedCardId && !loading ? 'bg-yellow-500 text-black hover:bg-yellow-400 hover:scale-105 cursor-pointer' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
        >
          {loading ? 'Confirming...' : 'Confirm Identity'}
        </button>
      </div>
      
      <MentorBubble message="Don't overthink it. Are you a Maker (Build), a Hustler (Sales), or the Money (Fund)? You need all three to win, but you can only BE one." />
    </div>
  );
};

export default CardSelection;
