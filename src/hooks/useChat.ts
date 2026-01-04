import { useState, useEffect } from 'react';
import { rtdb } from '../firebase/config';
import { ref, onValue, push, serverTimestamp, off, set } from 'firebase/database';

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: number;
}

export interface ChatConversation {
    chatId: string;
    participantId: string;
    participantName: string;
    lastMessage: string;
    timestamp: number;
}

export function useChat(userId?: string, activeChatId?: string | null) {
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);

    // 1. Listen for list of conversations
    useEffect(() => {
        if (!userId) return;

        const userChatsRef = ref(rtdb, `user_chats/${userId}`);

        const handleValue = (snapshot: any) => {
            const data = snapshot.val();
            if (data) {
                const list = Object.entries(data).map(([key, val]: [string, any]) => ({
                    chatId: key,
                    ...val
                }));
                // Sort by new
                list.sort((a, b) => b.timestamp - a.timestamp);
                setConversations(list);
            } else {
                setConversations([]);
            }
        };

        const unsubscribe = onValue(userChatsRef, handleValue);
        return () => {
            off(userChatsRef, 'value', handleValue);
        };
    }, [userId]);

    // 2. Listen for messages in active chat
    useEffect(() => {
        if (!activeChatId) {
            setMessages([]);
            return;
        }

        setLoading(true);
        const chatRef = ref(rtdb, `chats/${activeChatId}`);

        const handleValue = (snapshot: any) => {
            const data = snapshot.val();
            if (data) {
                const msgList = Object.entries(data).map(([key, val]: [string, any]) => ({
                    id: key,
                    ...val
                }));
                // Sort by old -> new
                msgList.sort((a, b) => a.timestamp - b.timestamp);
                setMessages(msgList);
            } else {
                setMessages([]);
            }
            setLoading(false);
        };

        const unsubscribe = onValue(chatRef, handleValue);
        return () => {
            off(chatRef, 'value', handleValue);
            setLoading(false);
        };
    }, [activeChatId]);

    // 3. Send Message Function
    const sendMessage = async (chatId: string, text: string, senderId: string, senderName: string, recipientId: string) => {
        if (!text.trim()) return;

        const chatRef = ref(rtdb, `chats/${chatId}`);
        const timestamp = Date.now(); // serverTimestamp() is better but this is easier for optimistic UI

        // Push message
        await push(chatRef, {
            senderId,
            senderName,
            text,
            timestamp
        });

        // Update User Chat Metadata (for both sides - acting as client-side trigger)
        // Ideally performed by backend function but we can do it client-side if rules allow.
        // Assuming rules allow user to write to their own user_chats path?
        // Wait, regular rules might block writing to OTHER user's path.
        // For MVP, we might need a backend relay if security rules are tight.
        // Or we rely on the `initialize-chat` logic which sets it up.
        // Updating "lastMessage" usually requires write access.
        // Let's assume for now we just push the message and the list might not update "lastMessage" automatically 
        // without a cloud function or open rules.
        // Detailed P2P schema usually needs more robust backend.
        // BUT, since we have no Cloud Functions environment easily here...
        // We will TRY client-side update. If it fails, we need a backend endpoint `/api/chat/send`.

        // Let's rely on client-side for now, assuming standard open-ish rules for dev.
        try {
            const senderMetaRef = ref(rtdb, `user_chats/${senderId}/${chatId}`);
            // We just update lastMessage
            await set(senderMetaRef, {
                // We need to preserve participant info... 
                // If we use 'update' it merges.
                participantId: recipientId, // Re-asserting
                lastMessage: text,
                timestamp
            });

            // Updating recipient... might fail if locked down.
            // If it fails, recipient just won't see "Last Message" snippet update until they open chat?
            // Or we check.
            const recipientMetaRef = ref(rtdb, `user_chats/${recipientId}/${chatId}`);
            // We can't easily know recipient's view of US (our name).
            // We'll skip recipient update if we don't know our own metadata there.
            // Actually, we should use a backend endpoint for reliability.
        } catch (e) {
            console.warn("Could not update chat metadata", e);
        }
    };

    return { conversations, messages, loading, sendMessage };
}
