import React, { useState, useEffect } from 'react';
import { Message, MatchProfile, User } from '../../types';
import { API_BASE_URL } from '../../constants';
// Helper function defined here or imported. For now duplicating small helper to keep isolated or we can make a shared helper file.
// Ideally should be in a utils file but to match user provided logic quickly:
const getRoleConfig = (role: string | null | undefined) => {
    switch (role) {
        case 'labor': return {
            label: 'The Builder',
            icon: '🛠️',
            grindAction: 'Commit Code',
            colors: { text: 'text-red-500', bg: 'bg-red-500', bgActive: 'bg-red-900/40', border: 'border-red-600', hoverBorder: 'group-hover:border-red-500', shadow: 'shadow-red-500/20' }
        };
        case 'finance': return {
            label: 'The Capital',
            icon: '💰',
            grindAction: 'Review P&L',
            colors: { text: 'text-green-500', bg: 'bg-green-500', bgActive: 'bg-green-900/40', border: 'border-green-600', hoverBorder: 'group-hover:border-green-500', shadow: 'shadow-green-500/20' }
        };
        case 'sales': return {
            label: 'The Connector',
            icon: '🤝',
            grindAction: 'Cold Call',
            colors: { text: 'text-blue-500', bg: 'bg-blue-500', bgActive: 'bg-blue-900/40', border: 'border-blue-600', hoverBorder: 'group-hover:border-blue-500', shadow: 'shadow-blue-500/20' }
        };
        default: return {
            label: 'Unassigned',
            icon: '❓',
            grindAction: 'Grind',
            colors: { text: 'text-gray-500', bg: 'bg-gray-500', bgActive: 'bg-gray-900/40', border: 'border-gray-600', hoverBorder: 'group-hover:border-gray-500', shadow: 'shadow-gray-500/20' }
        };
    }
};

export const WolfProfileModal = ({
    wolf,
    currentUser,
    onClose
}: {
    wolf: MatchProfile,
    currentUser: User,
    onClose: () => void
}) => {
    const [tab, setTab] = useState<'details' | 'chat' | 'rate'>('details');
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [ratings, setRatings] = useState({ trust: 50, skill: 50, vibe: 50 });

    const config = getRoleConfig(wolf.role);

    useEffect(() => {
        if (tab === 'chat') {
            fetch(`${API_BASE_URL}/api/messages/history?userId=${currentUser._id}&otherId=${wolf.id}`)
                .then(res => res.json())
                .then(setMessages)
                .catch(() => { });
        }
    }, [tab, wolf.id, currentUser._id]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        const tempId = Math.random().toString();
        const msg = { id: tempId, fromId: currentUser._id, toId: wolf.id, content: newMessage, timestamp: new Date().toISOString() };
        setMessages([...messages, msg]);
        setNewMessage('');

        await fetch(`${API_BASE_URL}/api/messages/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fromId: currentUser._id, toId: wolf.id, content: msg.content })
        });
    };

    const handleRate = async () => {
        await fetch(`${API_BASE_URL}/api/ratings/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fromId: currentUser._id, toId: wolf.id, ...ratings })
        });
        alert('Rating submitted privately.');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className={`bg-gray-900 border-2 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col h-[600px] ${config.colors.border}`}>
                {/* Header */}
                <div className="p-4 bg-gray-800 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <img src={wolf.avatar} className="w-10 h-10 rounded-full" />
                        <div>
                            <h3 className="font-bold text-white">{wolf.name}</h3>
                            <div className="text-[10px] uppercase font-bold text-gray-500">{config.label}</div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 text-xl">✕</button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-700 bg-gray-800/50">
                    <button onClick={() => setTab('details')} className={`flex-1 py-3 text-xs font-bold uppercase ${tab === 'details' ? 'text-white border-b-2 border-yellow-500' : 'text-gray-500'}`}>Profile</button>
                    <button onClick={() => setTab('chat')} className={`flex-1 py-3 text-xs font-bold uppercase ${tab === 'chat' ? 'text-white border-b-2 border-yellow-500' : 'text-gray-500'}`}>Chat</button>
                    <button onClick={() => setTab('rate')} className={`flex-1 py-3 text-xs font-bold uppercase ${tab === 'rate' ? 'text-white border-b-2 border-yellow-500' : 'text-gray-500'}`}>Rate (Private)</button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-900 relative">
                    {tab === 'details' && (
                        <div className="space-y-4">
                            <div className="p-3 bg-gray-800 rounded-lg">
                                <h4 className="text-gray-500 text-xs uppercase font-bold mb-1">Tagline</h4>
                                <p className="text-white italic">"{wolf.tagline}"</p>
                            </div>
                            <div className="p-3 bg-gray-800 rounded-lg">
                                <h4 className="text-gray-500 text-xs uppercase font-bold mb-1">Location</h4>
                                <p className="text-white">{wolf.location || wolf.distance}</p>
                            </div>
                            <div className="p-3 bg-gray-800 rounded-lg">
                                <h4 className="text-gray-500 text-xs uppercase font-bold mb-1">Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {wolf.skills.map(s => <span key={s} className="bg-gray-700 px-2 py-1 rounded text-xs text-white">{s}</span>)}
                                </div>
                            </div>
                            {wolf.linkedin && (
                                <a href={wolf.linkedin} target="_blank" className="block text-center bg-blue-700 text-white py-2 rounded font-bold text-sm">View LinkedIn</a>
                            )}
                        </div>
                    )}

                    {tab === 'chat' && (
                        <div className="flex flex-col h-full">
                            <div className="flex-1 space-y-3 overflow-y-auto mb-4 pr-1">
                                {messages.length === 0 && <div className="text-gray-500 text-xs text-center mt-10">Start the conversation...</div>}
                                {messages.map(m => (
                                    <div key={m.id} className={`flex ${m.fromId === currentUser._id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-2 rounded-lg text-sm ${m.fromId === currentUser._id ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2 mt-auto">
                                <input
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                    className="flex-1 bg-gray-800 border border-gray-600 rounded p-2 text-white text-sm"
                                    placeholder="Type message..."
                                />
                                <button onClick={handleSend} className="bg-blue-600 text-white px-3 rounded font-bold">&gt;</button>
                            </div>
                        </div>
                    )}

                    {tab === 'rate' && (
                        <div className="space-y-6 pt-4">
                            <p className="text-gray-400 text-xs text-center italic">Ratings are private and only impact global scores.</p>
                            {['Trust', 'Skill', 'Vibe'].map(metric => (
                                <div key={metric}>
                                    <div className="flex justify-between text-xs font-bold text-gray-300 mb-2">
                                        <span>{metric}</span>
                                        <span>{ratings[metric.toLowerCase() as keyof typeof ratings]}</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="100"
                                        value={ratings[metric.toLowerCase() as keyof typeof ratings]}
                                        onChange={e => setRatings({ ...ratings, [metric.toLowerCase()]: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            ))}
                            <button onClick={handleRate} className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold uppercase tracking-wider mt-4">
                                Submit Rating
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
