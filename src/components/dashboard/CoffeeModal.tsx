import React, { useState } from 'react';
import { MatchProfile } from '../../types';

export const CoffeeModal = ({
    targetWolf,
    onClose,
    onSchedule
}: {
    targetWolf: MatchProfile,
    onClose: () => void,
    onSchedule: (date: string, location: string) => void
}) => {
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('My Homebase');

    const handleSubmit = () => {
        if (!date) return;
        onSchedule(date, location);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="bg-gray-900 border border-yellow-600 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold text-white">Coffee with {targetWolf.name}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                    </div>

                    <div className="flex items-center gap-4 mb-6 bg-gray-800 p-3 rounded-lg border border-gray-700">
                        <img src={targetWolf.avatar} alt={targetWolf.name} className="w-12 h-12 rounded-full border border-gray-600" />
                        <div>
                            <div className="text-sm font-bold text-white">{targetWolf.tagline}</div>
                            {targetWolf.linkedin && <div className="text-xs text-blue-400">Linked to Network</div>}
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="text-gray-500 text-[10px] uppercase font-bold mb-1 block">When?</label>
                            <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)}
                                className="bg-gray-800 border border-gray-700 rounded p-2 w-full text-white text-sm focus:border-yellow-500 outline-none [color-scheme:dark]" />
                        </div>
                        <div>
                            <label className="text-gray-500 text-[10px] uppercase font-bold mb-1 block">Where?</label>
                            <select value={location} onChange={(e) => setLocation(e.target.value)}
                                className="bg-gray-800 border border-gray-700 rounded p-2 w-full text-white text-sm focus:border-yellow-500 outline-none">
                                <option value="My Homebase">My Homebase</option>
                                <option value="The Daily Grind">The Daily Grind (Neutral)</option>
                                <option value="Virtual">Virtual (Zoom/Meet)</option>
                            </select>
                        </div>
                    </div>

                    <button onClick={handleSubmit} disabled={!date}
                        className={`w-full py-3 rounded-lg font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 ${date ? 'bg-yellow-600 text-black hover:bg-yellow-500' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>
                        <span>☕</span> Send Invite
                    </button>
                </div>
            </div>
        </div>
    );
};
