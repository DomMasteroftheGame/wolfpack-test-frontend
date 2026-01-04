import React, { useState } from 'react';

interface TacticalDropProps {
    title?: string;
    text?: string;
    url?: string;
    onSuccess?: () => void;
    onError?: (error: any) => void;
}

export const TacticalDrop: React.FC<TacticalDropProps> = ({
    title = "Join the Wolfpack",
    text = "Detailed intel on my active operation. Need backup.",
    url = window.location.href,
    onSuccess,
    onError
}) => {
    const [status, setStatus] = useState<'idle' | 'dropping' | 'success' | 'failed'>('idle');

    const handleDrop = async () => {
        if (navigator.share) {
            setStatus('dropping');
            try {
                await navigator.share({
                    title,
                    text,
                    url
                });
                setStatus('success');
                if (onSuccess) onSuccess();
                setTimeout(() => setStatus('idle'), 2000);
            } catch (error) {
                console.error('Error sharing:', error);
                setStatus('failed');
                if (onError) onError(error);
                setTimeout(() => setStatus('idle'), 2000);
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(url);
                setStatus('success');
                setTimeout(() => setStatus('idle'), 2000);
                alert("Tactical Link Copied to Clipboard (Share not supported)"); // Simple fallback
            } catch (err) {
                setStatus('failed');
            }
        }
    };

    return (
        <button
            onClick={handleDrop}
            disabled={status === 'dropping'}
            className={`
                relative overflow-hidden group px-6 py-2 rounded font-bold font-mono tracking-wider uppercase text-xs transition-all
                ${status === 'success' ? 'bg-green-600 text-white border-green-400' : 'bg-yellow-600 text-black border-yellow-400 hover:bg-yellow-500'}
                border shadow-lg
            `}
        >
            <span className="relative z-10 flex items-center gap-2">
                {status === 'idle' && (
                    <>
                        <span>🚀</span> TACTICAL DROP
                    </>
                )}
                {status === 'dropping' && "DEPLOYING..."}
                {status === 'success' && (
                    <>
                        <span>✅</span> DROPPED
                    </>
                )}
                {status === 'failed' && "JAMMED"}
            </span>

            {/* Glitch Effect on Hover (CSS based ideally, keeping simple here) */}
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 transform skew-x-12"></div>
        </button>
    );
};
