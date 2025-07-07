import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Invoice, INVOICE_STATUSES } from '../invoice.model';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-invoice-detail',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.scss'
})
export class InvoiceDetailComponent implements OnInit {
  invoiceForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  invoiceId: string | null = null;
  invoiceStatuses = INVOICE_STATUSES;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService
  ) {
    this.invoiceForm = this.createForm();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.invoiceId = params['id'];
        this.isEditMode = true;
        this.loadInvoice();
      } else {
        this.initializeNewInvoice();
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      invoice_number: ['', [Validators.required]],
      customer: ['', [Validators.required]],
      project: [''],
      title: ['', [Validators.required]],
      description: [''],
      status: ['draft', [Validators.required]],
      issue_date: ['', [Validators.required]],
      due_date: ['', [Validators.required]],
      payment_terms: [30, [Validators.required, Validators.min(1)]],
      tax_rate: [19, [Validators.required, Validators.min(0), Validators.max(100)]],
      discount_percentage: [0, [Validators.min(0), Validators.max(100)]],
      notes: ['']
    });
  }

  private initializeNewInvoice() {
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    
    this.invoiceForm.patchValue({
      status: 'draft',
      issue_date: today.toISOString().split('T')[0],
      due_date: dueDate.toISOString().split('T')[0],
      payment_terms: 30,
      tax_rate: 19,
      discount_percentage: 0
    });
  }

  private loadInvoice() {
    if (this.invoiceId) {
      this.isLoading = true;
      this.invoiceService.getInvoice(+this.invoiceId).subscribe({
        next: (invoice) => {
          this.populateForm(invoice);
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Fehler beim Laden der Rechnung';
          this.isLoading = false;
          console.error('Error loading invoice:', error);
        }
      });
    }
  }

  private populateForm(invoice: Invoice) {
    this.invoiceForm.patchValue({
      invoice_number: invoice.invoice_number,
      customer: invoice.customer,
      project: invoice.project,
      title: invoice.title,
      description: invoice.description,
      status: invoice.status,
      issue_date: invoice.issue_date ? new Date(invoice.issue_date).toISOString().split('T')[0] : '',
      due_date: invoice.due_date ? new Date(invoice.due_date).toISOString().split('T')[0] : '',
      payment_terms: invoice.payment_terms,
      tax_rate: invoice.tax_rate,
      discount_percentage: invoice.discount_percentage || 0,
      notes: invoice.notes
    });
  }

  onSubmit() {
    if (this.invoiceForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const invoiceData: Partial<Invoice> = {
        ...this.invoiceForm.value,
        issue_date: new Date(this.invoiceForm.value.issue_date),
        due_date: new Date(this.invoiceForm.value.due_date)
      };

      const operation = this.isEditMode && this.invoiceId
        ? this.invoiceService.updateInvoice(+this.invoiceId, invoiceData)
        : this.invoiceService.createInvoice(invoiceData);

      operation.subscribe({
        next: (invoice) => {
          this.isLoading = false;
          this.router.navigate(['/invoices']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Fehler beim Speichern der Rechnung';
          console.error('Error saving invoice:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.invoiceForm);
    }
  }

  cancel() {
    this.router.navigate(['/invoices']);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }
}
