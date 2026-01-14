import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MatchProfile, Task, ViewMode } from '../types';
import { AlphaPitchEditor } from '../components/AlphaPitch';
import RoadmapView from '../components/RoadmapView';
import { WolfSearch } from '../components/WolfSearch';
import { GameboardRadar } from '../components/GameboardRadar';
import KanbanBoard from '../components/KanbanBoard';
import CoffeeMatch from '../components/CoffeeMatch';
import WolfProfileModal from '../components/WolfProfileModal';
import Toast from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';
import { useProject } from '../contexts/ProjectContext';
import { GameHUD } from '../components/GameHUD';
import { OnboardingTour } from '../components/OnboardingTour';
import { DomBubble } from '../components/DomBubble';
import { DraggableAvatar } from '../components/DraggableAvatar';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { updateTask, projectTasks } = useProject();
  
  // State
  const [view, setView] = useState<ViewMode>('kanban'); // Default view for mobile/other tabs
  const [isMirrorMode, setIsMirrorMode] = useState(true); // Desktop Split View Toggle
  const [selectedWolf, setSelectedWolf] = useState<MatchProfile | null>(null);
  const [toast, setToast] = useState<{ message: string; onUndo?: () => void } | null>(null);

  // Redirect if not logged in
  if (!currentUser) {
    return (
      <div className="h-screen w-full bg-void flex flex-col items-center justify-center text-gold font-mono">
        <div className="animate-pulse text-4xl mb-4">🐺</div>
        <div className="tracking-widest">INITIALIZING WOLFPACK OS...</div>
      </div>
    );
  }

  // --- HANDLERS ---
  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask.id, updatedTask);
    } catch (e) {
      console.error("Failed to update task", e);
    }
  };

  const handleRadarClick = (taskId: string) => {
    // In Mirror Mode, scroll to task in Kanban
    // In Mobile, switch to Kanban tab then scroll
    if (!isMirrorMode && window.innerWidth < 768) {
      setView('kanban');
    }
    
    setTimeout(() => {
      const element = document.getElementById(`task-${taskId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-2', 'ring-gold', 'ring-offset-2', 'ring-offset-black');
        setTimeout(() => element.classList.remove('ring-2', 'ring-gold', 'ring-offset-2', 'ring-offset-black'), 2000);
      }
    }, 100);
  };

  const handleViewChange = (newView: ViewMode) => {
      setView(newView);
      // Auto-enable Mirror Mode for Pack/Kanban on desktop
      if (newView === 'pack' || newView === 'kanban') {
          setIsMirrorMode(true);
      } else {
          setIsMirrorMode(false);
      }
  };

  return (
    <div className="min-h-screen bg-void text-white font-mono flex flex-col overflow-hidden">
      
      {/* --- HEADS-UP DISPLAY (HUD) --- */}
      <div id="hud-container">
        <GameHUD currentView={view} onViewChange={handleViewChange} />
      </div>

      {/* --- MAIN LAYOUT --- */}
      <div className="flex-1 flex overflow-hidden relative pt-16">
        
        {/* --- TACTICAL RAIL (Sidebar) --- */}
        <nav className="hidden md:flex w-64 bg-charcoal border-r border-gray-800 flex-col shrink-0 z-40">
          <div className="p-4 space-y-2">
            <NavButton 
              active={view === 'pack' || (isMirrorMode && view === 'kanban')} 
              onClick={() => handleViewChange('pack')} 
              icon="⚔️" 
              label="War Room" 
            />
            <NavButton 
              active={view === 'radar' && !isMirrorMode} 
              onClick={() => handleViewChange('radar')} 
              icon="📡" 
              label="Wolf Search" 
            />
            <NavButton 
              active={view === 'roadmap' && !isMirrorMode} 
              onClick={() => handleViewChange('roadmap')} 
              icon="🗺️" 
              label="Roadmap" 
            />
            <NavButton 
              active={view === 'coffee' && !isMirrorMode} 
              onClick={() => handleViewChange('coffee')} 
              icon="☕" 
              label="Coffee Dates" 
            />
          </div>

          {/* My Pack (Draggable) */}
          <div className="p-4 border-t border-gray-800">
            <div className="text-[10px] text-gray-500 uppercase font-bold mb-2 tracking-widest flex items-center gap-2">
                <span>MY PACK</span>
                <span className="text-[8px] bg-gold/10 text-gold px-1 rounded">DRAG TO ASSIGN</span>
            </div>
            <div className="space-y-1">
                {/* Mock Pack Members for Demo */}
                <DraggableAvatar wolf={{ id: 'wolf-1', name: 'Sarah Connor', role: 'Hacker', matchPercentage: 98, traits: [], skills: [] }} />
                <DraggableAvatar wolf={{ id: 'wolf-2', name: 'John Wick', role: 'Enforcer', matchPercentage: 95, traits: [], skills: [] }} />
                <DraggableAvatar wolf={{ id: 'wolf-3', name: 'Neo', role: 'Architect', matchPercentage: 92, traits: [], skills: [] }} />
            </div>
          </div>

          {/* Alpha Pitch Widget */}
          <div className="mt-auto p-4 border-t border-gray-800">
            <div className="bg-void/50 rounded p-4 border border-gray-800">
              <div className="text-[10px] text-gray-500 uppercase font-bold mb-2 tracking-widest">My Alpha Pitch</div>
              <AlphaPitchEditor
                initialPitch={currentUser.alphaPitch || { headline: "I'm building the future.", strategy: "Stealth mode." }}
                onSave={(pitch) => console.log("Saving pitch:", pitch)}
              />
            </div>
          </div>
        </nav>

        {/* --- BATTLEFIELD (Content Area) --- */}
        <main className="flex-1 overflow-hidden relative bg-void flex" id="kanban-board">
          {/* Cyber Grid Background */}
          <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none fixed"></div>
          
          {/* MIRROR INTERFACE (Desktop Split View) */}
          {isMirrorMode && (view === 'pack' || view === 'kanban') ? (
            <div className="flex w-full h-full">
              {/* LEFT: RADAR (40%) */}
              <div className="hidden md:block w-[40%] border-r border-gray-800 p-6 overflow-y-auto custom-scrollbar relative z-10">
                <h2 className="text-xl font-heading text-gold mb-6 tracking-widest">TACTICAL RADAR</h2>
                <GameboardRadar tasks={projectTasks} onTaskClick={handleRadarClick} />
              </div>

              {/* RIGHT: KANBAN (60%) */}
              <div className="w-full md:w-[60%] h-full overflow-hidden relative z-10 bg-void/50">
                <KanbanBoard onTaskUpdate={handleTaskUpdate} />
              </div>
            </div>
          ) : (
            /* STANDARD VIEW (Single Panel) */
            <div className={`relative z-10 min-h-full w-full ${view === 'kanban' ? 'p-0' : 'p-4 md:p-8'} overflow-y-auto custom-scrollbar`}>
              
              {view === 'radar' && (
                <WolfSearch
                  user={currentUser}
                  onSelectWolf={setSelectedWolf}
                  onMessageWolf={(wolf) => setSelectedWolf(wolf)}
                />
              )}

              {/* Mobile "Pack" View is just Radar or Kanban depending on sub-tab, handled by bottom nav for now */}
              {view === 'pack' && (
                 <div className="max-w-6xl mx-auto">
                    <GameboardRadar tasks={projectTasks} onTaskClick={handleRadarClick} />
                 </div>
              )}

              {view === 'kanban' && (
                <KanbanBoard onTaskUpdate={handleTaskUpdate} />
              )}

              {view === 'roadmap' && (
                <RoadmapView />
              )}

              {view === 'coffee' && (
                <CoffeeMatch />
              )}

            </div>
          )}
        </main>

      </div>

      {/* --- MOBILE TACTICAL BELT (Bottom Nav) --- */}
      <nav className="md:hidden h-16 bg-charcoal border-t border-gray-800 flex items-center justify-around px-2 shrink-0 z-50 pb-safe">
        <MobileNavButton active={view === 'pack'} onClick={() => handleViewChange('pack')} icon="📡" label="RADAR" />
        <MobileNavButton active={view === 'kanban'} onClick={() => handleViewChange('kanban')} icon="📋" label="BOARD" />
        <MobileNavButton active={view === 'radar'} onClick={() => handleViewChange('radar')} icon="🐺" label="WOLVES" />
        <MobileNavButton active={view === 'coffee'} onClick={() => handleViewChange('coffee')} icon="☕" label="COFFEE" />
      </nav>

      {/* --- MODALS & TOASTS --- */}
      {selectedWolf && (
        <WolfProfileModal
          wolf={selectedWolf}
          onClose={() => setSelectedWolf(null)}
          currentUser={currentUser}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          onClose={() => setToast(null)}
          onUndo={toast.onUndo}
        />
      )}

      {/* --- ONBOARDING TOUR --- */}
      <OnboardingTour />
      
      {/* --- DOM BUBBLE (Snarky Coach) --- */}
      <DomBubble />

    </div>
  );
};

// --- SUB-COMPONENTS ---

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded transition-all duration-200 ${
      active 
        ? 'bg-gold text-black font-bold shadow-neon-gold' 
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="text-sm uppercase tracking-widest">{label}</span>
  </button>
);

const MobileNavButton: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-1 w-16 transition-all duration-200 ${
      active 
        ? 'text-gold' 
        : 'text-gray-500'
    }`}
  >
    <span className={`text-xl mb-1 ${active ? 'filter drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]' : ''}`}>{icon}</span>
    <span className="text-[8px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);

export default Dashboard;
