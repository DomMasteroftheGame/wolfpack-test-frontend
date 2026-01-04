export interface User {
  id: string;
  firebase_uid: string;
  email: string;
  name: string;
  selected_card_id: string | null;
  created_at: string;
  updated_at: string;
  invites_count: number;
  level: number;
  referred_by_id?: string | null;
}

export interface Card {
  id: string;
  name: string;
  description: string;
  image_url: string;
  target_market?: string;
  pricing?: string;
  marketing_strategy?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  members: string[];
  created_at: string;
  updated_at: string;
}

export interface ProjectWithEquity extends Project {
  equity: Record<string, number>;
}

export enum TaskStatus {
  BACKLOG = "backlog",
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  DONE = "done"
}

export interface Task {
  id: string;
  title: string;
  description: string;
  project_id: string;
  assigned_to: string[];
  ivp_value: number;
  approach?: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  completed_by?: string;
  step_number?: number;
  pace?: string;
  objective?: string;
  deliverables?: string[];
  speed_notification_rule?: string;
  lastUpdated?: string; // Protocol: timestamp
  nextReminder?: string; // Protocol: timestamp
  ivp?: number; // Alias for ivp_value
  assigneeIds?: string[]; // Alias for assigned_to
}

export interface GameboardTile {
  task_id: string;
  task_title: string;
  user_id: string;
  user_name: string;
  ivp_value: number;
  placed_at: string;
}

export interface Gameboard {
  id: string;
  project_id: string;
  tiles: (GameboardTile | null)[];
  next_available_tile: number;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  total_ivp: number;
  total_tiles_filled: number;
}

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export interface ConnectionProfile {
  user_id: string;
  bio: string;
  skills: string[];
  needs: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AvailableProfile extends ConnectionProfile {
  name: string;
  email: string;
}

export interface Match {
  user_id: string;
  name: string;
  email: string;
  matched_on: string;
  board_id: string | null;
}

export interface NewBoardData {
  name: string;
  description: string;
}

export interface AlphaPitch {
  headline?: string;
  strategy?: string;
}
