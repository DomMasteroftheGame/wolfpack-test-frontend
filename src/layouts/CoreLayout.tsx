import React from 'react';
import MainNav from '../components/MainNav';
import BottomNav from '../components/BottomNav';
import LiveTicker from '../components/LiveTicker';

interface CoreLayoutProps {
    children: React.ReactNode;
}

const CoreLayout = ({ children }: CoreLayoutProps) => {
    console.log("🐺 CORE LAYOUT RENDERING...");
    return (
        <div className="wolfpack-dark h-full flex flex-col pb-20 pt-24 overflow-y-auto overflow-x-hidden min-h-screen relative text-white font-sans selection:bg-yellow-500/30">
            {/* CINEMATIC OVERLAYS */}
            <div className="bg-noise pointer-events-none fixed inset-0 z-0 opacity-20"></div>
            <div className="bg-grid pointer-events-none fixed inset-0 z-0 opacity-20"></div>

            <MainNav />

            <main className="container mx-auto px-4 py-6 flex-grow relative z-10">
                {children}
            </main>

            {/* Live Ticker - Heads Up Display */}
            {/* Positioned above bottom nav on mobile (bottom-16), at bottom on desktop */}
            <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-[40]">
                <LiveTicker logs={[]} />
            </div>

            <div className="md:hidden">
                <BottomNav />
            </div>
        </div>
    );
};

export default CoreLayout;
