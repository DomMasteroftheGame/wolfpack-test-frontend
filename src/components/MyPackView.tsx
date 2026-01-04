import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface MyPackViewProps {
    pack: any;
    currentUserId: string;
    onLeave: () => void;
    onChat: (packId: string, packName: string) => void;
}

const MyPackView: React.FC<MyPackViewProps> = ({ pack, currentUserId, onLeave, onChat }) => {
    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-white text-2xl">{pack.name}</CardTitle>
                    <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                        {pack.members.length} Operatives
                    </Badge>
                </div>
                <p className="text-slate-400 italic">"{pack.mission || 'No mission defined.'}"</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Roster</h3>
                    <div className="grid gap-2">
                        {pack.members.map((memberId: string, i: number) => (
                            <div key={memberId} className="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800">
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs text-white">
                                    {/* Avatar placeholder */}
                                    OP
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-white">
                                        {memberId === currentUserId ? 'You (Alpha)' : `Operative ${memberId.slice(-4)}`}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {memberId === pack.alpha_id ? 'Pack Leader' : 'Member'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                    onClick={() => onChat(pack._id, pack.name)}
                >
                    Open Secure Channel
                </Button>
                <Button
                    variant="destructive"
                    className="bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-900"
                    onClick={onLeave}
                >
                    Leave Pack
                </Button>
            </CardFooter>
        </Card>
    );
};

export default MyPackView;
