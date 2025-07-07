import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TimeEntry, TimeEntryFilter } from '../timetracking.model';
import { TimetrackingService } from '../timetracking.service';

@Component({
  selector: 'app-time-entry-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './time-entry-list.component.html',
  styleUrl: './time-entry-list.component.scss'
})
export class TimeEntryListComponent implements OnInit {
  timeEntries: TimeEntry[] = [];
  runningTimer: TimeEntry | null = null;
  loading = false;
  error: string | null = null;
  filter: TimeEntryFilter = {};

  constructor(private timetrackingService: TimetrackingService) {}

  ngOnInit(): void {
    this.loadTimeEntries();
    this.loadRunningTimer();
  }

  loadTimeEntries(): void {
    this.loading = true;
    this.error = null;
    
    this.timetrackingService.getTimeEntries(this.filter).subscribe({
      next: (response) => {
        this.timeEntries = Array.isArray(response) ? response : (response as any).results || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Fehler beim Laden der Zeiteinträge';
        this.loading = false;
        console.error('Error loading time entries:', err);
      }
    });
  }

  loadRunningTimer(): void {
    this.timetrackingService.getRunningTimer().subscribe({
      next: (response) => {
        const timers = Array.isArray(response) ? response : (response as any).results || [];
        // Find running timer (entry without end_time)
        this.runningTimer = timers.find((timer: TimeEntry) => !timer.end_time) || null;
      },
      error: (err) => {
        console.error('Error loading running timer:', err);
      }
    });
  }

  startTimer(projectId?: number, taskDescription?: string): void {
    // Simple timer start with default description
    const description = taskDescription || 'Neuer Timer';
    this.timetrackingService.startTimer(projectId, description).subscribe({
      next: (timer) => {
        this.runningTimer = timer;
        this.loadTimeEntries();
        this.error = null; // Clear any previous errors
      },
      error: (err) => {
        this.error = 'Fehler beim Starten des Timers';
        console.error('Error starting timer:', err);
      }
    });
  }

  stopTimer(): void {
    if (this.runningTimer) {
      this.timetrackingService.stopTimer(this.runningTimer.id).subscribe({
        next: (timer) => {
          this.runningTimer = null;
          this.loadTimeEntries();
        },
        error: (err) => {
          this.error = 'Fehler beim Stoppen des Timers';
          console.error('Error stopping timer:', err);
        }
      });
    }
  }

  deleteTimeEntry(id: string): void {
    if (confirm('Sind Sie sicher, dass Sie diesen Zeiteintrag löschen möchten?')) {
      this.timetrackingService.deleteTimeEntry(id).subscribe({
        next: () => {
          this.loadTimeEntries();
        },
        error: (err) => {
          this.error = 'Fehler beim Löschen des Zeiteintrags';
          console.error('Error deleting time entry:', err);
        }
      });
    }
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}h`;
  }

  getRunningDuration(): string {
    if (!this.runningTimer || !this.runningTimer.start_time) return '';
    
    // Create a date from today + start_time (since start_time is just "HH:MM:SS")
    const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD
    const startDateTime = new Date(`${today}T${this.runningTimer.start_time}`);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - startDateTime.getTime()) / (1000 * 60));
    
    if (diffMinutes < 0) return 'läuft...';
    return this.formatDuration(diffMinutes);
  }

  applyFilter(): void {
    this.loadTimeEntries();
  }

  clearFilter(): void {
    this.filter = {};
    this.loadTimeEntries();
  }

  calculateTotalHours(): number {
    return this.timeEntries.reduce((total, entry) => {
      return total + (entry.duration_hours || 0);
    }, 0);
  }

  calculateBillableHours(): number {
    return this.timeEntries
      .filter(entry => entry.is_billable)
      .reduce((total, entry) => {
        return total + (entry.duration_hours || 0);
      }, 0);
  }

  formatTime(timeString: string): string {
    if (!timeString) return '-';
    // Convert "09:00:00" to "09:00"
    return timeString.substring(0, 5);
  }

}
