import React, { useState, useEffect, useRef } from 'react';

interface Message {
    id: string;
    user_id: string;
    user_name: string;
    content: string;
    timestamp: string;
}

interface ChatRoomProps {
    channelId: string;
    channelType: 'pack' | 'territory';
    channelName: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ channelId, channelType, channelName }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isPack = channelType === 'pack';

    useEffect(() => {
        // Scroll to bottom
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const userId = localStorage.getItem('user_id') || 'anonymous';
        const wsUrl = `${import.meta.env.VITE_WS_URL}/ws?user_id=${userId}&channel_id=${channelId}`;
        const newSocket = new WebSocket(wsUrl);

        newSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'chat_message') {
                setMessages((prev) => [...prev, data.data]);
            } else if (data.type === 'neutral_ground_options') {
                // Handle Gemini options
                console.log('Gemini Options:', data.data);
            }
        };

        setSocket(newSocket);

        // Fetch history
        fetch(`${import.meta.env.VITE_API_URL}/api/channels/${channelId}/history`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => res.json())
            .then(data => setMessages(data))
            .catch(err => console.error('Failed to fetch history', err));

        return () => newSocket.close();
    }, [channelId]);

    const sendMessage = () => {
        if (!input.trim() || !socket) return;

        const msg = {
            type: 'chat_message',
            data: {
                channel_id: channelId,
                content: input
            }
        };

        socket.send(JSON.stringify(msg));
        setInput('');
    };

    const packStyles = {
        container: "border-2 border-yellow-500 rounded-lg p-4 bg-black text-white shadow-[0_0_15px_rgba(234,179,8,0.3)]",
        bubble: "bg-gray-800 rounded-2xl p-3 mb-2 max-w-[80%]",
        font: "font-sans",
        header: "text-yellow-500 font-bold uppercase tracking-wider mb-4 border-b border-yellow-500/30 pb-2"
    };

    const territoryStyles = {
        container: "border border-gray-700 p-2 bg-[#0a0a0a] text-green-500",
        bubble: "mb-0.5",
        font: "font-mono", // JetBrains Mono ideally
        header: "text-gray-400 text-xs mb-2 border-b border-gray-800 pb-1"
    };

    const styles = isPack ? packStyles : territoryStyles;

    return (
        <div className={`${styles.container} ${styles.font} flex flex-col h-[500px]`}>
            <div className={styles.header}>
                {isPack ? '🐺 PACK:' : '📍 TERRITORY:'} {channelName}
            </div>

            <div className="flex-grow overflow-y-auto mb-4 space-y-2 pr-2">
                {messages.map((m) => (
                    <div key={m.id} className={styles.bubble}>
                        {isPack ? (
                            <div>
                                <span className="text-yellow-500 text-xs font-bold mr-2 uppercase">{m.user_name}</span>
                                <p className="text-sm">{m.content}</p>
                                <span className="text-[10px] text-gray-500">{new Date(m.timestamp).toLocaleTimeString()}</span>
                            </div>
                        ) : (
                            <div className="text-xs">
                                <span className="text-gray-500">[{new Date(m.timestamp).toLocaleTimeString()}]</span>
                                <span className="text-white ml-1">&lt;{m.user_name}&gt;</span>
                                <span className="ml-2">{m.content}</span>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2 border-t border-gray-800 pt-3">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder={isPack ? "Message the Pack..." : "Send to stream..."}
                    className="flex-grow bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
                />
                <button
                    onClick={sendMessage}
                    className={`${isPack ? 'bg-yellow-500 text-black' : 'bg-green-600 text-white'} px-4 py-2 rounded text-xs font-bold uppercase transition-opacity hover:opacity-80`}
                >
                    SEND
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;
