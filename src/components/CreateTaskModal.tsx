import React, { useState, useEffect } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { useAuth } from '../contexts/AuthContext';
import { useCelebration } from '../contexts/CelebrationContext';
import { Task } from '../types';
import { Shield, Zap, Star, Radar } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (task: any) => void;
  taskToEdit?: Task | null;
  onOutsource?: (taskData: any) => void;
}

const TASK_APPROACHES = [
  { value: 'build', label: 'Build (Internal)' },
  { value: 'buy', label: 'Buy (Acquire)' },
  { value: 'partner', label: 'Partner (JV)' },
  { value: 'outsource', label: 'Outsource (Delegate)' }
];

// Mock Recommended Wolves for Outsource Demo
const MOCK_WOLVES = [
  { id: 'w1', name: 'Sarah J.', role: 'labor', skill: 'React Dev', match: 98 },
  { id: 'w2', name: 'Marcus T.', role: 'finance', skill: 'CFO', match: 85 },
  { id: 'w3', name: 'Elena R.', role: 'sales', skill: 'Closer', match: 92 },
];

const CreateTaskModal = ({ isOpen, onClose, taskToEdit, onOutsource, onSave }: CreateTaskModalProps) => {
  const { currentUser } = useAuth();
  const { createTask, updateTask } = useProject();
  const { triggerCelebration } = useCelebration();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [objective, setObjective] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [ivpValue, setIvpValue] = useState(1);
  const [assignedUsers, setAssignedUsers] = useState<string[]>([]);
  const [approach, setApproach] = useState('build');
  const [pace, setPace] = useState('walk');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Outsource State
  const [isScanning, setIsScanning] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setObjective(taskToEdit.objective || '');
      setDeliverables(taskToEdit.deliverables?.join('\n') || '');
      setIvpValue(taskToEdit.ivp_value);
      setAssignedUsers(taskToEdit.assigned_to);
      setApproach(taskToEdit.approach || 'build');
      setPace(taskToEdit.pace || 'walk');
    } else {
      setTitle('');
      setDescription('');
      setObjective('');
      setDeliverables('');
      setIvpValue(1);
      setAssignedUsers([]);
      setApproach('build');
      setPace('walk');
    }
  }, [taskToEdit, isOpen]);

  // Handle Approach Change to Trigger Scan
  useEffect(() => {
    if (approach === 'outsource') {
      setIsScanning(true);
      setShowRecommendations(false);
      // Simulate Scan Delay
      setTimeout(() => {
        setIsScanning(false);
        setShowRecommendations(true);
      }, 2000);
    } else {
      setShowRecommendations(false);
      setIsScanning(false);
    }
  }, [approach]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    if (approach === 'outsource' && onOutsource) {
      onOutsource({
        title,
        description,
        objective,
        deliverables: deliverables.split('\n').filter(d => d.trim()),
        assigned_to: assignedUsers,
        ivp_value: ivpValue,
        approach,
        pace
      });
      onClose();
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        title,
        description,
        objective,
        deliverables: deliverables.split('\n').filter(d => d.trim()),
        assigned_to: assignedUsers.length > 0 ? assignedUsers : [currentUser?.id || ''],
        ivp_value: ivpValue,
        approach,
        pace
      };

      if (taskToEdit) {
        if (onSave) onSave({ ...taskToEdit, ...taskData });
        await updateTask(taskToEdit.id, taskData);
        triggerCelebration('claps');
      } else {
        await createTask(taskData);
        triggerCelebration('fireworks');
      }

      onClose();
    } catch (err) {
      console.error('Error saving task:', err);
      setError('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-void/90 backdrop-blur-md font-mono">
      <div className={`w-full max-w-2xl p-0 mx-auto bg-charcoal border border-gray-700 rounded-lg shadow-2xl transition-all duration-500 ${showRecommendations ? 'h-[80vh]' : 'h-auto'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-black/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>
            <h2 className="text-xl font-heading text-gold uppercase tracking-widest">
              {taskToEdit ? 'Mission Briefing (Edit)' : 'Initiate Mission'}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">✕</button>
        </div>

        <div className="flex h-full">
          {/* Left Panel: Form */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar max-h-[70vh]">
            {error && <div className="p-3 mb-4 text-sm text-red-400 bg-red-900/20 border border-red-900/50 rounded">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Title & Approach */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Mission Objective</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 bg-black border border-gray-700 rounded-sm text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all" placeholder="ENTER TITLE" />
                </div>
                <div>
                  <label className="block mb-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tactics</label>
                  <select value={approach} onChange={(e) => setApproach(e.target.value)} className="w-full px-3 py-2 bg-black border border-gray-700 rounded-sm text-white focus:border-gold outline-none">
                    {TASK_APPROACHES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Briefing</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 bg-black border border-gray-700 rounded-sm text-white focus:border-gold outline-none" placeholder="MISSION DETAILS..." />
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Value (IVP)</label>
                  <input type="number" min={1} max={100} value={ivpValue} onChange={(e) => setIvpValue(parseInt(e.target.value))} className="w-full px-3 py-2 bg-black border border-gray-700 rounded-sm text-white focus:border-gold text-center font-bold text-gold" />
                </div>
                <div className="col-span-2">
                  <label className="block mb-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pace</label>
                  <div className="flex gap-1">
                    {['crawl', 'walk', 'run'].map((p) => (
                      <button
                        key={p} type="button" onClick={() => setPace(p)}
                        className={`flex-1 py-2 text-[8px] font-black uppercase tracking-wider border rounded-sm transition-all ${pace === p
                          ? p === 'run' ? 'bg-red-600 border-red-500 text-white' : p === 'walk' ? 'bg-orange-600 border-orange-500 text-white' : 'bg-green-600 border-green-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-500 hover:bg-gray-700'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800 mt-8">
                <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-white uppercase tracking-wider">Abort</button>
                <button type="submit" disabled={loading} className="px-6 py-2 text-xs font-black text-black bg-gold rounded-sm hover:bg-yellow-400 uppercase tracking-widest shadow-neon-gold transition-all">
                  {loading ? 'Processing...' : (taskToEdit ? 'Update Intel' : 'Execute')}
                </button>
              </div>
            </form>
          </div>

          {/* Right Panel: Outsource Scanner */}
          {(isScanning || showRecommendations) && (
            <div className="w-1/3 border-l border-gray-800 bg-black/50 p-4 flex flex-col relative overflow-hidden">
              
              {/* Scanning Effect */}
              {isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/80 backdrop-blur-sm">
                  <div className="relative w-24 h-24 mb-4">
                    <div className="absolute inset-0 border-2 border-gold/30 rounded-full"></div>
                    <div className="absolute inset-0 border-t-2 border-gold rounded-full animate-spin"></div>
                    <Radar className="absolute inset-0 m-auto text-gold w-8 h-8 animate-pulse" />
                  </div>
                  <div className="text-gold font-mono text-xs tracking-widest animate-pulse">SCANNING NETWORK...</div>
                </div>
              )}

              {/* Results */}
              {showRecommendations && (
                <div className="flex-1 flex flex-col animate-fade-in-up">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">
                    Recommended Operatives
                  </h3>
                  
                  <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1">
                    {MOCK_WOLVES.map(wolf => (
                      <div key={wolf.id} className="bg-gray-900 border border-gray-800 p-3 rounded-sm hover:border-gold/50 transition-colors group cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="text-white font-bold text-sm">{wolf.name}</div>
                            <div className={`text-[10px] uppercase font-bold ${wolf.role === 'labor' ? 'text-labor' : wolf.role === 'finance' ? 'text-finance' : 'text-sales'}`}>
                              {wolf.role} // {wolf.skill}
                            </div>
                          </div>
                          <div className="text-gold font-bold text-xs">{wolf.match}%</div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            setAssignedUsers([wolf.id]);
                            setApproach('outsource');
                          }}
                          className="w-full py-1.5 bg-gray-800 text-gray-400 text-[10px] uppercase font-bold rounded-sm group-hover:bg-gold group-hover:text-black transition-colors"
                        >
                          Assign Asset
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
