import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useChat } from '../hooks/useChat';

interface ChatWindowProps {
    chatId: string;
    currentUser: { uid: string; displayName: string };
    recipientName: string;
    recipientId: string;
    onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
    chatId,
    currentUser,
    recipientName,
    recipientId,
    onClose
}) => {
    const { messages, loading, sendMessage } = useChat(currentUser.uid, chatId);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        await sendMessage(chatId, newMessage, currentUser.uid, currentUser.displayName, recipientId);
        setNewMessage('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <Card className="fixed bottom-4 right-4 w-96 h-[500px] flex flex-col shadow-2xl z-50 bg-slate-900 border-cyan-500/50">
            <CardHeader className="py-3 bg-slate-800 rounded-t-lg flex flex-row items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${recipientName}`} />
                        <AvatarFallback>{recipientName[0]}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-sm font-bold text-white">
                        {recipientName}
                    </CardTitle>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {loading && <div className="text-center text-xs text-slate-500">Connecting encryped line...</div>}

                {messages.length === 0 && !loading && (
                    <div className="text-center text-slate-500 text-sm mt-10">
                        Start the conversation with {recipientName}.
                    </div>
                )}

                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.uid;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${isMe
                                        ? 'bg-cyan-600 text-white rounded-br-none'
                                        : 'bg-slate-700 text-slate-100 rounded-bl-none'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    );
                })}
            </CardContent>

            <CardFooter className="p-3 bg-slate-800 border-t border-slate-700">
                <div className="flex w-full gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="bg-slate-900 border-slate-600 text-white"
                    />
                    <Button onClick={handleSend} size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                        ➤
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default ChatWindow;
