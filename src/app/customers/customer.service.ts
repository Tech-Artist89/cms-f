import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, CustomerAddress, CustomerContact, CustomerNote } from './customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:8000/api/v1/customers/customers';

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/`);
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}/`);
  }

  createCustomer(customer: Partial<Customer>): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/`, customer);
  }

  updateCustomer(id: number, customer: Partial<Customer>): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}/`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }

  getCustomerAddresses(customerId: number): Observable<CustomerAddress[]> {
    return this.http.get<CustomerAddress[]>(`${this.apiUrl}/${customerId}/addresses/`);
  }

  getCustomerContacts(customerId: number): Observable<CustomerContact[]> {
    return this.http.get<CustomerContact[]>(`${this.apiUrl}/${customerId}/contacts/`);
  }

  getCustomerNotes(customerId: number): Observable<CustomerNote[]> {
    return this.http.get<CustomerNote[]>(`${this.apiUrl}/${customerId}/notes/`);
  }
}
