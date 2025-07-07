import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimeEntry, TimeSheet, TimeReport, TimeEntryFilter } from './timetracking.model';

@Injectable({
  providedIn: 'root'
})
export class TimetrackingService {
  private apiUrl = 'http://localhost:8000/api/v1/timetracking';

  constructor(private http: HttpClient) { }

  getTimeEntries(filter?: TimeEntryFilter): Observable<TimeEntry[]> {
    let params = new HttpParams();
    if (filter) {
      if (filter.employee) params = params.set('employee', filter.employee.toString());
      if (filter.project) params = params.set('project', filter.project.toString());
      if (filter.date_from) params = params.set('date_from', filter.date_from.toISOString().split('T')[0]);
      if (filter.date_to) params = params.set('date_to', filter.date_to.toISOString().split('T')[0]);
      if (filter.is_billable !== undefined) params = params.set('is_billable', filter.is_billable.toString());
      if (filter.is_approved !== undefined) params = params.set('is_approved', filter.is_approved.toString());
    }
    return this.http.get<TimeEntry[]>(`${this.apiUrl}/entries/`, { params });
  }

  getTimeEntry(id: string): Observable<TimeEntry> {
    return this.http.get<TimeEntry>(`${this.apiUrl}/entries/${id}/`);
  }

  createTimeEntry(entry: Partial<TimeEntry>): Observable<TimeEntry> {
    return this.http.post<TimeEntry>(`${this.apiUrl}/entries/`, entry);
  }

  updateTimeEntry(id: string, entry: Partial<TimeEntry>): Observable<TimeEntry> {
    return this.http.put<TimeEntry>(`${this.apiUrl}/entries/${id}/`, entry);
  }

  deleteTimeEntry(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/entries/${id}/`);
  }

  startTimer(projectId?: number, taskDescription?: string): Observable<TimeEntry> {
    // Create new time entry with correct field names
    const now = new Date();
    return this.http.post<TimeEntry>(`${this.apiUrl}/entries/`, {
      entry_type: 'work',
      date: now.toISOString().split('T')[0],
      start_time: now.toTimeString().split(' ')[0],
      project: projectId,
      description: taskDescription || 'Neuer Eintrag',
      is_billable: true
    });
  }

  stopTimer(id: string): Observable<TimeEntry> {
    // Update time entry with end time
    const now = new Date();
    return this.http.patch<TimeEntry>(`${this.apiUrl}/entries/${id}/`, {
      end_time: now.toTimeString().split(' ')[0]
    });
  }

  getRunningTimer(): Observable<TimeEntry[]> {
    // Get entries without end_time (running entries)
    return this.http.get<TimeEntry[]>(`${this.apiUrl}/entries/my_entries/`);
  }

  getTimeSheets(): Observable<TimeSheet[]> {
    return this.http.get<TimeSheet[]>(`${this.apiUrl}/timesheets/`);
  }

  getTimeSheet(id: number): Observable<TimeSheet> {
    return this.http.get<TimeSheet>(`${this.apiUrl}/timesheets/${id}/`);
  }

  generateTimeSheet(weekStart: Date): Observable<TimeSheet> {
    return this.http.post<TimeSheet>(`${this.apiUrl}/timesheets/generate/`, {
      week_start: weekStart.toISOString().split('T')[0]
    });
  }

  submitTimeSheet(id: number): Observable<TimeSheet> {
    return this.http.post<TimeSheet>(`${this.apiUrl}/timesheets/${id}/submit/`, {});
  }

  approveTimeSheet(id: number): Observable<TimeSheet> {
    return this.http.post<TimeSheet>(`${this.apiUrl}/timesheets/${id}/approve/`, {});
  }

  rejectTimeSheet(id: number, reason?: string): Observable<TimeSheet> {
    return this.http.post<TimeSheet>(`${this.apiUrl}/timesheets/${id}/reject/`, { reason });
  }

  getTimeReports(startDate: Date, endDate: Date, userId?: number, projectId?: number): Observable<TimeReport[]> {
    let params = new HttpParams()
      .set('start_date', startDate.toISOString().split('T')[0])
      .set('end_date', endDate.toISOString().split('T')[0]);
    
    if (userId) params = params.set('user', userId.toString());
    if (projectId) params = params.set('project', projectId.toString());

    return this.http.get<TimeReport[]>(`${this.apiUrl}/reports/`, { params });
  }
}
