export interface Project {
  id: number;
  project_number: string;
  name: string;
  description?: string;
  customer: number;
  customer_name?: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date: Date;
  end_date?: Date;
  planned_end_date?: Date;
  responsible_user?: number;
  responsible_user_name?: string;
  budget?: number;
  actual_cost?: number;
  progress_percentage: number;
  created_at: Date;
  updated_at: Date;
  tasks: ProjectTask[];
  quote?: number;
}

export interface ProjectTask {
  id: number;
  project: number;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: number;
  assigned_to_name?: string;
  due_date?: Date;
  estimated_hours?: number;
  actual_hours?: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectStatus {
  value: string;
  label: string;
  color: string;
}

export const PROJECT_STATUSES: ProjectStatus[] = [
  { value: 'planning', label: 'Planung', color: 'secondary' },
  { value: 'in_progress', label: 'In Bearbeitung', color: 'primary' },
  { value: 'completed', label: 'Abgeschlossen', color: 'success' },
  { value: 'on_hold', label: 'Pausiert', color: 'warning' },
  { value: 'cancelled', label: 'Abgebrochen', color: 'danger' }
];

export const PROJECT_PRIORITIES: ProjectStatus[] = [
  { value: 'low', label: 'Niedrig', color: 'secondary' },
  { value: 'medium', label: 'Mittel', color: 'info' },
  { value: 'high', label: 'Hoch', color: 'warning' },
  { value: 'urgent', label: 'Dringend', color: 'danger' }
];