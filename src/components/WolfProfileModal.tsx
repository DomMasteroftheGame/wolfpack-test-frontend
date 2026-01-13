import React, { useState, useEffect, useRef } from 'react';
import { MatchProfile, User, Message } from '../types';
import { io, Socket } from 'socket.io-client';
import GhostBar from './GhostBar';
import { Shield, Zap, Star, MessageSquare, Info, Activity, X } from 'lucide-react';

interface WolfProfileModalProps {
    wolf: MatchProfile;
    currentUser: User;
    onClose: () => void;
    onSchedule: (wolf: MatchProfile) => void;
}

const getRoleConfig = (role: string | null | undefined) => {
    switch (role) {
        case 'labor': return {
            label: 'The Builder',
            icon: '🛠️',
            colors: {
                text: 'text-red-500',
                bg: 'bg-red-500',
                border: 'border-red-600',
                glow: 'shadow-[0_0_30px_rgba(220,38,38,0.3)]',
                gradient: 'from-red-900/80 to-black'
            }
        };
        case 'finance': return {
            label: 'The Capital',
            icon: '💰',
            colors: {
                text: 'text-green-500',
                bg: 'bg-green-500',
                border: 'border-green-600',
                glow: 'shadow-[0_0_30px_rgba(22,163,74,0.3)]',
                gradient: 'from-green-900/80 to-black'
            }
        };
        case 'sales': return {
            label: 'The Connector',
            icon: '🤝',
            colors: {
                text: 'text-blue-500',
                bg: 'bg-blue-500',
                border: 'border-blue-600',
                glow: 'shadow-[0_0_30px_rgba(37,99,235,0.3)]',
                gradient: 'from-blue-900/80 to-black'
            }
        };
        default: return {
            label: 'Wolf',
            icon: '🐺',
            colors: {
                text: 'text-gray-400',
                bg: 'bg-gray-500',
                border: 'border-gray-600',
                glow: 'shadow-[0_0_30px_rgba(107,114,128,0.3)]',
                gradient: 'from-gray-900 to-black'
            }
        };
    }
};

