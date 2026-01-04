import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useWebSocket } from './WebSocketContext';
import { useCelebration } from './CelebrationContext';
import { Project, ProjectWithEquity, Task, Gameboard, TaskStatus } from '../types';
import { projectsApi, tasksApi, gameboardApi } from '../api';

interface ProjectContextType {
  projects: Project[];
  currentProject: ProjectWithEquity | null;
  projectTasks: Task[];
  projectGameboard: Gameboard | null;
  loading: boolean;
  error: string | null;
  setCurrentProjectId: (projectId: string | null) => void;
  createProject: (name: string, description: string) => Promise<Project>;
  updateProject: (projectId: string, data: Partial<Project>) => Promise<Project>;
  addMember: (projectId: string, userId: string) => Promise<Project>;
  removeMember: (projectId: string, userId: string) => Promise<Project>;
  createTask: (data: {
    title: string;
    description: string;
    assigned_to: string[];
    ivp_value: number;
    approach?: string;
    pace?: string;
    step_number?: number;
    objective?: string;
    deliverables?: string[];
  }) => Promise<Task>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<Task>;
  updateTaskPace: (taskId: string, pace: string) => Promise<Task>;
  updateTask: (taskId: string, data: Partial<Task>) => Promise<Task>;
  completeTask: (taskId: string) => Promise<Task>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}

interface ProjectProviderProps {
  children: ReactNode;
}

