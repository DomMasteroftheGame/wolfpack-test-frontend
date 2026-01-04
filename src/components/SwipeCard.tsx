import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SwipeCardProps {
    profile: any;
    onSwipe: (direction: 'left' | 'right', profileId: string) => void;
}

export function SwipeCard({ profile, onSwipe }: SwipeCardProps) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-30, 30]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Visual indicators for swipe
    const likeOpacity = useTransform(x, [10, 100], [0, 1]);
    const nopeOpacity = useTransform(x, [-100, -10], [1, 0]);

    const handleDragEnd = (_: any, info: PanInfo) => {
        if (info.offset.x > 100) {
            onSwipe('right', profile.id);
        } else if (info.offset.x < -100) {
            onSwipe('left', profile.id);
        }
    };

    return (
        <motion.div
            style={{ x, rotate, opacity, position: 'absolute', top: 0, left: 0, right: 0, width: '100%', height: '100%' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="cursor-grab active:cursor-grabbing"
        >
            <Card className="h-full bg-slate-900 border-slate-800 overflow-hidden shadow-xl">
                <div className="relative h-full flex flex-col">
                    {/* Image Half */}
                    <div className="h-3/5 bg-slate-950 relative overflow-hidden">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`}
                            alt={profile.name}
                            className="w-full h-full object-cover"
                        />

                        {/* Swipe Overlay Indicators */}
                        <motion.div style={{ opacity: likeOpacity }} className="absolute top-4 right-4 border-4 border-green-500 rounded-lg p-2 transform rotate-12">
                            <span className="text-4xl font-bold text-green-500">CONNECT</span>
                        </motion.div>
                        <motion.div style={{ opacity: nopeOpacity }} className="absolute top-4 left-4 border-4 border-red-500 rounded-lg p-2 transform -rotate-12">
                            <span className="text-4xl font-bold text-red-500">PASS</span>
                        </motion.div>
                    </div>

                    {/* Info Half */}
                    <CardContent className="h-2/5 p-6 flex flex-col justify-end bg-gradient-to-t from-slate-900 to-slate-900/90">
                        <div className="mb-4">
                            <h2 className="text-3xl font-bold text-white mb-1">{profile.name}</h2>
                            <p className="text-cyan-400 font-medium">Lat/Lng: {profile.position?.lat?.toFixed(2) || '0.00'}, {profile.position?.lng?.toFixed(2) || '0.00'}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline" className="text-amber-400 border-amber-400">Founder</Badge>
                            <Badge variant="outline" className="text-purple-400 border-purple-400">Tech</Badge>
                            <Badge variant="outline" className="text-blue-400 border-blue-400">{Math.round(profile.distance)}km Away</Badge>
                        </div>

                        <p className="text-slate-400 line-clamp-3">
                            {profile.bio || "Building the next big thing. Let's build a wolfpack."}
                        </p>
                    </CardContent>
                </div>
            </Card>
        </motion.div>
    );
}
