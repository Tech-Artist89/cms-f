import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quote, QuoteItem } from './quote.model';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private apiUrl = 'http://localhost:8000/api/v1/quotes/quotes';

  constructor(private http: HttpClient) { }

  getQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(`${this.apiUrl}/`);
  }

  getQuote(id: number): Observable<Quote> {
    return this.http.get<Quote>(`${this.apiUrl}/${id}/`);
  }

  createQuote(quote: Partial<Quote>): Observable<Quote> {
    return this.http.post<Quote>(`${this.apiUrl}/`, quote);
  }

  updateQuote(id: number, quote: Partial<Quote>): Observable<Quote> {
    return this.http.put<Quote>(`${this.apiUrl}/${id}/`, quote);
  }

  deleteQuote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }

  generatePdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf/`, { responseType: 'blob' });
  }

  duplicateQuote(id: number): Observable<Quote> {
    return this.http.post<Quote>(`${this.apiUrl}/${id}/duplicate/`, {});
  }

  convertToProject(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/convert-to-project/`, {});
  }
}
