import React, { useState } from 'react';

interface Option {
    id: string;
    name: string;
    vibe: string;
    rating: number;
    address: string;
    distance: string;
}

interface NeutralGroundBannerProps {
    channelId: string;
}

const NeutralGroundBanner: React.FC<NeutralGroundBannerProps> = ({ channelId }) => {
    const [scanning, setScanning] = useState(false);
    const [options, setOptions] = useState<Option[]>([]);
    const [votedId, setVotedId] = useState<string | null>(null);

    const startScan = async () => {
        setScanning(true);
        try {
            const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/channels/${channelId}/neutral-ground`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await resp.json();
            setOptions(data.options);
        } catch (err) {
            console.error('Scan failed', err);
        } finally {
            setScanning(false);
        }
    };

    const castVote = (id: string) => {
        setVotedId(id);
        // In a real app, this would send a socket message "tactical_vote"
    };

    return (
        <div className="bg-[#111] border border-yellow-500/50 rounded-lg p-4 mb-4 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500 shadow-[0_0_10px_#eab308]"></div>

            <div className="flex justify-between items-center mb-3">
                <div>
                    <h4 className="text-yellow-500 font-bold text-sm uppercase tracking-[2px]">Neutral Ground Protocol</h4>
                    <p className="text-gray-500 text-[10px]">Optimizing pack rendezvous via Centroid Logic.</p>
                </div>
                <button
                    onClick={startScan}
                    disabled={scanning}
                    className="bg-yellow-500 text-black text-[10px] font-black px-3 py-1.5 rounded uppercase hover:bg-yellow-400 transition-colors disabled:opacity-50"
                >
                    {scanning ? 'SCANNING...' : 'SCAN NEUTRAL GROUND'}
                </button>
            </div>

            {options.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    {options.map((opt) => (
                        <div
                            key={opt.id}
                            className={`border ${votedId === opt.id ? 'border-yellow-500 bg-yellow-500/10' : 'border-gray-800'} p-3 rounded transition-all cursor-pointer hover:border-yellow-500/50`}
                            onClick={() => castVote(opt.id)}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-white font-bold text-xs">{opt.name}</span>
                                <span className="text-yellow-500 text-[10px] font-bold">★ {opt.rating}</span>
                            </div>
                            <p className="text-gray-400 text-[10px] mb-2">{opt.vibe}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-gray-500">{opt.distance}</span>
                                {votedId === opt.id ? (
                                    <span className="text-yellow-500 text-[9px] font-black uppercase">TACTICAL VOTE CAST</span>
                                ) : (
                                    <span className="text-gray-600 text-[9px] font-black uppercase group-hover:text-yellow-500">VOTE</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {votedId && (
                <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
                    <span className="text-[10px] text-gray-400">CONSENSUS RECOGNIZED. PROTOCOL COMPLETE.</span>
                    <button className="text-yellow-500 text-[10px] font-bold flex items-center gap-1 hover:underline">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        SYNC TO CALENDAR
                    </button>
                </div>
            )}
        </div>
    );
};

export default NeutralGroundBanner;
