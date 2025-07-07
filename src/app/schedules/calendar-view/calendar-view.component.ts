import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Appointment, APPOINTMENT_TYPES, APPOINTMENT_STATUSES } from '../schedule.model';
import { ScheduleService } from '../schedule.service';

@Component({
  selector: 'app-calendar-view',
  imports: [CommonModule, RouterModule],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss'
})
export class CalendarViewComponent implements OnInit {
  appointments: Appointment[] = [];
  todaysAppointments: Appointment[] = [];
  upcomingAppointments: Appointment[] = [];
  loading = false;
  error: string | null = null;
  currentDate = new Date();
  currentView: 'month' | 'week' | 'day' | 'list' = 'month';
  appointmentTypes = APPOINTMENT_TYPES;
  appointmentStatuses = APPOINTMENT_STATUSES;

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit(): void {
    this.loadTodaysAppointments();
    this.loadUpcomingAppointments();
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    this.error = null;
    
    const startDate = this.getViewStartDate();
    const endDate = this.getViewEndDate();
    
    this.scheduleService.getAppointments(startDate, endDate).subscribe({
      next: (response) => {
        this.appointments = Array.isArray(response) ? response : (response as any).results || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Fehler beim Laden der Termine';
        this.loading = false;
        console.error('Error loading appointments:', err);
      }
    });
  }

  loadTodaysAppointments(): void {
    this.scheduleService.getTodaysAppointments().subscribe({
      next: (response) => {
        this.todaysAppointments = Array.isArray(response) ? response : (response as any).results || [];
      },
      error: (err) => {
        console.error('Error loading today\'s appointments:', err);
      }
    });
  }

  loadUpcomingAppointments(): void {
    this.scheduleService.getUpcomingAppointments(7).subscribe({
      next: (response) => {
        this.upcomingAppointments = Array.isArray(response) ? response : (response as any).results || [];
      },
      error: (err) => {
        console.error('Error loading upcoming appointments:', err);
      }
    });
  }

  deleteAppointment(id: number): void {
    if (confirm('Sind Sie sicher, dass Sie diesen Termin löschen möchten?')) {
      this.scheduleService.deleteAppointment(id).subscribe({
        next: () => {
          this.loadAppointments();
          this.loadTodaysAppointments();
          this.loadUpcomingAppointments();
        },
        error: (err) => {
          this.error = 'Fehler beim Löschen des Termins';
          console.error('Error deleting appointment:', err);
        }
      });
    }
  }

  updateAppointmentStatus(id: number, status: string): void {
    this.scheduleService.updateAppointmentStatus(id, status).subscribe({
      next: () => {
        this.loadAppointments();
        this.loadTodaysAppointments();
        this.loadUpcomingAppointments();
      },
      error: (err) => {
        this.error = 'Fehler beim Aktualisieren des Terminstatus';
        console.error('Error updating appointment status:', err);
      }
    });
  }

  sendConfirmation(id: number): void {
    this.scheduleService.sendAppointmentConfirmation(id).subscribe({
      next: () => {
        // Success feedback could be added here
      },
      error: (err) => {
        this.error = 'Fehler beim Senden der Bestätigung';
        console.error('Error sending confirmation:', err);
      }
    });
  }

  sendReminder(id: number): void {
    this.scheduleService.sendAppointmentReminder(id).subscribe({
      next: () => {
        // Success feedback could be added here
      },
      error: (err) => {
        this.error = 'Fehler beim Senden der Erinnerung';
        console.error('Error sending reminder:', err);
      }
    });
  }

  changeView(view: 'month' | 'week' | 'day' | 'list'): void {
    this.currentView = view;
    this.loadAppointments();
  }

  previousPeriod(): void {
    switch (this.currentView) {
      case 'month':
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
        break;
      case 'week':
        this.currentDate = new Date(this.currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'day':
        this.currentDate = new Date(this.currentDate.getTime() - 24 * 60 * 60 * 1000);
        break;
    }
    this.loadAppointments();
  }

  nextPeriod(): void {
    switch (this.currentView) {
      case 'month':
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
        break;
      case 'week':
        this.currentDate = new Date(this.currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'day':
        this.currentDate = new Date(this.currentDate.getTime() + 24 * 60 * 60 * 1000);
        break;
    }
    this.loadAppointments();
  }

  today(): void {
    this.currentDate = new Date();
    this.loadAppointments();
  }

  private getViewStartDate(): Date {
    switch (this.currentView) {
      case 'month':
        return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
      case 'week':
        const startOfWeek = new Date(this.currentDate);
        startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());
        return startOfWeek;
      case 'day':
        return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate());
      default:
        return new Date();
    }
  }

  private getViewEndDate(): Date {
    switch (this.currentView) {
      case 'month':
        return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
      case 'week':
        const endOfWeek = new Date(this.currentDate);
        endOfWeek.setDate(this.currentDate.getDate() + (6 - this.currentDate.getDay()));
        return endOfWeek;
      case 'day':
        return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), 23, 59, 59);
      default:
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
        return oneMonthLater;
    }
  }

  getAppointmentTypeInfo(type: string) {
    return this.appointmentTypes.find(t => t.value === type) || this.appointmentTypes[0];
  }

  getStatusBadgeClass(status: string): string {
    const statusObj = this.appointmentStatuses.find(s => s.value === status);
    return statusObj ? `badge bg-${statusObj.color}` : 'badge bg-secondary';
  }

  getStatusLabel(status: string): string {
    const statusObj = this.appointmentStatuses.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  }

  formatTime(dateTime: Date): string {
    return new Date(dateTime).toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  isToday(date: Date): boolean {
    const today = new Date();
    const checkDate = new Date(date);
    return checkDate.toDateString() === today.toDateString();
  }

  isPast(dateTime: Date): boolean {
    return new Date(dateTime) < new Date();
  }
}
