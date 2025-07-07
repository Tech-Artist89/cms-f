export interface Appointment {
  id: number;
  title: string;
  description?: string;
  start_datetime: Date;
  end_datetime: Date;
  all_day: boolean;
  location?: string;
  customer?: number;
  customer_name?: string;
  project?: number;
  project_name?: string;
  assigned_user?: number;
  assigned_user_name?: string;
  appointment_type: 'meeting' | 'site_visit' | 'installation' | 'maintenance' | 'consultation' | 'other';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
  reminder_minutes?: number;
  recurring?: boolean;
  recurring_pattern?: RecurringPattern;
  created_at: Date;
  updated_at: Date;
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  days_of_week?: number[];
  end_date?: Date;
  occurrences?: number;
}

export interface AppointmentType {
  value: string;
  label: string;
  color: string;
  icon: string;
}

export const APPOINTMENT_TYPES: AppointmentType[] = [
  { value: 'meeting', label: 'Besprechung', color: 'primary', icon: 'people' },
  { value: 'site_visit', label: 'Vor-Ort-Besuch', color: 'info', icon: 'geo-alt' },
  { value: 'installation', label: 'Installation', color: 'success', icon: 'tools' },
  { value: 'maintenance', label: 'Wartung', color: 'warning', icon: 'gear' },
  { value: 'consultation', label: 'Beratung', color: 'secondary', icon: 'chat' },
  { value: 'other', label: 'Sonstiges', color: 'dark', icon: 'calendar-event' }
];

export interface AppointmentStatus {
  value: string;
  label: string;
  color: string;
}

export const APPOINTMENT_STATUSES: AppointmentStatus[] = [
  { value: 'scheduled', label: 'Geplant', color: 'secondary' },
  { value: 'confirmed', label: 'Bestätigt', color: 'primary' },
  { value: 'in_progress', label: 'In Bearbeitung', color: 'info' },
  { value: 'completed', label: 'Abgeschlossen', color: 'success' },
  { value: 'cancelled', label: 'Abgesagt', color: 'danger' },
  { value: 'no_show', label: 'Nicht erschienen', color: 'warning' }
];

export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: {
    appointment: Appointment;
  };
}

export interface AvailabilitySlot {
  start_time: Date;
  end_time: Date;
  user?: number;
  user_name?: string;
  available: boolean;
}