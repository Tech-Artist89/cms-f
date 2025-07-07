import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Invoice, INVOICE_STATUSES } from '../invoice.model';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-invoice-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss'
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  loading = false;
  error: string | null = null;
  invoiceStatuses = INVOICE_STATUSES;

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading = true;
    this.error = null;
    
    this.invoiceService.getInvoices().subscribe({
      next: (response) => {
        this.invoices = Array.isArray(response) ? response : (response as any).results || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Fehler beim Laden der Rechnungen';
        this.loading = false;
        console.error('Error loading invoices:', err);
      }
    });
  }

  deleteInvoice(id: number): void {
    if (confirm('Sind Sie sicher, dass Sie diese Rechnung löschen möchten?')) {
      this.invoiceService.deleteInvoice(id).subscribe({
        next: () => {
          this.loadInvoices();
        },
        error: (err) => {
          this.error = 'Fehler beim Löschen der Rechnung';
          console.error('Error deleting invoice:', err);
        }
      });
    }
  }

  markAsPaid(id: number): void {
    const paymentDate = new Date();
    this.invoiceService.markAsPaid(id, paymentDate).subscribe({
      next: () => {
        this.loadInvoices();
      },
      error: (err) => {
        this.error = 'Fehler beim Markieren als bezahlt';
        console.error('Error marking as paid:', err);
      }
    });
  }

  sendInvoice(id: number): void {
    this.invoiceService.sendInvoice(id).subscribe({
      next: () => {
        this.loadInvoices();
      },
      error: (err) => {
        this.error = 'Fehler beim Versenden der Rechnung';
        console.error('Error sending invoice:', err);
      }
    });
  }

  generatePdf(id: number): void {
    this.invoiceService.generatePdf(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rechnung-${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.error = 'Fehler beim Generieren der PDF';
        console.error('Error generating PDF:', err);
      }
    });
  }

  duplicateInvoice(id: number): void {
    this.invoiceService.duplicateInvoice(id).subscribe({
      next: () => {
        this.loadInvoices();
      },
      error: (err) => {
        this.error = 'Fehler beim Duplizieren der Rechnung';
        console.error('Error duplicating invoice:', err);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    const statusObj = this.invoiceStatuses.find(s => s.value === status);
    return statusObj ? `badge bg-${statusObj.color}` : 'badge bg-secondary';
  }

  getStatusLabel(status: string): string {
    const statusObj = this.invoiceStatuses.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  }

  isOverdue(invoice: Invoice): boolean {
    return invoice.status !== 'paid' && new Date(invoice.due_date) < new Date();
  }

  getDaysOverdue(dueDate: Date): number {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
