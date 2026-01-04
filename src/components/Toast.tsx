import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    onUndo?: () => void;
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onUndo, onClose, duration = 5000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="fixed bottom-6 right-6 z-[200] animate-in slide-in-from-bottom duration-300">
            <div className="bg-gray-900 border-l-4 border-yellow-500 text-white px-6 py-4 rounded shadow-2xl flex items-center gap-4 min-w-[300px]">
                <div className="flex-1">
                    <div className="font-bold uppercase tracking-widest text-xs text-yellow-500 mb-1">Notification</div>
                    <div className="text-sm font-mono">{message}</div>
                </div>
                {onUndo && (
                    <button
                        onClick={onUndo}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border border-gray-600 transition-colors"
                    >
                        Undo
                    </button>
                )}
                <button onClick={onClose} className="text-gray-500 hover:text-white ml-2">✕</button>
            </div>
        </div>
    );
};

export default Toast;
