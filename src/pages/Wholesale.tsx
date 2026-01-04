import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Send, Coffee, CheckCircle } from 'lucide-react';
import MainNav from '../components/MainNav';
import BottomNav from '../components/BottomNav';

const Wholesale: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // Here you would typically integrate with EmailJS or a backend endpoint
    };

    return (
        <div className="min-h-screen bg-black text-white pb-20 md:pb-0">
            <MainNav />

            <div className="pt-24 px-4 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-yellow-600/20 border border-yellow-600/50 mb-4">
                        <Package className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white mb-4">
                        FUEL YOUR <span className="text-yellow-500">OFFICE TEAM</span>
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-mono">
                        Bulk pricing available for commercial clients. Keep the wolfpack sharp, focused, and executing at high velocity.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Quick Order Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-900 border border-gray-800 p-8 rounded-xl"
                    >
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-2">Request Received</h3>
                                <p className="text-gray-400">Our logistics officer will be in touch shortly.</p>
                                <button onClick={() => setSubmitted(false)} className="mt-6 text-yellow-500 underline text-sm">Send another request</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Send className="w-4 h-4 text-yellow-500" /> Quick Inquiry
                                </h3>
                                <div>
                                    <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Contact Name</label>
                                    <input type="text" required className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-yellow-600 focus:outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Company Name</label>
                                    <input type="text" required className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-yellow-600 focus:outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Email Address</label>
                                    <input type="email" required className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-yellow-600 focus:outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Estimated Monthly Volume (lbs)</label>
                                    <select className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-yellow-600 focus:outline-none transition-colors">
                                        <option>5-10 lbs (Small Team)</option>
                                        <option>10-25 lbs (Growing Agency)</option>
                                        <option>25-50 lbs (Corporate Dept)</option>
                                        <option>50+ lbs (Enterprise)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Additional Notes</label>
                                    <textarea className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-yellow-600 focus:outline-none transition-colors h-24" placeholder="Specific roast preferences or delivery schedules..."></textarea>
                                </div>
                                <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 rounded uppercase tracking-wider transition-all mt-4">
                                    Request Quote
                                </button>
                            </form>
                        )}
                    </motion.div>

                    {/* Content / Video */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-6"
                    >
                        <div className="bg-gray-900 border border-gray-800 p-1 rounded-xl overflow-hidden aspect-video relative group cursor-pointer">
                            {/* Placeholder for YouTube Embed */}
                            <div className="absolute inset-0 bg-black flex items-center justify-center">
                                <span className="text-gray-500 font-mono text-xs">[VIDEO EMBED: Why Coffee Boosts Productivity]</span>
                            </div>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Coffee className="w-5 h-5 text-yellow-500" />
                                Why Wolfpack Coffee?
                            </h3>
                            <ul className="space-y-3 text-sm text-gray-300">
                                <li className="flex gap-3">
                                    <span className="text-yellow-500 font-bold">01.</span>
                                    High-Caffeine Robusta blends for maximum focus.
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-yellow-500 font-bold">02.</span>
                                    Ethically sourced from independent growers.
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-yellow-500 font-bold">03.</span>
                                    Roasted fresh weekly to ensure peak flavor.
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default Wholesale;
