import React from 'react';
import { Task } from '../types';
import { motion } from 'framer-motion';
import { Hammer, Ruler, Brain, Flame, Clock } from 'lucide-react';

interface KanbanCardProps {
    task: Task;
    onClick: () => void;
}

// SECTOR COLORS (Aligned with Master Architect)
const SECTOR_COLORS = {
    build: { border: 'border-yellow-500', text: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: <Hammer size={14} /> },
    measure: { border: 'border-cyan-500', text: 'text-cyan-500', bg: 'bg-cyan-500/10', icon: <Ruler size={14} /> },
    learn: { border: 'border-pink-500', text: 'text-pink-500', bg: 'bg-pink-500/10', icon: <Brain size={14} /> },
};

export const KanbanCard: React.FC<KanbanCardProps> = ({ task, onClick }) => {
    // Determine phase based on step number if not explicit, or default to 'build'
    let phase = task.phase || 'build';
    const stepNumber = task.step_number || 1;
    if (!task.phase) {
        if (stepNumber > 14) phase = 'measure';
        if (stepNumber > 28) phase = 'learn';
    }

    const style = SECTOR_COLORS[phase as keyof typeof SECTOR_COLORS] || SECTOR_COLORS.build;
    
    // High Heat Logic (If heatLevel > 7, show red pulse)
    const heatLevel = task.heatLevel || (task.pace === 'run' ? 9 : task.pace === 'walk' ? 5 : 2);
    const isHighHeat = heatLevel > 7;

    return (
        <motion.div
            layoutId={task.id}
            onClick={onClick}
            className={`
                relative p-4 rounded-lg border-l-4 bg-gray-900/80 backdrop-blur-sm
                hover:bg-gray-800 transition-all cursor-pointer group mb-3
                ${style.border}
                ${isHighHeat ? 'shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse-slow' : ''}
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Header: Phase Icon & Title */}
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <span className={`p-1 rounded ${style.bg} ${style.text}`}>
                        {style.icon}
                    </span>
                    <h3 className="text-sm font-bold text-white line-clamp-2 group-hover:text-gold transition-colors">
                        {task.title}
                    </h3>
                </div>
                {isHighHeat && <Flame size={14} className="text-red-500 animate-pulse" />}
            </div>

            {/* Body: Description Preview */}
            <p className="text-[10px] text-gray-400 mb-3 line-clamp-2 font-mono">
                {task.description || "No mission briefing provided."}
            </p>

            {/* Footer: Stats & Heat Meter */}
            <div className="flex items-center justify-between border-t border-gray-800 pt-2">
                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                    <Clock size={12} />
                    <span>{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No Intel'}</span>
                </div>
                
                {/* Visual Heat Meter */}
                <div className="flex items-center gap-1" title={`Heat Level: ${heatLevel}/10`}>
                    <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <div 
                                key={i} 
                                className={`w-1 h-3 rounded-sm ${
                                    i < Math.ceil(heatLevel / 2) 
                                        ? (isHighHeat ? 'bg-red-500' : 'bg-gold') 
                                        : 'bg-gray-800'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
