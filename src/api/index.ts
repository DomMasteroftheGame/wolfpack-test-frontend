import {
  User, Card, Project, ProjectWithEquity, Task,
  TaskStatus, Gameboard, LeaderboardEntry,
  ConnectionProfile, AvailableProfile, Match, NewBoardData
} from '../types';



const API_URL = window.pwaThemeVariables?.apiUrl || import.meta.env.VITE_API_URL || 'https://buildyourwolfpack-1.onrender.com';
console.log('🐺⚡ API Initialized (v3.5-RESURRECTION):', {
  window: window.pwaThemeVariables?.apiUrl,
  env: import.meta.env.VITE_API_URL,
  final: API_URL
});

async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  data?: any,
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = typeof errorData.detail === 'object'
      ? JSON.stringify(errorData.detail)
      : (errorData.detail || `API error: ${response.status}`);
    throw new Error(errorMessage);
  }

  return response.json();
}

export const authApi = {
  register: (userData: { firebase_uid: string; email: string; name: string; referred_by?: string | null }) =>
    apiRequest<User>('/api/auth/register', 'POST', userData),

  getCurrentUser: (token: string) =>
    apiRequest<User>('/api/auth/me', 'GET', undefined, token),

  updateUser: (token: string, userData: Partial<User>) =>
    apiRequest<User>('/api/auth/me', 'PUT', userData, token),

  selectCard: (token: string, cardId: string) =>
    apiRequest<User>('/api/cards/select', 'POST', { card_id: cardId }, token),

  initializeChat: (userId: string) =>
    apiRequest<{ message: string; chatId: string }>('/api/initialize-chat', 'POST', { userId }),
};

export const cardsApi = {
  getAllCards: () =>
    apiRequest<Card[]>('/api/cards/'),

  getUserCard: (token: string) =>
    apiRequest<Card>('/api/cards/user', 'GET', undefined, token),
};

export const projectsApi = {
  createProject: (token: string, projectData: { name: string; description: string }) =>
    apiRequest<Project>('/api/projects', 'POST', projectData, token),

  getUserProjects: (token: string) =>
    apiRequest<Project[]>('/api/projects', 'GET', undefined, token),

  getProject: (token: string, projectId: string) =>
    apiRequest<ProjectWithEquity>(`/api/projects/${projectId}`, 'GET', undefined, token),

  updateProject: (token: string, projectId: string, projectData: Partial<Project>) =>
    apiRequest<Project>(`/api/projects/${projectId}`, 'PUT', projectData, token),

  addMember: (token: string, projectId: string, userId: string) =>
    apiRequest<Project>(`/api/projects/${projectId}/members`, 'POST', { user_id: userId }, token),

  removeMember: (token: string, projectId: string, userId: string) =>
    apiRequest<Project>(`/api/projects/${projectId}/members/${userId}`, 'DELETE', undefined, token),
};

export const tasksApi = {
  createTask: (token: string, taskData: {
    title: string;
    description: string;
    project_id: string;
    assigned_to: string[];
    ivp_value: number;
    approach?: string;
    pace?: string;
    step_number?: number;
    objective?: string;
    deliverables?: string[];
  }) =>
    apiRequest<Task>('/api/tasks', 'POST', taskData, token),

  getProjectTasks: (token: string, projectId: string) =>
    apiRequest<Task[]>(`/api/tasks/project/${projectId}`, 'GET', undefined, token),

  getTask: (token: string, taskId: string) =>
    apiRequest<Task>(`/api/tasks/${taskId}`, 'GET', undefined, token),

  updateTask: (token: string, taskId: string, taskData: Partial<Task>) =>
    apiRequest<Task>(`/api/tasks/${taskId}`, 'PUT', taskData, token),

  updateTaskStatus: (token: string, taskId: string, status: TaskStatus) =>
    apiRequest<Task>(`/api/tasks/${taskId}/status`, 'PUT', { status }, token),

  completeTask: (token: string, taskId: string) =>
    apiRequest<Task>(`/api/tasks/${taskId}/complete`, 'POST', undefined, token),
};

export const gameboardApi = {
  getProjectGameboard: (token: string, projectId: string) =>
    apiRequest<Gameboard>(`/api/gameboard/project/${projectId}`, 'GET', undefined, token),

  getGlobalGameboard: (token: string) =>
    apiRequest<Gameboard>('/api/gameboard/global', 'GET', undefined, token),
};

