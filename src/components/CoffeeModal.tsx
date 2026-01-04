import React, { useState } from 'react';
import { matchmakerApi } from '../api';

interface CoffeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    wolfName: string;
    coordinates?: number[][]; // Array of [long, lat]
}

const CoffeeModal: React.FC<CoffeeModalProps> = ({ isOpen, onClose, wolfName, coordinates }) => {
    const [step, setStep] = useState<'schedule' | 'location' | 'confirm'>('schedule');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        setStep('confirm');
        setTimeout(() => {
            onClose();
            setStep('schedule');
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-bunker border border-wolf rounded-xl w-full max-w-sm shadow-[0_0_50px_rgba(202,138,4,0.2)] overflow-hidden relative">

                {/* Header */}
                <div className="bg-wolf/10 p-4 border-b border-wolf/20 flex justify-between items-center">
                    <h2 className="text-wolf font-black uppercase tracking-widest text-sm">Initiate Protocol: Coffee</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
                </div>

                <div className="p-6">
                    {step === 'schedule' && (
                        <div className="space-y-4 animate-in slide-in-from-right duration-300">
                            <h3 className="text-white text-lg font-bold">Coordinate Sync with <span className="text-wolf">{wolfName}</span></h3>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Date Code</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:border-wolf outline-none font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Time Vector</label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:border-wolf outline-none font-mono"
                                />
                            </div>
                            <button
                                onClick={() => setStep('location')}
                                disabled={!date || !time}
                                className="w-full bg-wolf text-black font-bold uppercase tracking-widest py-3 rounded mt-4 hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next: Location
                            </button>
                        </div>
                    )}

                    {step === 'location' && (
                        <div className="space-y-4 animate-in slide-in-from-right duration-300">
                            <h3 className="text-white text-lg font-bold">Select Deployment Zone</h3>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Venue / Coordinates</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g. Starbucks, Sector 7"
                                        className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:border-wolf outline-none pl-10"
                                    />
                                    <span className="absolute left-3 top-3 text-gray-500">📍</span>
                                </div>
                            </div>
                            <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded text-xs text-blue-400">
                                <span className="font-bold">INTEL:</span> {wolfName} is currently 0.8km away.
                            </div>

                            {coordinates && coordinates.length > 0 && (
                                <button
                                    onClick={async () => {
                                        try {
                                            // Call Backend Venue Logic (Gemini)
                                            const token = ''; // Auth context needed
                                            const data = await matchmakerApi.findVenue(token, coordinates);
                                            if (data.name) setLocation(`${data.name} (${data.address})`);
                                        } catch (e) {
                                            console.error(e);
                                            setLocation("Sector 7 (Manual Override)");
                                        }
                                    }}
                                    className="w-full py-2 bg-gray-800 border border-gray-600 text-gray-300 text-xs uppercase font-bold hover:bg-gray-700 rounded mb-2"
                                >
                                    📡 Scan for Independent Venue (Gemini)
                                </button>
                            )}
                            <button
                                onClick={handleConfirm}
                                disabled={!location}
                                className="w-full bg-wolf text-black font-bold uppercase tracking-widest py-3 rounded mt-4 hover:bg-gold transition-colors shadow-[0_0_20px_rgba(202,138,4,0.4)] disabled:opacity-50"
                            >
                                Confirm Rendezvous
                            </button>
                        </div>
                    )}

                    {step === 'confirm' && (
                        <div className="text-center py-8 animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500">
                                <span className="text-2xl">✓</span>
                            </div>
                            <h3 className="text-white text-xl font-black uppercase tracking-tight mb-2">Protocol Active</h3>
                            <p className="text-gray-400 text-sm">Invite sent to encrypted channel.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoffeeModal;
