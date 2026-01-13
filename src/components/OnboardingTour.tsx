import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowUp, ArrowDown, X, Check } from 'lucide-react';

interface Step {
  targetId: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const TOUR_STEPS: Step[] = [
  {
    targetId: 'phase-tabs-container',
    title: 'Progressive Phases',
    content: 'The 40-step journey is broken into 4 Phases. Complete Phase 1 to unlock the next level.',
    position: 'bottom'
  },
  {
    targetId: 'kanban-board-container',
    title: 'Tactical Board',
    content: 'Drag tasks from "THE HUNT" to "THE CHASE" to start working. Move to "THE FEAST" to score points.',
    position: 'center'
  },
  {
    targetId: 'signal-button',
    title: 'Signal Interest',
    content: 'Introvert-friendly networking. Ping potential pack members without the pressure of a meeting.',
    position: 'top'
  },
  {
    targetId: 'dom-bubble',
    title: 'Dom (Your Coach)',
    content: 'Dom watches your progress. He will roast you if you slack off, and praise you if you ship.',
    position: 'left'
  }
];

export const OnboardingTour: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    // Only show on Game/Dashboard page
    if (location !== '/game') return;

    const hasSeenTour = localStorage.getItem('wolfpack_tour_seen');
    if (!hasSeenTour) {
      // Small delay to ensure UI renders
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, [location]);

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('wolfpack_tour_seen', 'true');
  };

  if (!isVisible) return null;

  const step = TOUR_STEPS[currentStepIndex];
  const targetElement = document.getElementById(step.targetId);
  
  // Default position if target not found
  let style: React.CSSProperties = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  };

  if (targetElement) {
    const rect = targetElement.getBoundingClientRect();
    const PADDING = 20;

    switch (step.position) {
      case 'bottom':
        style = { top: rect.bottom + PADDING, left: rect.left + rect.width / 2, transform: 'translateX(-50%)' };
        break;
      case 'top':
        style = { top: rect.top - PADDING, left: rect.left + rect.width / 2, transform: 'translate(-50%, -100%)' };
        break;
      case 'left':
        style = { top: rect.top + rect.height / 2, left: rect.left - PADDING, transform: 'translate(-100%, -50%)' };
        break;
      case 'right':
        style = { top: rect.top + rect.height / 2, left: rect.right + PADDING, transform: 'translate(0, -50%)' };
        break;
      case 'center':
      default:
        style = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
        break;
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-auto">
      {/* Dark Overlay with Hole (Simplified as full dark for now, can be SVG mask later) */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleComplete}></div>

      {/* Spotlight Highlight (Optional, if target exists) */}
      {targetElement && (
        <div 
          className="absolute border-2 border-gold shadow-[0_0_30px_rgba(255,215,0,0.5)] rounded transition-all duration-500 ease-in-out"
          style={{
            top: targetElement.getBoundingClientRect().top - 5,
            left: targetElement.getBoundingClientRect().left - 5,
            width: targetElement.getBoundingClientRect().width + 10,
            height: targetElement.getBoundingClientRect().height + 10,
          }}
        />
      )}

      {/* Tooltip Card */}
      <div 
        className="absolute w-80 bg-[#1a1a1a] border border-gold text-white p-6 rounded-xl shadow-2xl transition-all duration-500 ease-in-out"
        style={style}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-black text-gold uppercase tracking-widest">{step.title}</h3>
          <button onClick={handleComplete} className="text-gray-500 hover:text-white">
            <X size={16} />
          </button>
        </div>
        
        <p className="text-sm text-gray-300 mb-6 leading-relaxed font-mono">
          {step.content}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {TOUR_STEPS.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full ${idx === currentStepIndex ? 'bg-gold' : 'bg-gray-700'}`}
              />
            ))}
          </div>
          
          <button 
            onClick={handleNext}
            className="bg-gold text-black px-4 py-2 rounded font-bold text-xs uppercase tracking-widest hover:bg-yellow-400 transition-colors flex items-center gap-2"
          >
            {currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
            {currentStepIndex === TOUR_STEPS.length - 1 ? <Check size={14} /> : <ArrowDown size={14} className="-rotate-90" />}
          </button>
        </div>
      </div>
    </div>
  );
};