export const leaderboardApi = {
  getLeaderboardByIVP: (token: string) =>
    apiRequest<LeaderboardEntry[]>('/api/leaderboard/by-ivp', 'GET', undefined, token),

  getLeaderboardByTiles: (token: string) =>
    apiRequest<LeaderboardEntry[]>('/api/leaderboard/by-tiles', 'GET', undefined, token),
};

export const connectionsApi = {
  createProfile: (token: string, profileData: { bio: string; skills: string[]; needs: string[]; status?: string }) =>
    apiRequest<ConnectionProfile>('/api/connections/profile', 'POST', profileData, token),

  getProfile: (token: string) =>
    apiRequest<ConnectionProfile>('/api/connections/profile', 'GET', undefined, token),

  updateProfile: (token: string, profileData: Partial<ConnectionProfile>) =>
    apiRequest<ConnectionProfile>('/api/connections/profile', 'PUT', profileData, token),

  getAvailableProfiles: (token: string) =>
    apiRequest<AvailableProfile[]>('/api/connections/profiles', 'GET', undefined, token),

  matchWithUser: (token: string, targetUserId: string) =>
    apiRequest<{ success: boolean; matched: boolean }>(`/api/connections/${targetUserId}/match`, 'POST', undefined, token),

  getMatches: (token: string) =>
    apiRequest<Match[]>('/api/connections/matches', 'GET', undefined, token),

  createBoardForMatch: (token: string, matchUserId: string, boardData: NewBoardData) =>
    apiRequest<Project>(`/api/connections/matches/${matchUserId}/create-board`, 'POST', boardData, token),
};

export const matchmakerApi = {
  updateLocation: (token: string, location: { lat: number; long: number }) =>
    apiRequest<{ message: string }>('/api/matchmaker/update-location', 'POST', location, token),

  getNearbyWolves: (token: string, lat: number, long: number, radius: number = 50) =>
    apiRequest<any[]>(`/api/matchmaker/radar?userId=me&lat=${lat}&long=${long}&radius=${radius}`, 'GET', undefined, token),

  findVenue: (token: string, coordinates: number[][]) =>
    apiRequest<any>('/api/matchmaker/venue', 'POST', { coordinates }, token),
};

export const placesApi = {
  getNearbyPlaces: (token: string, lat: number, long: number) =>
    apiRequest<any[]>(`/api/places/nearby?lat=${lat}&long=${long}`, 'GET', undefined, token),
};

export const profileApi = {
  updateMyProfile: (token: string, data: any) =>
    apiRequest<{ message: string }>('/api/profile/me', 'PUT', data, token),

  getUserProfile: (token: string, userId: string) =>
    apiRequest<any>(`/api/profile/${userId}`, 'GET', undefined, token),
};

export const chatApi = {
  startChat: (token: string, recipientId: string, recipientName: string) =>
    apiRequest<{ chatId: string }>('/api/chat/start-chat', 'POST', { recipientId, recipientName }, token),
};

export const packApi = {
  createPack: (token: string, name: string, mission: string) =>
    apiRequest<any>('/api/packs', 'POST', { name, mission }, token),
  getMyPacks: (token: string) =>
    apiRequest<any[]>('/api/packs/me', 'GET', undefined, token),
  getPack: (token: string, packId: string) =>
    apiRequest<any>(`/api/packs/${packId}`, 'GET', undefined, token),
  joinPack: (token: string, packId: string) =>
    apiRequest<any>(`/api/packs/${packId}/join`, 'POST', {}, token),
  leavePack: (token: string, packId: string) =>
    apiRequest<any>(`/api/packs/${packId}/leave`, 'POST', {}, token),
};
// ... previous exports

export const gameApi = {
  getScores: (token: string) =>
    apiRequest<{ grind: number; kill: number; efficiency: number; ivp: number }>('/api/game/scores', 'GET', undefined, token),

  revertAction: (token: string, actionType: 'KILL' | 'GRIND', taskId: string) =>
    apiRequest<{ grind: number; kill: number; efficiency: number }>('/api/game/revert', 'POST', { actionType, taskId }, token),
};
