import React from 'react';
import { motion } from 'framer-motion';
import { SECTOR_COLORS } from '../data/gameSteps';
import { Task } from '../types';

interface KanbanCardProps {
  task: Task;
  onClick?: () => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ task, onClick }) => {
  // Determine Sector based on step number (mock logic if not explicit)
  const stepNumber = task.step_number || 1;
  let sector: 'BUILD' | 'MEASURE' | 'LEARN' = 'BUILD';
  if (stepNumber > 14) sector = 'MEASURE';
  if (stepNumber > 28) sector = 'LEARN';

  const colorClass = SECTOR_COLORS[sector];
  const heat = task.pace === 'run' ? 9 : task.pace === 'walk' ? 5 : 2; // Mock heat based on pace

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`
        relative bg-gray-900 border-l-4 p-4 mb-3 rounded-r-lg 
        ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]}
        shadow-lg backdrop-blur-sm cursor-pointer group transition-all
      `}
    >
      {/* Header: Step Number & Title */}
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-mono text-gray-400 tracking-widest">
          STEP {stepNumber.toString().padStart(2, '0')}
        </span>
        {heat > 7 && (
          <span className="animate-pulse text-[10px] text-red-500 font-bold border border-red-500/50 px-1 rounded bg-red-500/10">
            ⚠️ HIGH HEAT
          </span>
        )}
      </div>

      <h3 className="text-white font-bold uppercase tracking-wide text-sm mb-3 group-hover:text-gold transition-colors">
        {task.title}
      </h3>

      {/* Footer: Tactical Stats */}
      <div className="mt-2 flex items-center justify-between border-t border-gray-800 pt-2">
        <div className="flex items-center space-x-2">
           {/* "Grind" Indicator */}
           <span className="text-[8px] text-gray-500 font-mono">GRIND</span>
           <div className="h-1.5 w-16 bg-gray-800 rounded-full overflow-hidden">
             <div 
               className={`h-full ${heat > 7 ? 'bg-red-500' : 'bg-white'}`} 
               style={{ width: `${(heat / 10) * 100}%` }} 
             />
           </div>
        </div>
        <button className={`text-[10px] font-mono uppercase ${colorClass.split(' ')[2] || 'text-white'} opacity-0 group-hover:opacity-100 transition-opacity`}>
          [ OPEN INTEL ]
        </button>
      </div>
    </motion.div>
  );
};
