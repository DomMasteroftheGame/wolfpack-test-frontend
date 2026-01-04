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

// --- HELPER: Role Config for UI ---
const getRoleConfig = (role: string | null | undefined) => {
  switch (role) {
    case 'labor': return { label: 'The Builder', icon: '🛠️', colors: { text: 'text-labor', border: 'border-labor', shadow: 'shadow-neon-red' } };
    case 'finance': return { label: 'The Capital', icon: '💰', colors: { text: 'text-finance', border: 'border-finance', shadow: 'shadow-neon-green' } };
    case 'sales': return { label: 'The Connector', icon: '🤝', colors: { text: 'text-sales', border: 'border-sales', shadow: 'shadow-neon-blue' } };
    default: return { label: 'Unassigned', icon: '❓', colors: { text: 'text-gray-500', border: 'border-gray-600', shadow: 'shadow-none' } };
  }
};

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

  const roleConfig = getRoleConfig(currentUser.selected_card_id as any);

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

  return (
    <div className="min-h-screen bg-void text-white font-mono flex flex-col overflow-hidden">
      
      {/* --- TACTICAL COMMAND BAR (Header) --- */}
      <header className="h-16 bg-void/90 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 md:px-6 shrink-0 z-50 sticky top-0">
        
        {/* Left: Brand & Status */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gold rounded flex items-center justify-center text-black font-bold text-xl shadow-neon-gold">
            W
          </div>
          <div className="hidden md:block">
            <h1 className="font-heading text-lg tracking-widest text-white leading-none">WOLFPACK <span className="text-gold">OS</span></h1>
            <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">V.35.0 // MIRROR PROTOCOL</div>
          </div>
        </div>

        {/* Right: Stats & Profile */}
        <div className="flex items-center gap-6">
          {/* IVP Score (The Ego) */}
          <div className="hidden md:flex flex-col items-end">
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Intrinsic Value</div>
            <div className="text-2xl font-mono font-bold text-gold leading-none">
              {(currentUser.ivp || 0).toLocaleString()} <span className="text-xs text-gray-600">IVP</span>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-6 border-l border-gray-800">
            <div className="text-right hidden sm:block">
              <div className="font-bold text-sm text-gray-300">{currentUser.email.split('@')[0]}</div>
              <div className={`text-[10px] uppercase font-bold tracking-widest ${roleConfig.colors.text}`}>
                {roleConfig.label}
              </div>
            </div>
            <div className={`w-10 h-10 rounded-full border-2 ${roleConfig.colors.border} bg-gray-900 overflow-hidden shadow-lg`}>
              <img src={`https://ui-avatars.com/api/?name=${currentUser.email}&background=random`} alt="Profile" />
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN LAYOUT --- */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* --- TACTICAL RAIL (Sidebar) --- */}
        <nav className="hidden md:flex w-64 bg-charcoal border-r border-gray-800 flex-col shrink-0 z-40">
          <div className="p-4 space-y-2">
            <NavButton 
              active={view === 'pack' || (isMirrorMode && view === 'kanban')} 
              onClick={() => { setView('pack'); setIsMirrorMode(true); }} 
              icon="⚔️" 
              label="War Room" 
            />
            <NavButton 
              active={view === 'radar' && !isMirrorMode} 
              onClick={() => { setView('radar'); setIsMirrorMode(false); }} 
              icon="📡" 
              label="Wolf Search" 
            />
            <NavButton 
              active={view === 'roadmap' && !isMirrorMode} 
              onClick={() => { setView('roadmap'); setIsMirrorMode(false); }} 
              icon="🗺️" 
              label="Roadmap" 
            />
            <NavButton 
              active={view === 'coffee' && !isMirrorMode} 
              onClick={() => { setView('coffee'); setIsMirrorMode(false); }} 
              icon="☕" 
              label="Coffee Dates" 
            />
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
        <main className="flex-1 overflow-hidden relative bg-void flex">
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
        <MobileNavButton active={view === 'pack'} onClick={() => setView('pack')} icon="📡" label="RADAR" />
        <MobileNavButton active={view === 'kanban'} onClick={() => setView('kanban')} icon="📋" label="BOARD" />
        <MobileNavButton active={view === 'radar'} onClick={() => setView('radar')} icon="🐺" label="WOLVES" />
        <MobileNavButton active={view === 'coffee'} onClick={() => setView('coffee')} icon="☕" label="COFFEE" />
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
