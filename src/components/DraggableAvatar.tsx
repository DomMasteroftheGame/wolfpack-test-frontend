import React from 'react';
import { MatchProfile } from '../types';

interface DraggableAvatarProps {
    wolf: MatchProfile;
}

export const DraggableAvatar: React.FC<DraggableAvatarProps> = ({ wolf }) => {
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('wolfId', wolf.id);
        e.dataTransfer.setData('wolfName', wolf.name);
        if (wolf.avatar) {
            e.dataTransfer.setData('wolfAvatar', wolf.avatar);
        }
        e.dataTransfer.setData('wolfRole', wolf.role || 'labor'); // Pass role for badges
        e.dataTransfer.effectAllowed = 'copy';
        
        // Create a custom drag image (optional, but looks better)
        const dragIcon = document.createElement('div');
        dragIcon.innerText = '🐺';
        dragIcon.style.fontSize = '24px';
        document.body.appendChild(dragIcon);
        e.dataTransfer.setDragImage(dragIcon, 0, 0);
        setTimeout(() => document.body.removeChild(dragIcon), 0);
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 cursor-grab active:cursor-grabbing group transition-colors"
            title={`Drag to assign ${wolf.name}`}
        >
            <div className="w-8 h-8 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center overflow-hidden group-hover:border-gold transition-colors">
                {wolf.avatar ? (
                    <img src={wolf.avatar} alt={wolf.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-xs font-bold text-gray-400 group-hover:text-gold">{wolf.name.substring(0, 2).toUpperCase()}</span>
                )}
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-300 group-hover:text-white">{wolf.name}</span>
                <span className="text-[10px] text-gray-500">{wolf.role || 'Wolf'}</span>
            </div>
        </div>
    );
};