export function ProjectProvider({ children }: ProjectProviderProps) {
  const { token } = useAuth();
  const { messages } = useWebSocket();
  const { triggerCelebration } = useCelebration();

  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectWithEquity | null>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [projectGameboard, setProjectGameboard] = useState<Gameboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const loadProjects = async () => {
      setLoading(true);
      console.log('🐺 ProjectContext: Loading projects...');
      try {
        const userProjects = await projectsApi.getUserProjects(token);
        console.log('🐺 ProjectContext: Projects loaded:', userProjects);
        setProjects(userProjects);

        // Auto-select first project if none selected
        if (userProjects.length > 0 && !currentProjectId) {
          console.log('🐺 ProjectContext: Auto-selecting first project:', userProjects[0].id);
          setCurrentProjectId(userProjects[0].id);
        } else if (userProjects.length === 0) {
          console.log('🐺 ProjectContext: No projects found for user.');
        }

        setError(null);
      } catch (err: any) {
        console.error('🐺 ProjectContext: Error loading projects:', err);
        setError(err.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [token]);

  useEffect(() => {
    if (!token || !currentProjectId) {
      setCurrentProject(null);
      setProjectTasks([]);
      setProjectGameboard(null);
      return;
    }

    const loadProjectDetails = async () => {
      setLoading(true);
      try {
        const project = await projectsApi.getProject(token, currentProjectId);
        setCurrentProject(project);

        const tasks = await tasksApi.getProjectTasks(token, currentProjectId);
        setProjectTasks(tasks);

        const gameboard = await gameboardApi.getProjectGameboard(token, currentProjectId);
        setProjectGameboard(gameboard);

        setError(null);
      } catch (err: any) {
        console.error('Error loading project details:', err);
        setError(err.message || 'Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    loadProjectDetails();
  }, [token, currentProjectId]);

  useEffect(() => {
    if (messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];

    switch (latestMessage.type) {
      case 'project_created':
        setProjects(prev => [...prev, latestMessage.data]);
        break;

      case 'project_updated':
        if (latestMessage.data.id === currentProjectId) {
          setCurrentProject(prev => prev ? { ...prev, ...latestMessage.data } : null);
        }
        setProjects(prev =>
          prev.map(p => p.id === latestMessage.data.id ? latestMessage.data : p)
        );
        break;

      case 'member_added':
      case 'member_removed':
        if (latestMessage.data.project_id === currentProjectId) {
          if (token && currentProjectId) {
            projectsApi.getProject(token, currentProjectId)
              .then(project => setCurrentProject(project))
              .catch(err => console.error('Error refreshing project:', err));
          }
        }
        break;

      case 'task_created':
        if (latestMessage.data.project_id === currentProjectId) {
          setProjectTasks(prev => [...prev, latestMessage.data]);
        }
        break;

      case 'task_updated':
      case 'task_status_updated':
        if (latestMessage.data.project_id === currentProjectId) {
          setProjectTasks(prev =>
            prev.map(t => t.id === latestMessage.data.id ? latestMessage.data : t)
          );
        }
        break;

      case 'task_completed':
        if (latestMessage.data.task.project_id === currentProjectId) {
          setProjectTasks(prev =>
            prev.map(t => t.id === latestMessage.data.task.id ? latestMessage.data.task : t)
          );

          setCurrentProject(latestMessage.data.project);

          setProjectGameboard(latestMessage.data.gameboard);
        }
        break;

      default:
        break;
    }
  }, [messages, currentProjectId, token]);

  const createProject = async (name: string, description: string) => {
    if (!token) throw new Error('Not authenticated');

    setLoading(true);
    try {
      const newProject = await projectsApi.createProject(token, { name, description });
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (projectId: string, data: Partial<Project>) => {
    if (!token) throw new Error('Not authenticated');

    setLoading(true);
    try {
      const updatedProject = await projectsApi.updateProject(token, projectId, data);

      if (projectId === currentProjectId) {
        setCurrentProject(prev => prev ? { ...prev, ...updatedProject } : null);
      }

      setProjects(prev =>
        prev.map(p => p.id === projectId ? updatedProject : p)
      );

      return updatedProject;
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Failed to update project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (projectId: string, userId: string) => {
    if (!token) throw new Error('Not authenticated');

    setLoading(true);
    try {
      const updatedProject = await projectsApi.addMember(token, projectId, userId);

      if (projectId === currentProjectId) {
        setCurrentProject(prev => prev ? { ...prev, ...updatedProject } : null);
      }

      setProjects(prev =>
        prev.map(p => p.id === projectId ? updatedProject : p)
      );

      triggerCelebration('claps');

      return updatedProject;
    } catch (err) {
      console.error('Error adding member:', err);
      setError('Failed to add member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (projectId: string, userId: string) => {
    if (!token) throw new Error('Not authenticated');

    setLoading(true);
    try {
      const updatedProject = await projectsApi.removeMember(token, projectId, userId);

      if (projectId === currentProjectId) {
        setCurrentProject(prev => prev ? { ...prev, ...updatedProject } : null);
      }

      setProjects(prev =>
        prev.map(p => p.id === projectId ? updatedProject : p)
      );

      return updatedProject;
    } catch (err) {
      console.error('Error removing member:', err);
      setError('Failed to remove member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (data: {
    title: string;
    description: string;
    assigned_to: string[];
    ivp_value: number;
    approach?: string;
    pace?: string;
    step_number?: number;
    objective?: string;
    deliverables?: string[];
  }) => {
    if (!token || !currentProjectId) throw new Error('Project not selected');

    setLoading(true);
    try {
      const newTask = await tasksApi.createTask(token, {
        ...data,
        project_id: currentProjectId,
      });

      setProjectTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    if (!token) throw new Error('Not authenticated');

    setLoading(true);
    try {
      const updatedTask = await tasksApi.updateTaskStatus(token, taskId, status);

      setProjectTasks(prev =>
        prev.map(t => t.id === taskId ? updatedTask : t)
      );

      return updatedTask;
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId: string) => {
    if (!token) throw new Error('Not authenticated');

    setLoading(true);
    try {
      const completedTask = await tasksApi.completeTask(token, taskId);

      setProjectTasks(prev =>
        prev.map(t => t.id === taskId ? completedTask : t)
      );

      return completedTask;
    } catch (err) {
      console.error('Error completing task:', err);
      setError('Failed to complete task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTaskPace = async (taskId: string, pace: string) => {
    if (!token) throw new Error('Not authenticated');

    setLoading(true);
    try {
      const updatedTask = await tasksApi.updateTask(token, taskId, { pace });

      setProjectTasks(prev =>
        prev.map(t => t.id === taskId ? updatedTask : t)
      );

      return updatedTask;
    } catch (err) {
      console.error('Error updating task pace:', err);
      setError('Failed to update task pace');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId: string, data: Partial<Task>) => {
    if (!token) throw new Error('Not authenticated');

    setLoading(true);
    try {
      const updatedTask = await tasksApi.updateTask(token, taskId, data);

      setProjectTasks(prev =>
        prev.map(t => t.id === taskId ? updatedTask : t)
      );

      return updatedTask;
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    projects,
    currentProject,
    projectTasks,
    projectGameboard,
    loading,
    error,
    setCurrentProjectId,
    createProject,
    updateProject,
    addMember,
    removeMember,
    createTask,
    updateTaskStatus,
    updateTaskPace,
    updateTask,
    completeTask,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}
