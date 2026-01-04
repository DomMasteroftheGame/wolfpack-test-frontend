import React, { useState } from 'react';

interface InviteWolfModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInvite: (email: string) => void;
}

const InviteWolfModal: React.FC<InviteWolfModalProps> = ({ isOpen, onClose, onInvite }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('sending');
        // Simulate network delay for "Beacon" effect
        setTimeout(() => {
            onInvite(email);
            setStatus('sent');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setEmail('');
            }, 1500);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-yellow-600/50 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden relative">

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                    ✕
                </button>

                <div className="p-8 text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                        <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">📡</span>
                        {status === 'sending' && (
                            <div className="absolute inset-0 rounded-full border-2 border-yellow-500 animate-ping opacity-75"></div>
                        )}
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-wider">Deploy Beacon</h2>
                    <p className="text-gray-400 text-sm mb-6">Values aligned. Mission critical. <br />Invite a new Wolf to your pack.</p>

                    {status === 'sent' ? (
                        <div className="text-green-500 font-bold uppercase tracking-widest animate-pulse">
                            Signal Lock Established
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email-input" className="sr-only">Email Address</label>
                                <input
                                    id="email-input"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="operative@example.com"
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white text-center focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
                                    autoFocus
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!email || status === 'sending'}
                                className={`w-full py-3 rounded-lg font-bold uppercase tracking-widest shadow-lg transition-all ${email ? 'bg-yellow-600 text-black hover:bg-yellow-500 hover:scale-[1.02]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {status === 'sending' ? 'Transmitting...' : 'Send Invite'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer Decor */}
                <div className="h-1 bg-gradient-to-r from-transparent via-yellow-600/50 to-transparent"></div>
            </div>
        </div>
    );
};

export default InviteWolfModal;
