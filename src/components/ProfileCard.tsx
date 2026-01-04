import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { NearbyPlayer } from '../hooks/useNearbyPlayers';

interface ProfileCardProps {
    player: NearbyPlayer;
    onClose: () => void;
    onChat: (playerId: string) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ player, onClose, onChat }) => {
    return (
        <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 z-50 bg-slate-900 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-slate-400 hover:text-white"
            >
                ✕
            </button>
            <CardHeader className="flex flex-col items-center pb-2">
                <Avatar className="w-20 h-20 border-2 border-cyan-500 mb-2">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`} />
                    <AvatarFallback>{player.name[0]}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-white text-xl">{player.name}</CardTitle>
                <div className="flex gap-2 mt-1">
                    <Badge variant="secondary" className="bg-slate-800 text-cyan-400 border-slate-700">
                        {player.role || 'Operative'}
                    </Badge>
                    <Badge variant="outline" className="text-amber-500 border-amber-500">
                        {player.ivp} IVP
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="text-center space-y-3">
                <p className="text-sm text-slate-300 italic">
                    "{player.bio || 'Ready for action.'}"
                </p>

                {player.wolfType && player.wolfType !== 'unknown' && (
                    <div className="text-xs text-slate-500 uppercase tracking-widest">
                        Archetype: {player.wolfType}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
                <Button variant="outline" className="flex-1 w-full" onClick={onClose}>
                    Dismiss
                </Button>
                <Button className="flex-1 w-full bg-cyan-600 hover:bg-cyan-700 text-white" onClick={() => onChat(player.id)}>
                    Message
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProfileCard;
