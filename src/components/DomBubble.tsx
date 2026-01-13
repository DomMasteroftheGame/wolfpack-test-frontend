import React, { useState, useEffect } from 'react';
import { X, MessageSquare } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useAuth } from '../contexts/AuthContext';

const SNARKY_QUOTES = [
    "Zero tasks done? Are we building a startup or a nap pod?",
    "I've seen sloths with better velocity.",
    "That task isn't going to move itself. Unless it's a Roomba.",
    "Less planning, more doing. You're not a philosopher.",
    "Your burn rate is higher than your completion rate.",
    "Coffee is for closers. You haven't closed anything.",
    "I'd ask for a status update, but I'm afraid of the silence.",
    "Pivot? You haven't even started moving yet.",
    "Networking is great, but have you tried working?",
    "Your kanban board looks like a graveyard of good intentions."
];

const ENCOURAGING_QUOTES = [
    "Finally. A task moved. I was about to call a medic.",
    "One down. A million to go. Don't get cocky.",
    "Not bad. For a rookie.",
    "Keep that momentum. Or don't. I'm not your mom.",
    "See? That wasn't so hard. Now do it again."
];

export const DomBubble: React.FC = () => {
    const { projectTasks } = useProject();
    const { currentUser } = useAuth();
    const [isOpen, setIsOpen] = useState(true);
    const [message, setMessage] = useState("");
    const [mood, setMood] = useState<'neutral' | 'annoyed' | 'impressed'>('neutral');

    useEffect(() => {
        // Analyze Game State
        const completedTasks = projectTasks.filter(t => t.status === 'done').length;
        const inProgressTasks = projectTasks.filter(t => t.status === 'doing').length;
        const totalTasks = projectTasks.length;

        let nextMessage = "";
        let nextMood: 'neutral' | 'annoyed' | 'impressed' = 'neutral';

        if (totalTasks === 0) {
            nextMessage = "An empty board is an empty mind. Add a task.";
            nextMood = 'neutral';
        } else if (completedTasks === 0 && inProgressTasks === 0) {
            nextMessage = SNARKY_QUOTES[Math.floor(Math.random() * SNARKY_QUOTES.length)];
            nextMood = 'annoyed';
        } else if (completedTasks > 0 && Math.random() > 0.7) {
            nextMessage = ENCOURAGING_QUOTES[Math.floor(Math.random() * ENCOURAGING_QUOTES.length)];
            nextMood = 'impressed';
        } else {
            // Default rotation
            const combined = [...SNARKY_QUOTES];
            nextMessage = combined[Math.floor(Math.random() * combined.length)];
            nextMood = 'neutral';
        }

        setMessage(nextMessage);

        // Auto-hide after 10s if not annoyed
        if (nextMood !== 'annoyed') {
            const timer = setTimeout(() => setIsOpen(false), 10000);
            return () => clearTimeout(timer);
        }
    }, [projectTasks.length, currentUser]); // Re-evaluate when tasks change

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-20 right-4 z-50 w-12 h-12 bg-black border border-gold rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:scale-110 transition-transform"
            >
                <span className="text-2xl">🐺</span>
            </button>
        );
    }

    return (
        <div id="dom-bubble" className="fixed bottom-20 right-4 z-50 max-w-xs animate-in slide-in-from-bottom-5 duration-300">
            <div className={`relative bg-black border-2 ${mood === 'annoyed' ? 'border-red-500' : 'border-gold'} p-4 rounded-xl shadow-2xl`}>
                
                {/* Tail */}
                <div className={`absolute -bottom-2 right-6 w-4 h-4 bg-black border-b-2 border-r-2 ${mood === 'annoyed' ? 'border-red-500' : 'border-gold'} transform rotate-45`}></div>

                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full overflow-hidden border ${mood === 'annoyed' ? 'border-red-500' : 'border-gold'}`}>
                            <img src="https://ui-avatars.com/api/?name=Dom&background=000&color=fff" alt="Dom" />
                        </div>
                        <span className={`text-xs font-black uppercase tracking-widest ${mood === 'annoyed' ? 'text-red-500' : 'text-gold'}`}>
                            {mood === 'annoyed' ? 'DOM (ANNOYED)' : 'DOM_AI'}
                        </span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                        <X size={14} />
                    </button>
                </div>

                {/* Message */}
                <p className="text-white text-sm font-mono leading-relaxed">
                    "{message}"
                </p>

                {/* Action Hint */}
                {mood === 'annoyed' && (
                    <div className="mt-3 pt-2 border-t border-gray-800 text-[10px] text-gray-500 uppercase tracking-wider">
                        Action Required: Move a task.
                    </div>
                )}
            </div>
        </div>
    );
};
