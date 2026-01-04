import { useEffect, useState } from 'react';
import { rtdb } from '../firebase/config';
import { ref, onValue, push, set, serverTimestamp, query, limitToLast, orderByChild } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: number;
}

export function useFirebaseChat(chatPath: string) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!chatPath) return;

        setLoading(true);
        const messagesRef = query(ref(rtdb, chatPath), orderByChild('timestamp'), limitToLast(50));

        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const msgList = Object.entries(data).map(([key, val]: [string, any]) => ({
                    id: key,
                    ...val
                }));
                setMessages(msgList);
            } else {
                setMessages([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [chatPath]);

    const sendMessage = async (text: string) => {
        if (!currentUser || !text.trim()) return;

        const messagesRef = ref(rtdb, chatPath);
        const newMsgRef = push(messagesRef);

        await set(newMsgRef, {
            senderId: currentUser.firebase_uid,
            senderName: currentUser.name || 'Unknown',
            text: text,
            timestamp: serverTimestamp() // RTDB timestamp placeholder
        });
    };

    return { messages, sendMessage, loading };
}
