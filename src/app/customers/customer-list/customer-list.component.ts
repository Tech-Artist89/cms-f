import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Customer } from '../customer.model';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-customer-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  loading = false;
  error: string | null = null;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.error = null;
    
    this.customerService.getCustomers().subscribe({
      next: (response) => {
        this.customers = Array.isArray(response) ? response : (response as any).results || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Fehler beim Laden der Kunden';
        this.loading = false;
        console.error('Error loading customers:', err);
      }
    });
  }

  deleteCustomer(id: number): void {
    if (confirm('Sind Sie sicher, dass Sie diesen Kunden löschen möchten?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.loadCustomers();
        },
        error: (err) => {
          this.error = 'Fehler beim Löschen des Kunden';
          console.error('Error deleting customer:', err);
        }
      });
    }
  }

  getCategoryBadgeClass(category: string): string {
    switch (category) {
      case 'A': return 'badge bg-success';
      case 'B': return 'badge bg-warning';
      case 'C': return 'badge bg-secondary';
      default: return 'badge bg-light';
    }
  }
}
