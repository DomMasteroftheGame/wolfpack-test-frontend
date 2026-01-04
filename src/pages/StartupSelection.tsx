import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_CARDS, API_BASE_URL } from '../constants.ts';
import { ProductCard, User, Task } from '../types.ts';
import { getAssetUrl } from '../utils/assets.ts';
import { SVG_ASSETS } from '../utils/svgAssets.ts';

// --- MENTOR COMPONENT ---
const MentorBubble = ({ message }: { message: string }) => (
    <div className="fixed top-4 right-4 z-50 flex flex-row-reverse items-center gap-3 bg-gray-900 border border-blue-600 rounded-2xl p-4 shadow-2xl max-w-sm animate-in slide-in-from-top-5 fade-in duration-500">
        <img 
            src="https://ui-avatars.com/api/?name=Dom&background=FFD700&color=000" 
            alt="Dom" 
            className="w-12 h-12 rounded-full border-2 border-blue-500"
        />
        <div className="text-right">
            <h4 className="text-blue-400 font-bold text-xs uppercase tracking-wider">Dom (Co-Founder)</h4>
            <p className="text-white text-sm leading-tight italic">"{message}"</p>
        </div>
    </div>
);

const StartupSelection: React.FC = () => {
    const navigate = useNavigate();
    
    // Auth State
    const [user, setUser] = useState<User | null>(null);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const attemptedAutoAuth = useRef(false);

    // Selection State
    const [options, setOptions] = useState<ProductCard[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    // Custom Idea State
    const [isCustom, setIsCustom] = useState(false);
    const [customIdea, setCustomIdea] = useState({ title: '', targetMarket: '', price: '', marketingChannels: '' });

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

    // Helper: Persist User and Navigate
    const loginUser = (userData: User, token: string) => {
        localStorage.setItem('wolfpack_token', token);
        localStorage.setItem('wolfpack_user', JSON.stringify(userData));
        setUser(userData);
        
        // If user already has a product selected, check if they have a card
        if (userData.selected_product_id) {
            if (userData.selected_card_id) {
                navigate('/dashboard');
            } else {
                navigate('/select-card');
            }
        }
    };

    // 1. SHOPIFY AUTO-AUTH BRIDGE
    useEffect(() => {
        const autoAuthenticate = async () => {
            if (attemptedAutoAuth.current) return;
            
            const shopifyUser = (window as any).pwaThemeVariables;
            
            if (shopifyUser && shopifyUser.email) {
                attemptedAutoAuth.current = true;
                setAuthLoading(true);
                setStatusMessage(`Syncing Wolfpack ID: ${shopifyUser.email}...`);

                try {
                    const loginRes = await fetch(`${API_BASE_URL}/api/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: shopifyUser.email })
                    });

                    if (loginRes.ok) {
                        const data = await safeJsonParse(loginRes);
                        loginUser(data.user, data.token);
                        return;
                    }

                    if (loginRes.status === 404) {
                        setStatusMessage("New Wolf Detected. Minting Identity...");
                        const regRes = await fetch(`${API_BASE_URL}/api/auth/register`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                email: shopifyUser.email,
                                name: shopifyUser.name || 'Unknown Wolf',
                                shopifyId: shopifyUser.id
                            })
                        });

                        if (regRes.ok) {
                            const regData = await safeJsonParse(regRes);
                            loginUser(regData.user, regData.token);
                            return;
                        }
                    }
                } catch (e: any) {
                    console.warn("🐺 Bridge Error:", e);
                    setStatusMessage("HQ connection weak. Switch to manual login.");
                } finally {
                    setAuthLoading(false);
                }
            }
        };

        autoAuthenticate();
    }, []);

    // Sync local session
    useEffect(() => {
        const storedUser = localStorage.getItem('wolfpack_user');
        if (storedUser && !user) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                if (parsedUser.selected_product_id) {
                    // If already selected, move to next step or dashboard
                    if (parsedUser.selected_card_id) {
                        navigate('/dashboard');
                    } else {
                        navigate('/select-card');
                    }
                }
            } catch (e) {
                localStorage.removeItem('wolfpack_user');
            }
        }
        
        // Initial Random Options
        refreshOptions();
    }, [navigate]);

    const refreshOptions = () => {
        const shuffled = [...PRODUCT_CARDS].sort(() => 0.5 - Math.random());
        setOptions(shuffled.slice(0, 3));
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        setAuthError('');
        
        const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
        const fullUrl = `${API_BASE_URL}${endpoint}`;

        try {
            const res = await fetch(fullUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                if (res.status === 404 && authMode === 'login') {
                    setAuthError("Wolf ID not found. Try registering.");
                    setAuthMode('register');
                    setAuthLoading(false);
                    return;
                }
                throw new Error(`Server responded with status ${res.status}`);
            }

            const data = await safeJsonParse(res);
            loginUser(data.user, data.token);

        } catch (err: any) {
            console.warn("🐺 Auth Failure:", err);
            setAuthError(err.message || "HQ Connection failed.");
        } finally {
            setAuthLoading(false);
        }
    };

    const handleSelect = async () => {
        if ((!selectedId && !isCustom) || !user) return;
        setLoading(true);

        // Optimistic Local Update
        // Generate initial 40 tasks state
        const initialTasks: Task[] = Array.from({ length: 40 }, (_, i) => ({
             id: i + 1,
             status: 'todo',
             assignedTo: undefined
        }));

        const updatedUser: User = { 
            ...user, 
            selected_product_id: isCustom ? -1 : selectedId, // -1 for custom
            tasks: initialTasks,
            ivp: 0,
            onboardingStep: 1, // Step 1 is now Startup Selected
            updatedAt: new Date().toISOString()
        };

        if (isCustom) {
            updatedUser.alphaPitch = { 
                headline: customIdea.title, 
                strategy: `${customIdea.targetMarket} | ${customIdea.price}` 
            };
        } else {
            const selectedOption = options.find(o => o.id === selectedId);
            if (selectedOption) {
                updatedUser.alphaPitch = {
                    headline: selectedOption.title,
                    strategy: `${selectedOption.targetMarket} | ${selectedOption.price}`
                };
            }
        }

        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request Timed Out')), 2000);
        });

        const payload = isCustom 
            ? { userId: user._id, customProduct: customIdea }
            : { userId: user._id, productId: selectedId };

        try {
            const res = await Promise.race([
                fetch(`${API_BASE_URL}/api/startup/select`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(payload)
                }),
                timeoutPromise
            ]) as Response;

            if (res.ok) {
                const data = await res.json();
                updatedUser.tasks = data.tasks; // Use server tasks
                updatedUser.ivp = data.ivp;
            }
        } catch (e) {
            console.warn("Wolfpack Backend unreachable. Proceeding offline.", e);
        }

        localStorage.setItem('wolfpack_user', JSON.stringify(updatedUser));
        navigate('/select-card'); // Navigate to Identity Selection
    };

    // AUTH SCREEN
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
                    <div className="text-center mb-8">
                        <img src={SVG_ASSETS.logo} alt="Wolfpack Logo" className="h-20 w-auto mx-auto mb-4 object-contain" style={{ maxHeight: '80px' }} />
                        <h2 className="text-3xl font-extrabold text-white tracking-tight">{authMode === 'login' ? 'Welcome Back' : 'Join the Pack'}</h2>
                        <p className="text-gray-400 mt-2 text-sm">Enter the encrypted network.</p>
                    </div>
                    
                    {statusMessage && (
                        <div className="mb-4 p-3 bg-blue-900/30 border border-blue-500 rounded text-blue-200 text-[10px] font-mono animate-pulse uppercase tracking-widest text-center">
                            📡 {statusMessage}
                        </div>
                    )}

                    {authError && (
                        <div className="mb-6 bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded text-sm flex items-start">
                            <span className="mr-2 mt-0.5">⚠️</span> 
                            <span>{authError}</span>
                        </div>
                    )}
                    
                    <form onSubmit={handleAuth} className="space-y-6">
                        <div>
                            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Email</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500 transition" placeholder="wolf@example.com" />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Password</label>
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500 transition" placeholder="••••••••" />
                        </div>
                        <button type="submit" disabled={authLoading} className={`w-full py-3 rounded-lg font-bold uppercase tracking-wider shadow-lg transition ${authLoading ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-500 text-black'}`}>
                            {authLoading ? 'Transmitting...' : (authMode === 'login' ? 'Login' : 'Register')}
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }} className="text-yellow-500 hover:text-yellow-400 text-sm font-semibold underline decoration-dotted underline-offset-4">
                            {authMode === 'login' ? "Don't have an ID? Join the Pack" : 'Already a Wolf? Login'}
                        </button>
                    </div>
                </div>
                <div className="mt-8 text-gray-600 text-[10px] uppercase tracking-widest font-bold">
                    Project Antigravity // Sector 7 // HQ: {API_BASE_URL}
                </div>
            </div>
        );
    }

    // SELECTION SCREEN
    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-white relative">
            <div className="text-center mb-10">
                 <img src={getAssetUrl('logo_gold')} alt="Logo" className="h-16 mx-auto mb-4 opacity-80" />
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                    Select Your Vision
                </h1>
                <p className="text-gray-400 mt-2">What will your Wolfpack build?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full mb-12">
                {/* PRESET OPTIONS */}
                {options.map(option => (
                    <div 
                        key={option.id}
                        onClick={() => { setSelectedId(option.id); setIsCustom(false); }}
                        className={`
                            cursor-pointer bg-gray-900 border-2 rounded-xl p-6 transition-all duration-300 relative overflow-hidden group
                            ${selectedId === option.id && !isCustom ? 'border-blue-500 scale-105 shadow-2xl shadow-blue-900/50' : 'border-gray-800 hover:border-blue-500/50 hover:scale-105'}
                        `}
                    >
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-white">{option.title}</h3>
                                <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded border border-blue-800">
                                    Startup Idea
                                </span>
                            </div>
                            <div className="space-y-3 text-sm text-gray-400">
                                <p><strong className="text-gray-500">Target:</strong> {option.targetMarket}</p>
                                <p><strong className="text-gray-500">Price:</strong> {option.price}</p>
                            </div>
                        </div>
                        {selectedId === option.id && !isCustom && (
                            <div className="absolute inset-0 bg-blue-500/10 z-0"></div>
                        )}
                    </div>
                ))}

                {/* CUSTOM CARD */}
                <div 
                    onClick={() => { setIsCustom(true); setSelectedId(null); }}
                    className={`
                        cursor-pointer bg-gray-900 border-2 border-dashed rounded-xl p-6 transition-all duration-300 relative overflow-hidden group
                        ${isCustom ? 'border-yellow-500 scale-105 shadow-2xl shadow-yellow-900/50' : 'border-gray-700 hover:border-yellow-500/50 hover:scale-105'}
                    `}
                >
                    {isCustom ? (
                        <div className="space-y-3 relative z-10" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-bold text-yellow-500 uppercase">Create Custom</h3>
                                <div className="text-xs bg-yellow-900/50 text-yellow-200 px-2 py-1 rounded border border-yellow-800">Your Vision</div>
                            </div>
                            <input type="text" placeholder="Startup Name/Idea" value={customIdea.title} onChange={e => setCustomIdea({...customIdea, title: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-xs text-white" />
                            <input type="text" placeholder="Target Market" value={customIdea.targetMarket} onChange={e => setCustomIdea({...customIdea, targetMarket: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-xs text-white" />
                            <input type="text" placeholder="Price Point" value={customIdea.price} onChange={e => setCustomIdea({...customIdea, price: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-xs text-white" />
                            <input type="text" placeholder="Marketing Channels" value={customIdea.marketingChannels} onChange={e => setCustomIdea({...customIdea, marketingChannels: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-xs text-white" />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 group-hover:text-yellow-500">
                             <span className="text-4xl mb-2">+</span>
                             <span className="text-sm font-bold uppercase tracking-widest">Create Custom</span>
                        </div>
                    )}
                </div>
            </div>

             <div className="fixed bottom-8 left-0 right-0 flex flex-col items-center justify-center px-4 z-50 gap-4">
                <button
                    onClick={refreshOptions}
                    className="text-gray-400 hover:text-white text-sm uppercase tracking-widest font-bold flex items-center gap-2 transition-colors"
                >
                    <span>↻</span> Refresh Options
                </button>

                <button
                onClick={handleSelect}
                disabled={(!selectedId && (!isCustom || !customIdea.title)) || loading}
                className={`
                    w-full max-w-md py-4 px-8 rounded-full text-lg font-bold tracking-widest uppercase shadow-2xl transition-all
                    ${(!selectedId && (!isCustom || !customIdea.title)) || loading
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-105 cursor-pointer'}
                `}
                >
                {loading ? 'Initializing Game Board...' : 'Launch Startup'}
                </button>
            </div>

            <MentorBubble message="If none of these fit, build your own cage. Create a custom vision that reflects your ambition." />
        </div>
    );
};

export default StartupSelection;