const WolfProfileModal: React.FC<WolfProfileModalProps> = ({ wolf, currentUser, onClose, onSchedule }) => {
    const [tab, setTab] = useState<'details' | 'chat' | 'rate'>('details');
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const config = getRoleConfig(wolf.role);

    const [showCelebration, setShowCelebration] = useState(false);

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        const msgContent = newMessage;
        setNewMessage('');
        // Optimistic update
        setMessages(prev => [...prev, { fromId: currentUser._id || 'me', toId: wolf.id, content: msgContent, timestamp: new Date().toISOString() }]);
    };

    const handleSchedule = (wolf: MatchProfile) => {
        setShowCelebration(true);
        setTimeout(() => {
            setShowCelebration(false);
            onSchedule(wolf);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
            {/* TRADING CARD CONTAINER */}
            <div className={`relative w-full max-w-sm rounded-xl overflow-hidden border-2 ${config.colors.border} ${config.colors.glow} flex flex-col bg-black transition-all duration-300`}>

                {/* Holographic Header Effect */}
                <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${config.colors.gradient} opacity-50 pointer-events-none`} />

                {/* Card Header */}
                <div className="relative p-6 pt-8 flex flex-col items-center z-10">
                    <div className={`w-24 h-24 rounded-full border-4 ${config.colors.border} overflow-hidden shadow-2xl mb-4 bg-black`}>
                        <img src={wolf.avatar} alt={wolf.name} className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">{wolf.name}</h2>
                    <div className={`px-3 py-1 bg-black/60 border ${config.colors.border} rounded-full text-xs font-bold uppercase tracking-widest ${config.colors.text} flex items-center gap-2`}>
                        <span className="text-lg">{config.icon}</span>
                        <span>{config.label}</span>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Visual Action Tabs */}
                <div className="flex border-t border-b border-gray-800 bg-gray-900/50 backdrop-blur">
                    <button 
                        onClick={() => setTab('details')} 
                        className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${tab === 'details' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                        aria-label="Details"
                    >
                        <Info size={18} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Intel</span>
                    </button>
                    <button 
                        onClick={() => setTab('chat')} 
                        className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${tab === 'chat' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                        aria-label="Chat"
                    >
                        <MessageSquare size={18} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Comms</span>
                    </button>
                    <button 
                        onClick={() => setTab('rate')} 
                        className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${tab === 'rate' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                        aria-label="Rate"
                    >
                        <Activity size={18} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Rate</span>
                    </button>
                </div>

                {/* Content Area */}
                <div className="h-[350px] bg-black p-6 overflow-y-auto custom-scrollbar relative">

                    {/* Background Texture */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

                    {tab === 'details' && (
                        <div className="space-y-6 relative z-10">
                            <div className="text-center">
                                <p className="text-white italic font-serif text-lg leading-relaxed">"{wolf.tagline}"</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-900/50 p-3 rounded border border-gray-800 flex flex-col items-center text-center">
                                    <span className="text-xl mb-1">📍</span>
                                    <h3 className="text-gray-500 text-[9px] uppercase font-bold">Base</h3>
                                    <p className="text-white text-xs font-mono">{wolf.location}</p>
                                </div>
                                <div className="bg-gray-900/50 p-3 rounded border border-gray-800 flex flex-col items-center text-center">
                                    <span className="text-xl mb-1">📏</span>
                                    <h3 className="text-gray-500 text-[9px] uppercase font-bold">Range</h3>
                                    <p className="text-white text-xs font-mono">{wolf.distance}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-800 pt-4">
                                <h3 className="text-gray-500 text-[9px] uppercase font-bold mb-3 text-center">Power Stats</h3>
                                <div className="space-y-2">
                                    <GhostBar label="Build" selfScore={wolf.stats.build - 5} publicScore={wolf.stats.build} color="red" />
                                    <GhostBar label="Fund" selfScore={wolf.stats.fund - 2} publicScore={wolf.stats.fund} color="green" />
                                    <GhostBar label="Connect" selfScore={wolf.stats.connect + 3} publicScore={wolf.stats.connect} color="blue" />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    id="signal-button"
                                    onClick={() => {
                                        // Signal Logic (Mock)
                                        alert(`Signal sent to ${wolf.name}. They will see you on their radar.`);
                                    }}
                                    className="flex-1 border border-gold text-gold font-bold uppercase tracking-widest py-4 rounded hover:bg-gold/10 transition-colors flex items-center justify-center gap-2 animate-pulse"
                                >
                                    <span className="text-xl">📡</span>
                                    <span>Signal</span>
                                </button>
                                
                                <button
                                    onClick={() => handleSchedule(wolf)}
                                    className="flex-[2] bg-gold hover:bg-yellow-500 text-black font-black uppercase tracking-widest py-4 rounded shadow-[0_0_15px_rgba(202,138,4,0.3)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 relative overflow-hidden"
                                >
                                    <span className="text-xl">☕</span>
                                    <span>Coffee Protocol</span>
                                    {showCelebration && (
                                        <div className="absolute inset-0 bg-white/50 animate-pulse flex items-center justify-center">
                                            <span className="text-2xl animate-bounce">🎉 PACK FORMED 🎉</span>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {tab === 'chat' && (
                        <div className="flex flex-col h-full relative z-10">
                            <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
                                {messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-600 opacity-50">
                                        <span className="text-4xl mb-2">🔒</span>
                                        <span className="text-xs uppercase tracking-widest">End-to-End Encrypted</span>
                                    </div>
                                )}
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.fromId === currentUser._id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-3 text-xs ${msg.fromId === currentUser._id ? 'bg-white text-black rounded-l-lg rounded-tr-lg' : 'bg-gray-800 text-gray-200 rounded-r-lg rounded-tl-lg'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>
                            <div className="flex gap-2 pt-2 border-t border-gray-800">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Message..."
                                    className="flex-1 bg-gray-900 border border-gray-700 rounded p-2 text-white text-xs focus:border-white outline-none font-mono"
                                />
                                <button onClick={handleSend} className="bg-white text-black px-3 rounded font-bold hover:bg-gray-200">➤</button>
                            </div>
                        </div>
                    )}

                    {tab === 'rate' && (
                        <div className="h-full flex flex-col justify-center items-center text-center relative z-10">
                            <h3 className="text-white font-bold uppercase tracking-widest mb-1">Wolf Math</h3>
                            <p className="text-gray-500 text-xs mb-6 max-w-[200px]">Rate your interaction to update the global ledger.</p>

                            <div className="w-full space-y-5 px-4">
                                <div className="group">
                                    <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500 mb-1 group-hover:text-white transition-colors items-center">
                                        <div className="flex items-center gap-2">
                                            <Shield size={14} className="text-blue-500" />
                                            <span>Trust</span>
                                        </div>
                                        <span className="text-gold font-mono">50</span>
                                    </div>
                                    <input type="range" min="0" max="100" className="w-full accent-white bg-gray-800 h-1 rounded-lg appearance-none cursor-pointer" />
                                </div>

                                <div className="group">
                                    <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500 mb-1 group-hover:text-white transition-colors items-center">
                                        <div className="flex items-center gap-2">
                                            <Star size={14} className="text-yellow-500" />
                                            <span>Skill</span>
                                        </div>
                                        <span className="text-gold font-mono">50</span>
                                    </div>
                                    <input type="range" min="0" max="100" className="w-full accent-white bg-gray-800 h-1 rounded-lg appearance-none cursor-pointer" />
                                </div>

                                <div className="group">
                                    <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500 mb-1 group-hover:text-white transition-colors items-center">
                                        <div className="flex items-center gap-2">
                                            <Zap size={14} className="text-purple-500" />
                                            <span>Vibe</span>
                                        </div>
                                        <span className="text-gold font-mono">50</span>
                                    </div>
                                    <input type="range" min="0" max="100" className="w-full accent-white bg-gray-800 h-1 rounded-lg appearance-none cursor-pointer" />
                                </div>

                                <button className="w-full bg-white text-black py-3 rounded uppercase text-[10px] font-black tracking-widest hover:bg-gray-200 mt-4 flex items-center justify-center gap-2">
                                    <span>⛓️</span>
                                    <span>Submit to Blockchain</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WolfProfileModal;
