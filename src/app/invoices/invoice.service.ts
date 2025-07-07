import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice, InvoiceItem, PaymentReminder } from './invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = 'http://localhost:8000/api/v1/invoices/invoices';

  constructor(private http: HttpClient) { }

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/`);
  }

  getInvoice(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}/`);
  }

  createInvoice(invoice: Partial<Invoice>): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/`, invoice);
  }

  updateInvoice(id: number, invoice: Partial<Invoice>): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/${id}/`, invoice);
  }

  deleteInvoice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }

  generatePdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf/`, { responseType: 'blob' });
  }

  markAsPaid(id: number, paymentDate: Date): Observable<Invoice> {
    return this.http.patch<Invoice>(`${this.apiUrl}/${id}/mark-paid/`, { payment_date: paymentDate });
  }

  sendInvoice(id: number, emailAddress?: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/send/`, { email: emailAddress });
  }

  getOverdueInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/overdue/`);
  }

  createFromProject(projectId: number): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/from-project/${projectId}/`, {});
  }

  getPaymentReminders(invoiceId: number): Observable<PaymentReminder[]> {
    return this.http.get<PaymentReminder[]>(`${this.apiUrl}/${invoiceId}/reminders/`);
  }

  sendPaymentReminder(invoiceId: number, level: number): Observable<PaymentReminder> {
    return this.http.post<PaymentReminder>(`${this.apiUrl}/${invoiceId}/reminders/`, { reminder_level: level });
  }

  duplicateInvoice(id: number): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/${id}/duplicate/`, {});
  }
}
