import React, { useState } from 'react';
import { useLocation } from '../contexts/LocationContext';
import { useNearbyPlayers, NearbyPlayer } from '../hooks/useNearbyPlayers';
import { useCoffeeIntel } from '../hooks/useCoffeeIntel';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import ProfileCard from '../components/ProfileCard';
import ChatWindow from '../components/ChatWindow';
import CreatePackForm from '../components/CreatePackForm';
import MyPackView from '../components/MyPackView';
import { chatApi, packApi } from '../api';

const RadarPage: React.FC = () => {
    const { location, error: locationError } = useLocation();
    const [scanRadius, setScanRadius] = useState(50); // KM
    const nearby = useNearbyPlayers(scanRadius);
    const intel = useCoffeeIntel();
    const { currentUser } = useAuth();
    const [selectedPlayer, setSelectedPlayer] = useState<NearbyPlayer | null>(null);

    // Chat State
    const [activeChat, setActiveChat] = useState<{ chatId: string; recipientId: string; recipientName: string } | null>(null);

    // Pack State
    const [myPacks, setMyPacks] = useState<any[]>([]);
    const [loadingPacks, setLoadingPacks] = useState(false);

    const players = nearby.players;

    // Fetch Packs on load
    React.useEffect(() => {
        const fetchPacks = async () => {
            if (!currentUser) return;
            setLoadingPacks(true);
            try {
                const token = localStorage.getItem('auth_token') || '';
                const packs = await packApi.getMyPacks(token);
                setMyPacks(packs);
            } catch (e) {
                console.error("Failed to fetch packs", e);
            } finally {
                setLoadingPacks(false);
            }
        };
        fetchPacks();
    }, [currentUser]);

    const handleCreatePackSuccess = (newPack: any) => {
        setMyPacks([newPack, ...myPacks]);
    };

    const handleLeavePack = async (packId: string) => {
        if (!currentUser) return;
        try {
            const token = localStorage.getItem('auth_token') || '';
            await packApi.leavePack(token, packId);
            setMyPacks(myPacks.filter(p => p._id !== packId));
        } catch (e) {
            console.error(e);
            alert("Failed to leave pack.");
        }
    };

    const handleChat = async (playerId: string) => {
        if (!selectedPlayer || !currentUser) return;

        try {
            const token = localStorage.getItem('auth_token') || '';
            const response = await chatApi.startChat(token, playerId, selectedPlayer.name);
            if (response.chatId) {
                setActiveChat({
                    chatId: response.chatId,
                    recipientId: playerId,
                    recipientName: selectedPlayer.name
                });
                setSelectedPlayer(null); // Close profile card
            }
        } catch (e) {
            console.error("Failed to start chat", e);
            alert("Secure channel connection failed.");
        }
    };

    const handlePackChat = (packId: string, packName: string) => {
        const chatId = `pack_${packId}`;
        setActiveChat({
            chatId,
            recipientId: packId,
            recipientName: packName
        });
    };

    // Helper to format current user for ChatWindow prop
    const chatUser = currentUser ? { uid: currentUser.id || currentUser.firebase_uid, displayName: currentUser.name || 'Wolf' } : null;

    return (
        <div className="container mx-auto p-4 max-w-4xl pb-24 relative">
            {/* Popups */}
            {selectedPlayer && (
                <>
                    <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setSelectedPlayer(null)} />
                    <ProfileCard
                        player={selectedPlayer}
                        onClose={() => setSelectedPlayer(null)}
                        onChat={handleChat}
                    />
                </>
            )}

            {activeChat && chatUser && (
                <ChatWindow
                    chatId={activeChat.chatId}
                    currentUser={chatUser}
                    recipientId={activeChat.recipientId}
                    recipientName={activeChat.recipientName}
                    onClose={() => setActiveChat(null)}
                />
            )}

            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Tactical Radar & Intel</h1>
                    <p className="text-muted-foreground">
                        Monitor nearby operative and secure locations.
                    </p>
                </div>

                <Tabs defaultValue="radar" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                        <TabsTrigger value="radar">Perimeter Scan</TabsTrigger>
                        <TabsTrigger value="intel">Homebase Intel</TabsTrigger>
                        <TabsTrigger value="pack">Wolfpack</TabsTrigger>
                    </TabsList>

                    <TabsContent value="radar" className="mt-6 space-y-6">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center text-white">
                                    <span>Status: {location ? 'Online' : 'Acquiring Signal...'}</span>
                                    <Badge variant={location ? "default" : "destructive"}>
                                        {location ? 'GPS ACTIVE' : 'NO SIGNAL'}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative aspect-square max-w-sm mx-auto bg-slate-950 rounded-full border-4 border-slate-800 flex items-center justify-center overflow-hidden mb-6">
                                    {/* Radar Rings */}
                                    <div className="absolute w-[80%] h-[80%] border border-slate-800 rounded-full opacity-50 animate-pulse"></div>
                                    <div className="absolute w-[60%] h-[60%] border border-slate-800 rounded-full opacity-50 animate-pulse delay-75"></div>
                                    <div className="absolute w-[40%] h-[40%] border border-slate-800 rounded-full opacity-50 animate-pulse delay-150"></div>

                                    {/* Scanner Sweep */}
                                    <div className="absolute w-full h-full bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-[spin_3s_linear_infinite]"></div>

                                    {/* Me */}
                                    <div className="absolute w-4 h-4 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)] z-10"></div>

                                    {/* Nearby Players Dots */}
                                    {players.map((p, i) => (
                                        <div
                                            key={p.id}
                                            className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping cursor-pointer hover:scale-150 transition-transform z-20"
                                            style={{
                                                top: `${50 + (Math.sin(p.name.length) * 35)}%`,
                                                left: `${50 + (Math.cos(p.name.length) * 35)}%`,
                                                animationDuration: '2s'
                                            }}
                                            title={p.name}
                                            onClick={() => setSelectedPlayer(p)}
                                        />
                                    ))}
                                </div>

                                <div className="flex justify-center gap-4 mb-4">
                                    <Button
                                        variant={scanRadius === 10 ? "default" : "outline"}
                                        onClick={() => setScanRadius(10)}
                                        size="sm"
                                    >10 km</Button>
                                    <Button
                                        variant={scanRadius === 50 ? "default" : "outline"}
                                        onClick={() => setScanRadius(50)}
                                        size="sm"
                                    >50 km</Button>
                                    <Button
                                        variant={scanRadius === 100 ? "default" : "outline"}
                                        onClick={() => setScanRadius(100)}
                                        size="sm"
                                    >100 km</Button>
                                </div>

                                {locationError && (
                                    <div className="text-red-400 text-center mb-4 text-sm bg-red-900/20 p-2 rounded">
                                        {locationError}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {players.length === 0 && !nearby.loading && (
                                <div className="col-span-full text-center py-10 text-slate-500">
                                    No active operatives found in this sector.
                                </div>
                            )}

                            {players.map((player) => (
                                <Card
                                    key={player.id}
                                    className="bg-slate-900 border-slate-800 hover:border-cyan-500/50 transition-colors cursor-pointer"
                                    onClick={() => setSelectedPlayer(player)}
                                >
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`} />
                                            <AvatarFallback>{player.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-bold text-white">{player.name}</h3>
                                            <p className="text-xs text-cyan-400">
                                                {typeof player.distance === 'number' ? player.distance.toFixed(1) : player.distance || '?'} km away
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="intel" className="mt-6">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white">Recommended Meeting Points (Coffee)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {intel.loading && <div className="text-center p-4">Decrypting Intel...</div>}
                                {intel.error && <div className="text-red-400 p-4">{intel.error}</div>}

                                <div className="grid gap-4 md:grid-cols-2">
                                    {intel.coffeeShops.map((shop, i) => (
                                        <div key={i} className="flex flex-col p-4 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-lg text-amber-500">{shop.name}</h3>
                                                {shop.rating && (
                                                    <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                                                        ★ {shop.rating}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-400 mb-2">{shop.formattedAddress}</p>
                                            <div className="mt-auto flex justify-between items-center text-xs">
                                                <span className={shop.openNow ? "text-green-400" : "text-red-400"}>
                                                    {shop.openNow ? "OPEN NOW" : "CLOSED"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="pack" className="mt-6">
                        {loadingPacks ? (
                            <div className="text-center text-slate-400 p-8">Loading Pack Data...</div>
                        ) : myPacks.length > 0 && currentUser ? (
                            <div className="space-y-6">
                                {myPacks.map(pack => (
                                    <MyPackView
                                        key={pack._id}
                                        pack={pack}
                                        currentUserId={currentUser.id || currentUser.firebase_uid}
                                        onLeave={() => handleLeavePack(pack._id)}
                                        onChat={handlePackChat}
                                    />
                                ))}
                            </div>
                        ) : (
                            <CreatePackForm
                                token={localStorage.getItem('auth_token') || ''}
                                onSuccess={handleCreatePackSuccess}
                            />
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default RadarPage;
