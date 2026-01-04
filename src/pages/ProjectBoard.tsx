import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useProject } from '../contexts/ProjectContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { TaskStatus, Task } from '../types';
import CreateTaskModal from '../components/CreateTaskModal';
import { FaQuestionCircle, FaSkull, FaRunning, FaWalking, FaArchive, FaList, FaCheckDouble } from 'react-icons/fa';
import { GiWolfHowl, GiMeat, GiCrosshair } from 'react-icons/gi';
import MissionReport from '../components/MissionReport';
import WolfRadar from '../components/WolfRadar';
import { createTasksFromTemplate } from '../data/wolfDenTasks';

const ProjectBoard = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const {
    currentProject,
    projectTasks,
    setCurrentProjectId,
    updateTaskStatus,
    completeTask,
    createTask,
    loading: projectLoading
  } = useProject();
  const { setCurrentProjectId: setWebSocketProjectId } = useWebSocket();
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isMissionReportOpen, setIsMissionReportOpen] = useState(false);
  const [completedTaskData, setCompletedTaskData] = useState<{ name: string, phase: string } | null>(null);
  const [isRadarView, setIsRadarView] = useState(false); // Default to Board View based on "Kanban still there" feedback, user wants Kanban refinement.
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    if (projectId) {
      setCurrentProjectId(projectId);
      setWebSocketProjectId(projectId);
    }

    return () => {
      setCurrentProjectId(null);
      setWebSocketProjectId(null);
    };
  }, [projectId, setCurrentProjectId, setWebSocketProjectId]);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;
    const task = projectTasks.find(t => t.id === draggableId);

    try {
      if (newStatus === TaskStatus.DONE) {
        await completeTask(draggableId);
        if (task) {
          setCompletedTaskData({ name: task.title, phase: task.approach || 'Build' });
          setIsMissionReportOpen(true);
        }
      } else {
        await updateTaskStatus(draggableId, newStatus);

        // Protocol: Moving a card to "Doing" opens the Deployment Modal.
        if (newStatus === TaskStatus.IN_PROGRESS && task) {
          setTaskToEdit(task);
          setIsCreateTaskModalOpen(true);
        }
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleInitializeWolfDen = async () => {
    if (!currentProject || !projectId) return;
    setIsSeeding(true);
    try {
      const tasksToCreate = createTasksFromTemplate(projectId, currentProject.owner_id);
      // Create in batches to avoid overwhelming the server
      const batchSize = 5;
      for (let i = 0; i < tasksToCreate.length; i += batchSize) {
        const batch = tasksToCreate.slice(i, i + batchSize);
        await Promise.all(batch.map(t => createTask(t)));
      }
    } catch (e) {
      console.error("Failed to seed Wolf Den", e);
      alert("Partial initialization failure. Check console.");
    } finally {
      setIsSeeding(false);
    }
  };

  const tasksByStatus = {
    [TaskStatus.BACKLOG]: projectTasks.filter(task => task.status === TaskStatus.BACKLOG),
    [TaskStatus.TODO]: projectTasks.filter(task => task.status === TaskStatus.TODO),
    [TaskStatus.IN_PROGRESS]: projectTasks.filter(task => task.status === TaskStatus.IN_PROGRESS),
    [TaskStatus.DONE]: projectTasks.filter(task => task.status === TaskStatus.DONE),
  };

  if (!currentProject) {
    return <div className="flex items-center justify-center h-screen bg-gray-950 text-yellow-500">INITIALIZING MISSION CONTROL...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 font-sans">
      <div className="container p-4 mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
              {currentProject.name} <span className="text-yellow-500">_DEN</span>
            </h1>
            <div className="text-xs text-gray-500 font-mono tracking-widest mt-1">
              OPERATION ID: {currentProject.id.slice(0, 8)}
            </div>
          </div>

          <div className="flex space-x-3 mt-4 md:mt-0">
            {projectTasks.length === 0 && (
              <button
                onClick={handleInitializeWolfDen}
                disabled={isSeeding}
                className="px-4 py-2 text-xs font-black text-black bg-cyan-500 rounded hover:bg-cyan-400 transition-colors uppercase tracking-widest animate-pulse"
              >
                {isSeeding ? 'INITIALIZING PROTOCOLS...' : 'INITIALIZE WOLF DEN'}
              </button>
            )}
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-gray-400 border border-gray-700 rounded hover:bg-gray-800 hover:text-white transition-colors flex items-center uppercase tracking-wider"
            >
              <FaQuestionCircle className="mr-2" /> Intel
            </button>
            <button
              onClick={() => {
                setTaskToEdit(null);
                setIsCreateTaskModalOpen(true);
              }}
              className="px-6 py-2 text-xs font-black text-black bg-yellow-500 rounded hover:bg-yellow-400 transition-colors uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_20px_rgba(234,179,8,0.5)]"
            >
              + Initiate Task
            </button>
          </div>
        </div>

        {/* View Toggle (Tactical Switch) */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-gray-900 rounded-lg border border-gray-800">
            <button
              onClick={() => setIsRadarView(true)}
              className={`px-8 py-2 rounded text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center ${isRadarView ? 'bg-gray-800 text-yellow-500 shadow-lg border border-gray-700' : 'text-gray-600 hover:text-gray-400'}`}
            >
              <GiWolfHowl className="mr-2 text-lg" /> Radar
            </button>
            <button
              onClick={() => setIsRadarView(false)}
              className={`px-8 py-2 rounded text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center ${!isRadarView ? 'bg-gray-800 text-yellow-500 shadow-lg border border-gray-700' : 'text-gray-600 hover:text-gray-400'}`}
            >
              <FaSkull className="mr-2 text-lg" /> Board
            </button>
          </div>
        </div>

        {isRadarView ? (
          <div className="flex justify-center mb-12 animate-in fade-in zoom-in duration-500">
            <WolfRadar
              tasks={projectTasks}
              onTaskClick={(task) => {
                setTaskToEdit(task);
                setIsCreateTaskModalOpen(true);
              }}
              onDistressSignal={() => {
                alert("DISTRESS SIGNAL DEPLOYED TO PACK (Simulated)");
              }}
            />
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 h-[calc(100vh-250px)]">

              {/* BACKLOG (The Deck) */}
              <div className="bg-gray-900/30 rounded-xl border border-dashed border-gray-800 flex flex-col h-full">
                <div className="p-3 border-b border-gray-800 bg-gray-900/50 rounded-t-xl">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center">
                      <FaArchive className="mr-2 opacity-50" />
                      The Deck (Backlog)
                    </h2>
                    <span className="text-[10px] font-mono text-gray-600 bg-gray-800 px-2 py-0.5 rounded">{tasksByStatus[TaskStatus.BACKLOG].length}</span>
                  </div>
                </div>
                <Droppable droppableId={TaskStatus.BACKLOG}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-2 overflow-y-auto custom-scrollbar ${snapshot.isDraggingOver ? 'bg-gray-800/30' : ''}`}
                    >
                      {tasksByStatus[TaskStatus.BACKLOG].map((task, index) => (
                        <TaskCard key={task.id} task={task} index={index} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* TO DO (Assigned) */}
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 flex flex-col h-full">
                <div className="p-3 border-b border-gray-800 bg-gray-900/80 rounded-t-xl backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center">
                      <FaList className="mr-2 text-gray-400" />
                      Assigned (To Do)
                    </h2>
                    <span className="text-[10px] font-mono text-gray-400 bg-gray-800 px-2 py-0.5 rounded">{tasksByStatus[TaskStatus.TODO].length}</span>
                  </div>
                </div>
                <Droppable droppableId={TaskStatus.TODO}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-2 overflow-y-auto custom-scrollbar ${snapshot.isDraggingOver ? 'bg-gray-800/50' : ''}`}
                    >
                      {tasksByStatus[TaskStatus.TODO].map((task, index) => (
                        <TaskCard key={task.id} task={task} index={index} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* DOING (In Pursuit) */}
              <div className="bg-gray-900/50 rounded-xl border border-blue-900/30 flex flex-col h-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500 opacity-30 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                <div className="p-3 border-b border-gray-800 bg-gray-900/80 rounded-t-xl backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center shadow-blue-500/20 drop-shadow">
                      <GiCrosshair className="mr-2 text-blue-500 animate-pulse" />
                      In Pursuit (Doing)
                    </h2>
                    <span className="text-[10px] font-mono text-blue-400 bg-blue-900/20 px-2 py-0.5 rounded border border-blue-900/30">{tasksByStatus[TaskStatus.IN_PROGRESS].length}</span>
                  </div>
                </div>
                <Droppable droppableId={TaskStatus.IN_PROGRESS}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-2 overflow-y-auto custom-scrollbar ${snapshot.isDraggingOver ? 'bg-blue-900/10' : ''}`}
                    >
                      {tasksByStatus[TaskStatus.IN_PROGRESS].map((task, index) => (
                        <TaskCard key={task.id} task={task} index={index} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* DONE (Kill Confirmed) */}
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 flex flex-col h-full">
                <div className="p-3 border-b border-gray-800 bg-gray-900/80 rounded-t-xl backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xs font-black text-yellow-500 uppercase tracking-widest flex items-center">
                      <GiMeat className="mr-2 text-lg" />
                      Kill Confirmed
                    </h2>
                    <span className="text-[10px] font-mono text-yellow-500 bg-yellow-900/20 px-2 py-0.5 rounded border border-yellow-900/30">{tasksByStatus[TaskStatus.DONE].length}</span>
                  </div>
                </div>
                <Droppable droppableId={TaskStatus.DONE}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-2 overflow-y-auto custom-scrollbar ${snapshot.isDraggingOver ? 'bg-yellow-900/10' : ''}`}
                    >
                      {tasksByStatus[TaskStatus.DONE].map((task, index) => (
                        <TaskCard key={task.id} task={task} index={index} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </DragDropContext>
        )}

        {/* Create/Edit Task Modal */}
        <CreateTaskModal
          isOpen={isCreateTaskModalOpen}
          onClose={() => {
            setIsCreateTaskModalOpen(false);
            setTaskToEdit(null);
          }}
          taskToEdit={taskToEdit}
        />

        {/* Other Modals... */}
        {isHelpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-80 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl p-6 mx-auto bg-gray-900 border border-gray-700 rounded-lg shadow-2xl">
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              <h2 className="mb-4 text-2xl font-black text-yellow-500 uppercase tracking-tighter">Mission Intel</h2>
              <div className="h-[70vh]">
                <iframe
                  src="/assets/Build+Your+Wolfpack+Project+Management.pdf"
                  className="w-full h-full border border-gray-800 rounded bg-gray-100" // PDF needs white bg usually
                  title="Project Management Guide"
                />
              </div>
            </div>
          </div>
        )}

        {/* Mission Report Modal */}
        {isMissionReportOpen && completedTaskData && (
          <MissionReport
            cardName={completedTaskData.name}
            phase={completedTaskData.phase}
            onClose={() => setIsMissionReportOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

interface TaskCardProps {
  task: Task;
  index: number;
}

const TaskCard = ({ task, index }: TaskCardProps) => {
  // Stamina/Pace Logic Visuals
  const paceColor = task.pace === 'run' ? 'text-red-500 border-red-500/30 bg-red-500/10' :
    task.pace === 'walk' ? 'text-orange-500 border-orange-500/30 bg-orange-500/10' :
      'text-blue-500 border-blue-500/30 bg-blue-500/10'; // Protocol: Blue for Crawl/Optimal

  const paceIcon = task.pace === 'run' ? <FaRunning /> :
    task.pace === 'walk' ? <FaWalking /> :
      <span className="text-xs font-bold">~</span>; // Crawl

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-3 mb-2 bg-gray-800 rounded border border-gray-700 shadow-sm hover:shadow-lg transition-all group ${snapshot.isDragging ? 'shadow-2xl border-yellow-500/50 rotate-1' : ''
            }`}
        >
          <div className="flex justify-between items-start mb-1">
            <div className="flex flex-col">
              <span className="text-[8px] text-gray-500 font-mono">#{task.step_number || '00'}</span>
              <h3 className="font-bold text-gray-200 leading-tight pr-2 text-xs">{task.title}</h3>
            </div>
            {task.ivp_value > 0 && (
              <span className="text-[9px] font-mono font-bold text-yellow-600 bg-yellow-900/10 px-1 py-0.5 rounded border border-yellow-900/20">
                IVP{task.ivp_value}
              </span>
            )}
          </div>

          {task.objective && (
            <p className="text-[10px] text-gray-400 mb-2 italic border-l-2 border-gray-700 pl-1">{task.objective}</p>
          )}

          <div className="flex flex-wrap items-center justify-between mt-2 pt-2 border-t border-gray-700/50">
            {/* Approach Tag */}
            <span className="text-[9px] uppercase font-bold tracking-wider text-gray-500">
              {task.approach ? task.approach : 'GENERIC'}
            </span>

            {/* Pace Indicator */}
            <div className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider border ${paceColor}`}>
              {paceIcon}
              <span>{task.pace || 'WALK'}</span>
            </div>

            {/* Assignee Count */}
            {task.assigned_to.length > 0 && (
              <div className="flex -space-x-1">
                {task.assigned_to.map((userId, i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-gray-600 border border-gray-800 flex items-center justify-center text-[6px] text-white" title={userId}>
                    {userId.charAt(0)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ProjectBoard;
