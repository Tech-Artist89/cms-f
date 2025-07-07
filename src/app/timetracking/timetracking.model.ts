export interface TimeEntry {
  id: string;
  employee: number;
  employee_name?: string;
  entry_type: 'work' | 'break' | 'travel' | 'meeting';
  date: string;
  start_time: string;
  end_time?: string | null;
  duration_hours: number;
  project?: number;
  project_name?: string;
  customer?: number;
  customer_name?: string;
  description: string;
  location?: string;
  is_billable: boolean;
  is_overtime: boolean;
  is_approved: boolean;
  is_invoiced: boolean;
  approved_by?: number;
  approved_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TimeSheet {
  id: number;
  user: number;
  user_name?: string;
  week_start: Date;
  week_end: Date;
  total_hours: number;
  billable_hours: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submitted_at?: Date;
  approved_at?: Date;
  approved_by?: number;
  approved_by_name?: string;
  entries: TimeEntry[];
}

export interface TimeReport {
  user: number;
  user_name?: string;
  project?: number;
  project_name?: string;
  period_start: Date;
  period_end: Date;
  total_hours: number;
  billable_hours: number;
  total_amount: number;
  entries_count: number;
}

export interface TimeEntryFilter {
  employee?: number;
  project?: number;
  date_from?: Date;
  date_to?: Date;
  is_billable?: boolean;
  is_approved?: boolean;
}