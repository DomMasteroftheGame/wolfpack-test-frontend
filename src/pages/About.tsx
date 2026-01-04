import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 bg-black min-h-screen text-white">
        <h1 className="text-5xl font-black text-white uppercase mb-8 text-center tracking-tighter">THE MANIFESTO</h1>
        
        <div className="prose prose-invert prose-lg mx-auto">
            <p className="text-xl text-yellow-600 font-serif italic mb-8 border-l-4 border-yellow-600 pl-4">
                "The strength of the wolf is the pack, and the strength of the pack is the wolf."
            </p>

            <p>
                We didn't start The Wolfpack to sell coffee. We started it to fuel a mindset.
            </p>
            <p>
                In a world of noise, shortcuts, and mediocrity, we are the signal. We build for the builders. We roast for the restless. We support the ones who are up at 4 AM not because they have to be, but because they have a vision that won't let them sleep.
            </p>
            
            <h3 className="text-white font-bold mt-8 mb-4 uppercase tracking-widest">Why The Game?</h3>
            <p>
                Business is the ultimate infinite game. There is no winning, there is only staying in the game. We built our PWA training ground to sharpen your instincts. Fail there so you can win out here.
            </p>

            <h3 className="text-white font-bold mt-8 mb-4 uppercase tracking-widest">The Roast</h3>
            <p>
                Ethically sourced. Dark roasted. High caffeine. No fluff. Just the fuel you need to execute on your strategy.
            </p>

            <div className="mt-12 text-center">
                <div className="relative group inline-block">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-red-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <img src="/images/TheArchitect.jpg" alt="The Architect" className="relative w-full max-w-2xl h-auto object-cover rounded-xl mb-4 grayscale hover:grayscale-0 transition-all duration-700 border border-gray-800" />
                </div>
                <p className="text-sm text-gray-500 uppercase tracking-widest mt-4">The Architect // Est. 2024</p>
            </div>
        </div>
    </div>
  );
};

export default About;
