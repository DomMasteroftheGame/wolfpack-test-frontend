import React from 'react';
import { motion } from 'framer-motion';
import { Play, ShoppingCart } from 'lucide-react';
import MainNav from '../components/MainNav';
import BottomNav from '../components/BottomNav';

const videos = [
    {
        id: 1,
        title: "How to Stay Focused During a Launch",
        thumbnail: "https://images.unsplash.com/photo-1497215728101-856f4ea42174",
        youtubeId: "Bey4XXJAqS8", // Placeholder: Simon Sinek
        productLink: "/shop/hustle-roast"
    },
    {
        id: 2,
        title: "The Strategy of the Infinite Game",
        thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978",
        youtubeId: "tye5tSheO8k", // Placeholder: Infinite Game
        productLink: "/shop/strategic-blend"
    },
    {
        id: 3,
        title: "Building Your First 100 True Fans",
        thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
        youtubeId: "GNkeD59dfyg", // Placeholder: 1000 True Fans
        productLink: "/shop/community-roast"
    }
];

const Watch: React.FC = () => {
    const [selectedVideo, setSelectedVideo] = React.useState<string | null>(null);

    return (
        <div className="min-h-screen bg-black text-white pb-20 md:pb-0 relative">
            <MainNav />

            {selectedVideo && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedVideo(null)}>
                    <div className="w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            <div className="pt-24 px-4 max-w-7xl mx-auto">
                <h1 className="text-5xl font-black italic tracking-tighter text-white mb-2">
                    THE <span className="text-blue-500">MISSION</span> LOG
                </h1>
                <p className="text-gray-400 font-mono text-sm uppercase tracking-widest mb-12">
                    Intelligence Reports & Strategy Sessions
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map((video) => (
                        <motion.div
                            key={video.id}
                            whileHover={{ y: -5 }}
                            className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group"
                        >
                            <div
                                className="aspect-video relative bg-black cursor-pointer"
                                onClick={() => setSelectedVideo(video.youtubeId)}
                            >
                                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                                        <Play className="w-5 h-5 text-white fill-white ml-1" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-4 line-clamp-2">{video.title}</h3>

                                <button
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-gray-800 hover:bg-yellow-600 hover:text-black border border-gray-700 hover:border-yellow-600 rounded text-sm font-bold uppercase tracking-wider transition-all"
                                    onClick={() => window.location.href = video.productLink}
                                >
                                    <ShoppingCart className="w-4 h-4" /> Shop The Coffee
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default Watch;
