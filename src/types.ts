
export type TaskStatus = 'backlog' | 'todo' | 'doing' | 'done';
export type ExecutionMethod = 'build' | 'buy' | 'outsource' | 'partner' | null;
export type Pace = 'crawl' | 'walk' | 'run';
// Added ViewMode for dashboard navigation state
export type ViewMode = 'roadmap' | 'radar' | 'pack' | 'intel' | 'profile' | 'calendar' | 'kanban';

export interface WolfStats {
  grind: number; // Inputs (Calls, Commits, etc.)
  kill: number;  // Outputs (Deals, Features, etc.)
  efficiency: number; // Kill / Grind ratio * 100
  rating: number; // 0-100 Public Score
}

export interface Task {
  id: string | number; // Allow string IDs for Kanban
  title?: string;
  description?: string;
  objective?: string;
  deliverables?: string[];
  ivp?: number;
  status: TaskStatus;
  assignedTo?: 'labor' | 'finance' | 'sales' | string | null; // Updated to allow string ID
  assigneeIds?: string[]; // Specific user IDs
  assignees?: { id: string; name: string; avatar?: string; role?: string }[]; // Detailed assignee info for rendering
  assigneeName?: string; // Legacy support
  assigneeAvatar?: string; // Legacy support
  method?: ExecutionMethod;
  pace?: Pace;
  
  // Wolf Math & Constraints
  deadline?: string; // ISO Date
  completedAt?: string; // ISO Date
  budget?: number; // Estimated Cost
  actualCost?: number; // Real Cost
  grindCount?: number; // How many "actions" performed on this task. High grind w/o completion = Low Efficiency.
  heat?: number; // Visual indicator 0-100 of how "hot" (grindy) a task is becoming.
}

export interface MatchProfile {
  id: string;
  name: string;
  role: 'labor' | 'finance' | 'sales';
  tagline: string;
  avatar: string;
  distance: string; // "City, Country" or "X miles"
  location?: string; // Actual city for matching
  coordinates?: [number, number]; // [long, lat] or relative [x, y] for Radar
  skills: string[];
  stats: {
    build: number;
    fund: number;
    connect: number;
  };
  hunting: string;
  linkedin?: string;
}

export interface ActivityLog {
    id: string;
    wolfName: string;
    action: string; // "Just closed a seed round", "Committed code", etc.
    type: 'kill' | 'grind' | 'social';
    timestamp: string;
}

export interface AlphaPitch {
  headline: string;
  strategy: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  withWolfId: string;
  withWolfName: string;
  date: string; // ISO
  location: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Message {
  _id?: string; // MongoDB internal ID
  id?: string;
  fromId: string;
  toId: string;
  content: string;
  timestamp: string;
}

export interface PeerRating {
  fromId: string;
  toId: string;
  trust: number;
  skill: number;
  vibe: number;
  timestamp: string;
}

export interface User {
  _id: string;
  email: string;
  name?: string; // Added for profile
  location?: string; // Added for matchmaking
  bio?: string; // Tagline
  skills?: string[]; // Added for matching

  selected_card_id: string | null;
  selected_product_id: number | null;
  ivp: number;
  pace: Pace;
  homebase?: string;
  tasks: Task[];
  wolfpack: MatchProfile[];
  events: CalendarEvent[];
  activityFeed?: ActivityLog[]; // For the ticker
  
  // Gamification State
  onboardingStep: number; // 0: Fresh, 1: Card, 2: Startup, 3: Dashboard Tour Done

  // Profile
  alphaPitch?: AlphaPitch;

  // Ratings
  selfStats: { build: number, fund: number, connect: number }; // Private Score (Identity)
  publicStats: { build: number, fund: number, connect: number }; // Public Score (Performance)
  
  // Detailed Wolf Math History
  roleHistory: {
    labor: WolfStats;
    finance: WolfStats;
    sales: WolfStats;
  };

  createdAt: string;
  updatedAt?: string;
}

export interface Card {
  id: string;
  type: 'labor' | 'finance' | 'sales';
  name: string;
  description: string;
}

export interface GameSpace {
  id: number;
  name: string;
  description: string;
  phase: 'Measure' | 'Build' | 'Learn';
}

export interface ProductCard {
  id: number;
  title: string;
  targetMarket: string;
  price: string;
  marketingChannels: string;
}

declare global {
  interface Window {
    pwaThemeVariables?: {
      gameAssets?: {
        cardLabor: string;
        cardFinance: string;
        cardSales: string;
        logoGold: string;
      };
    };
  }
}
