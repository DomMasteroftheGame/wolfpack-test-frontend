import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swords, ShoppingBag, Radio } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MainNav from '../components/MainNav';
import BottomNav from '../components/BottomNav';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser: user } = useAuth();

    return (
        <div className="min-h-screen bg-black text-white flex flex-col pb-20 md:pb-0">
            <MainNav />
            {/* Hero Section - INCREASED HEIGHT & CONTRAST */}
            <section className="relative h-[60vh] md:h-[70vh] w-full flex flex-col items-center justify-center text-center px-4 bg-black border-b border-gray-800 pt-24">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-black z-0 pointer-events-none" />
                <motion.div
                    className="z-10 relative"
                >
                    <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white mb-6 drop-shadow-2xl">
                        FUEL YOUR <span className="text-yellow-500">HUSTLE.</span>
                        <br />
                        BUILD YOUR <span className="text-yellow-500">PACK.</span>
                    </h1>
                    <p className="text-gray-300 font-sans text-lg md:text-xl tracking-wide max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md">
                        The resource for the infinite game. <br />
                        <span className="text-yellow-500 font-bold">Play the game. Drink the coffee. Execute the mission.</span>
                    </p>
                </motion.div>
            </section>

            {/* Traffic Cop Grid - The 3 Pillars */}
            <section className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-0 bg-gray-900">

                {/* THE GAME */}
                <motion.div
                    whileHover={{ scale: 0.99 }}
                    onClick={() => navigate('/dashboard')}
                    className="relative px-6 py-16 md:py-24 bg-gray-950 border-r border-gray-800 border-b border-gray-800 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-900 transition-colors group"
                >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-yellow-500/0 group-hover:bg-yellow-500/5 transition-colors duration-300" />

                    <div className="relative z-10 text-center">
                        <div className="mb-8 transform group-hover:scale-110 transition-transform duration-300">
                            <Swords className="w-20 h-20 text-yellow-500" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white mb-2 group-hover:text-yellow-500 transition-colors">The Game</h2>
                        <h3 className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-6">Play & Earn</h3>

                        <button className="flex items-center gap-2 px-8 py-4 bg-yellow-500 text-black font-black uppercase tracking-widest text-sm hover:bg-yellow-400 hover:scale-105 transition-all shadow-lg shadow-yellow-500/20">
                            ENTER THE ARENA <Swords className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>

                {/* THE SHOP */}
                <motion.div
                    whileHover={{ scale: 0.99 }}
                    onClick={() => window.location.href = '/collections/all'}
                    className="relative px-6 py-16 md:py-24 bg-gray-950 border-r border-gray-800 border-b border-gray-800 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-900 transition-colors group"
                >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />

                    <div className="relative z-10 text-center">
                        <div className="mb-8 transform group-hover:rotate-12 transition-transform duration-300">
                            <ShoppingBag className="w-20 h-20 text-white" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white mb-2">The Shop</h2>
                        <h3 className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-6">Fuel the Pack</h3>

                        <button className="flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black hover:scale-105 transition-all">
                            SHOP COLLECTION <ShoppingBag className="w-4 h-4" />
                        </button>

                        <div
                            onClick={(e) => { e.stopPropagation(); navigate('/wholesale'); }}
                            className="mt-8 text-xs text-gray-500 underline hover:text-yellow-500 cursor-pointer uppercase tracking-widest font-bold z-20"
                        >
                            Wholesale / Bulk Orders
                        </div>
                    </div>
                </motion.div>

                {/* THE MISSION */}
                <motion.div
                    whileHover={{ scale: 0.99 }}
                    onClick={() => navigate('/about')}
                    className="relative px-6 py-16 md:py-24 bg-gray-950 border-gray-800 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-900 transition-colors group"
                >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-300" />

                    <div className="relative z-10 text-center">
                        <div className="mb-8 transform group-hover:translate-x-1 transition-transform duration-300">
                            <Radio className="w-20 h-20 text-blue-500" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-blue-500 mb-2">The Mission</h2>
                        <h3 className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-6">Meet the Alpha</h3>

                        <button className="flex items-center gap-2 px-8 py-4 border-2 border-blue-500 text-blue-500 font-black uppercase tracking-widest text-sm hover:bg-blue-500 hover:text-white hover:scale-105 transition-all shadow-lg shadow-blue-500/0 hover:shadow-blue-500/20">
                            READ INTELLIGENCE <Radio className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>

            </section>
            <BottomNav />
        </div>
    );
};

export default Home;
