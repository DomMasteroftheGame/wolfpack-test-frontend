import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import CreateTaskModal from './CreateTaskModal';
import { Task as GlobalTask, User, MatchProfile } from '../types';
import { KanbanCard } from './KanbanCard';
import { useWolfPackLogic } from '../hooks/useWolfPackLogic';
import { useSensoryFeedback } from '../hooks/useSensoryFeedback';
import { Target, Zap, Trophy, Hammer, Ruler, Brain } from 'lucide-react';

// Use GlobalTask but ensure it has string ID for dnd
type Task = GlobalTask & { id: string };

interface Column {
    id: string;
    title: string;
    taskIds: string[];
}

interface Data {
    tasks: { [key: string]: Task };
    columns: { [key: string]: Column };
    columnOrder: string[];
}

interface KanbanBoardProps {
    tasks?: GlobalTask[]; // Make optional to handle undefined
    onUpdateTask: (task: GlobalTask) => void;
    currentUser?: User;
    packMembers?: MatchProfile[];
    onSelectWolf?: (wolf: MatchProfile) => void;
    onOutsource?: (taskData: any) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks: initialTasks = [], onUpdateTask, currentUser, packMembers, onOutsource }) => {
    const [data, setData] = useState<Data>({ tasks: {}, columns: {}, columnOrder: [] });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Partial<Task> | undefined>(undefined);
    const [pendingDrag, setPendingDrag] = useState<{ draggableId: string, destinationIndex: number } | null>(null);
    const [activePhase, setActivePhase] = useState<string>("ALL OPS");
    const phases = [
        "ALL OPS",
        "Phase 1: Intel & Setup",
        "Phase 2: MVP Build",
        "Phase 3: Traction",
        "Phase 4: Scale"
    ];
    
    // Hook into the Wolf Pack Logic (Antigravity Handshake)
    const { moveWolf } = useWolfPackLogic();
    
    // Hook into Sensory Feedback
    const { triggerFeedback } = useSensoryFeedback();

    // Sync with parent tasks
    useEffect(() => {
        const tasksMap: { [key: string]: Task } = {};
        const huntIds: string[] = []; // Backlog/Todo
        const chaseIds: string[] = []; // Doing
        const feastIds: string[] = []; // Done

        initialTasks.forEach(t => {
            // Filter by Active Phase (unless ALL OPS is selected)
            if (activePhase !== "ALL OPS") {
                // If task has no phase, default to Phase 1
                const taskPhase = t.phase || "Phase 1: Intel & Setup";
                
                // Normalize strings for comparison (handle "Phase 1" vs "Phase 1: Intel & Setup")
                const normalizedTaskPhase = taskPhase.includes("Phase 1") ? "Phase 1: Intel & Setup" :
                                          taskPhase.includes("Phase 2") ? "Phase 2: MVP Build" :
                                          taskPhase.includes("Phase 3") ? "Phase 3: Traction" :
                                          taskPhase.includes("Phase 4") ? "Phase 4: Scale" : taskPhase;

                if (normalizedTaskPhase !== activePhase) return;
            }

            const id = t.id.toString();
            tasksMap[id] = { ...t, id } as Task;

            if (t.status === 'done' || t.status === 'feast') feastIds.push(id);
            else if (t.status === 'doing' || t.status === 'chase') chaseIds.push(id);
            else huntIds.push(id); 
        });

        setData({
            tasks: tasksMap,
            columns: {
                'hunt': { id: 'hunt', title: 'THE HUNT', taskIds: huntIds },
                'chase': { id: 'chase', title: 'THE CHASE', taskIds: chaseIds },
                'feast': { id: 'feast', title: 'THE FEAST', taskIds: feastIds },
            },
            columnOrder: ['hunt', 'chase', 'feast'],
        });
    }, [initialTasks]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // Logic: Dragging from Hunt to Chase triggers Modal (Commitment)
        if (source.droppableId === 'hunt' && destination.droppableId === 'chase') {
            const task = data.tasks[draggableId];
            setEditingTask(task);
            setPendingDrag({ draggableId, destinationIndex: destination.index });
            setIsModalOpen(true);
            triggerFeedback('click'); // Modal open sound
            return; 
        }

        // Optimistic UI Update
        const start = data.columns[source.droppableId];
        const finish = data.columns[destination.droppableId];

        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = { ...start, taskIds: newTaskIds };

            setData({
                ...data,
                columns: { ...data.columns, [newColumn.id]: newColumn },
            });
            return;
        }

        // Moving from one list to another
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = { ...start, taskIds: startTaskIds };

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = { ...finish, taskIds: finishTaskIds };

        setData({
            ...data,
            columns: {
                ...data.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            },
        });

        // Notify Parent & Antigravity
        let newStatus = 'hunt';
        if (destination.droppableId === 'chase') newStatus = 'chase'; // or 'doing'
        if (destination.droppableId === 'feast') newStatus = 'feast'; // or 'done'
        if (destination.droppableId === 'hunt') newStatus = 'hunt';   // or 'todo'

        // Call the handshake hook
        moveWolf(draggableId, newStatus);

        // Sensory Feedback
        if (newStatus === 'feast') {
            triggerFeedback('success');
        } else {
            triggerFeedback('drop');
        }
    };

    const handleModalSave = (updatedTask: Partial<GlobalTask>) => {
        if (pendingDrag) {
            const { draggableId } = pendingDrag;
            const task = data.tasks[draggableId];
            const newTask = { ...task, ...updatedTask, status: 'chase' } as Task; 
            
            // Call the handshake hook
            moveWolf(draggableId, 'chase');
            
            setPendingDrag(null);
            triggerFeedback('drop');
        } else if (editingTask) {
            const task = data.tasks[editingTask.id!];
            const newTask = { ...task, ...updatedTask } as Task;
            onUpdateTask(newTask);
        }
        setIsModalOpen(false);
        setEditingTask(undefined);
    };

    const getColumnIcon = (id: string) => {
        switch (id) {
            case 'hunt': return <Target size={20} className="text-gray-500" />;
            case 'chase': return <Zap size={20} className="text-white" />;
            case 'feast': return <Trophy size={20} className="text-gold" />;
            default: return null;
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
                <div className="flex flex-col border-b border-gray-800 bg-void/90 backdrop-blur shrink-0">
                    <div className="flex justify-between items-center px-6 py-4">
                        <h2 className="text-xl font-heading text-white tracking-widest flex items-center gap-2">
                            <span>TACTICAL BOARD</span>
                            <span className="text-gold text-[10px] bg-gold/10 px-1 rounded border border-gold/20 align-top">LIVE</span>
                        </h2>
                        <div className="flex gap-4 text-[10px] font-mono text-gray-500 uppercase">
                            <span className="flex items-center gap-1"><Hammer size={12} className="text-yellow-500" /> BUILD</span>
                            <span className="flex items-center gap-1"><Ruler size={12} className="text-cyan-500" /> MEASURE</span>
                            <span className="flex items-center gap-1"><Brain size={12} className="text-pink-500" /> LEARN</span>
                        </div>
                    </div>
                    
                    {/* PHASE TABS */}
                    <div id="phase-tabs-container" className="flex px-6 gap-1 overflow-x-auto custom-scrollbar">
                        {phases.map((phase, idx) => {
                            const isActive = activePhase === phase;
                            // No locks - Holistic Visibility
                            const isLocked = false; 
                            
                            return (
                                <button
                                    key={phase}
                                    onClick={() => setActivePhase(phase)}
                                    className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
                                        isActive 
                                            ? 'bg-gold text-black shadow-[0_0_15px_rgba(255,215,0,0.4)] transform scale-105' 
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {phase}
                                </button>
                            );
                        })}
                    </div>
                </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div id="kanban-board-container" className="flex-1 flex overflow-x-auto overflow-y-hidden">
                    {data.columnOrder.map((columnId, index) => {
                        const column = data.columns[columnId];
                        const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
                        
                        // Column Styles
                        const isHunt = columnId === 'hunt';
                        const isChase = columnId === 'chase';
                        const isFeast = columnId === 'feast';

                        return (
                            <div
                                key={column.id}
                                className={`flex-none w-[85vw] md:w-1/3 flex flex-col h-full border-r border-gray-800 transition-colors ${
                                    isHunt ? 'bg-void/30' : isChase ? 'bg-void/50' : 'bg-void/80'
                                }`}
                            >
                                {/* Column Header */}
                                <div className={`p-4 border-b border-gray-800 flex items-center justify-between sticky top-0 z-10 ${
                                    isChase ? 'bg-gray-900/50' : isFeast ? 'bg-gold/10' : 'bg-transparent'
                                }`}>
                                    <div className="flex items-center gap-3">
                                        {getColumnIcon(columnId)}
                                        <h2 className={`text-sm font-bold uppercase tracking-widest ${
                                            isHunt ? 'text-gray-600' : isChase ? 'text-white' : 'text-gold'
                                        }`}>
                                            {column.title}
                                        </h2>
                                    </div>
                                    <span className="text-[10px] font-mono bg-gray-800 text-gray-400 px-2 py-0.5 rounded-sm">{tasks.length}</span>
                                </div>

                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`p-4 flex-grow overflow-y-auto custom-scrollbar space-y-3 ${
                                                snapshot.isDraggingOver ? 'bg-white/5' : ''
                                            }`}
                                        >
                                            {tasks.filter(t => !isHunt || t.phase === activePhase).map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            id={`task-${task.id}`}
                                                            style={{ ...provided.draggableProps.style }}
                                                        >
                                                          <KanbanCard
                                                    task={task}
                                                    onClick={() => {
                                                        setEditingTask(task);
                                                        setIsModalOpen(true);
                                                        triggerFeedback('click');
                                                    }}
                                                    onAssign={(e) => {
                                                        // Trigger Assign Modal (Mock for now, or open Edit Modal with Assign tab)
                                                        setEditingTask(task);
                                                        setIsModalOpen(true);
                                                        triggerFeedback('click');
                                                    }}
                                                    onOutsource={(e) => {
                                                        // Trigger Outsource Logic
                                                        if (onOutsource) onOutsource(task);
                                                        triggerFeedback('click');
                                                    }}
                                                    onDropAvatar={(wolfId, wolfName) => {
                                                        // Assign Wolf to Task
                                                        const updatedTask = { ...task, assignedTo: wolfId, assigneeName: wolfName };
                                                        onUpdateTask(updatedTask);
                                                        triggerFeedback('success');
                                                        // Optional: Show toast
                                                        alert(`Assigned ${wolfName} to ${task.title}`);
                                                    }}
                                                />                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>

            {isModalOpen && (
                <CreateTaskModal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setPendingDrag(null); }}
                    onSave={handleModalSave}
                    taskToEdit={editingTask as Task | null}
                    onOutsource={onOutsource}
                />
            )}
            
            {/* Quick Edit Modal (Reusing CreateTaskModal) */}
            {editingTask && !isModalOpen && (
                <CreateTaskModal
                    isOpen={true}
                    onClose={() => setEditingTask(undefined)}
                    onSave={handleModalSave}
                    taskToEdit={editingTask as Task | null}
                    onOutsource={onOutsource}
                />
            )}
        </div>
    );
};

export default KanbanBoard;
