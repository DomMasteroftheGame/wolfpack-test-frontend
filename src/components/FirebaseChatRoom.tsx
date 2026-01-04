import React, { useState, useEffect, useRef } from 'react';
import { useFirebaseChat } from '../hooks/useFirebaseChat';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface FirebaseChatRoomProps {
    path: string; // e.g. "chats/userA_userB" or "packs/pack123/messages"
    title: string;
    isPack?: boolean;
}

export const FirebaseChatRoom: React.FC<FirebaseChatRoomProps> = ({ path, title, isPack }) => {
    const { messages, sendMessage, loading } = useFirebaseChat(path);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input);
            setInput('');
        }
    };

    const containerStyle = isPack
        ? "border-2 border-yellow-500 rounded-lg p-4 bg-black text-white shadow-[0_0_15px_rgba(234,179,8,0.3)]"
        : "border border-gray-700 p-2 bg-[#0a0a0a] text-green-500 rounded-lg";

    return (
        <div className={`${containerStyle} flex flex-col h-[500px]`}>
            <div className="border-b border-gray-800 pb-2 mb-2 font-bold uppercase tracking-wider">
                {isPack ? '🐺 ' : '💬 '} {title}
            </div>

            <div className="flex-1 overflow-y-auto mb-2 pr-2" ref={scrollRef}>
                {loading && <div className="text-xs text-gray-500">Connecting secure line...</div>}

                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUser?.firebase_uid;
                    return (
                        <div key={msg.id} className={`mb-2 flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] rounded px-2 py-1 text-sm ${isMe
                                ? (isPack ? 'bg-yellow-900/50 text-yellow-100' : 'bg-green-900/30 text-green-100')
                                : (isPack ? 'bg-gray-800 text-gray-200' : 'bg-gray-900 text-gray-300')
                                }`}>
                                {!isMe && <span className="text-[10px] opacity-70 block mb-0.5">{msg.senderName}</span>}
                                {msg.text}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-2">
                <input
                    className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-yellow-500 text-white"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                />
                <Button
                    size="sm"
                    onClick={handleSend}
                    variant={isPack ? "default" : "secondary"}
                    className={isPack ? "bg-yellow-600 hover:bg-yellow-700 text-black font-bold" : "bg-green-700 hover:bg-green-800 text-white"}
                >
                    SEND
                </Button>
            </div>
        </div>
    );
};
