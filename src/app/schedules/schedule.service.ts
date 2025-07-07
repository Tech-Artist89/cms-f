import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, CalendarEvent, AvailabilitySlot } from './schedule.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = 'http://localhost:8000/api/v1/schedules';

  constructor(private http: HttpClient) { }

  getAppointments(startDate?: Date, endDate?: Date, userId?: number): Observable<Appointment[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate.toISOString().split('T')[0]);
    if (endDate) params = params.set('end_date', endDate.toISOString().split('T')[0]);
    if (userId) params = params.set('user', userId.toString());
    
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments/`, { params });
  }

  getAppointment(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/appointments/${id}/`);
  }

  createAppointment(appointment: Partial<Appointment>): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/appointments/`, appointment);
  }

  updateAppointment(id: number, appointment: Partial<Appointment>): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/appointments/${id}/`, appointment);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/appointments/${id}/`);
  }

  getCalendarEvents(startDate: Date, endDate: Date, userId?: number): Observable<CalendarEvent[]> {
    let params = new HttpParams()
      .set('start_date', startDate.toISOString().split('T')[0])
      .set('end_date', endDate.toISOString().split('T')[0]);
    
    if (userId) params = params.set('user', userId.toString());
    
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/calendar-events/`, { params });
  }

  checkAvailability(startDate: Date, endDate: Date, userId?: number): Observable<AvailabilitySlot[]> {
    let params = new HttpParams()
      .set('start_date', startDate.toISOString())
      .set('end_date', endDate.toISOString());
    
    if (userId) params = params.set('user', userId.toString());
    
    return this.http.get<AvailabilitySlot[]>(`${this.apiUrl}/availability/`, { params });
  }

  updateAppointmentStatus(id: number, status: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.apiUrl}/appointments/${id}/`, { status });
  }

  rescheduleAppointment(id: number, newStartTime: Date, newEndTime: Date): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.apiUrl}/appointments/${id}/reschedule/`, {
      start_datetime: newStartTime.toISOString(),
      end_datetime: newEndTime.toISOString()
    });
  }

  getUpcomingAppointments(days: number = 7): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments/upcoming/?days=${days}`);
  }

  getTodaysAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments/today/`);
  }

  sendAppointmentConfirmation(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/appointments/${id}/send-confirmation/`, {});
  }

  sendAppointmentReminder(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/appointments/${id}/send-reminder/`, {});
  }

  createRecurringAppointments(baseAppointment: Partial<Appointment>): Observable<Appointment[]> {
    return this.http.post<Appointment[]>(`${this.apiUrl}/appointments/create-recurring/`, baseAppointment);
  }
}
