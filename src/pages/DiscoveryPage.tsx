import React, { useState, useEffect } from 'react';
import { useNearbyPlayers, NearbyPlayer } from '../hooks/useNearbyPlayers';
import { SwipeCard } from '../components/SwipeCard';
import { Button } from '@/components/ui/button';
import { db } from '../firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const DiscoveryPage: React.FC = () => {
    const { players: nearbyPlayers, loading } = useNearbyPlayers(50); // 50km
    const [stack, setStack] = useState<NearbyPlayer[]>([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (nearbyPlayers.length > 0) {
            // Filter out self if necessary, though useNearbyPlayers logic might keep it
            // Ideally backend query filters self, but client filter is fine for MVP
            const filtered = nearbyPlayers.filter(p => !currentUser?.firebase_uid || p.id !== currentUser.firebase_uid);
            setStack(filtered);
        }
    }, [nearbyPlayers, currentUser]);

    const handleSwipe = async (direction: 'left' | 'right', profileId: string) => {
        // Remove card from stack
        const profile = stack.find(p => p.id === profileId);
        setStack(prev => prev.filter(p => p.id !== profileId));

        if (direction === 'right' && currentUser?.firebase_uid && profile) {
            // Create Friend/Connect Request
            console.log(`Swiped right on ${profile.name}`);
            try {
                // Path: friend_requests/{targetId}/{myId}
                // We store the request in the target's subcollection or a root collection
                // Let's use root `connections` or `friend_requests`
                const reqRef = doc(db, 'friend_requests', profile.id, 'received', currentUser.firebase_uid);
                await setDoc(reqRef, {
                    from: {
                        id: currentUser.firebase_uid,
                        name: currentUser.name || "Unknown",
                        // photo: currentUser.photoURL 
                    },
                    status: 'pending',
                    timestamp: serverTimestamp()
                });

                // Also maybe add to my "sent"
                await setDoc(doc(db, 'friend_requests', currentUser.firebase_uid, 'sent', profile.id), {
                    to: { id: profile.id, name: profile.name },
                    status: 'pending',
                    timestamp: serverTimestamp()
                });

            } catch (err) {
                console.error("Error sending connection request:", err);
            }
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md h-[calc(100vh-80px)] overflow-hidden flex flex-col">
            <h1 className="text-2xl font-bold text-white mb-4 text-center">Discovery</h1>

            <div className="flex-1 relative w-full">
                {loading && <div className="text-center text-slate-500 mt-20">Scanning sector...</div>}

                {!loading && stack.length === 0 && (
                    <div className="text-center text-slate-500 mt-20 flex flex-col items-center">
                        <p className="mb-4">No more profiles in this area.</p>
                        <Button variant="outline" onClick={() => window.location.reload()}>Refresh Radar</Button>
                    </div>
                )}

                {/* Render stack - we only need to render the top few for performance, 
                    but rendering all in reverse order stacks them correctly visually */}
                {stack.map((profile) => (
                    <SwipeCard
                        key={profile.id}
                        profile={profile}
                        onSwipe={handleSwipe}
                    />
                ))}
            </div>

            <div className="h-20 flex items-center justify-center text-slate-500 text-sm">
                Swipe Right to Connect • Swipe Left to Pass
            </div>
        </div>
    );
};

export default DiscoveryPage;
