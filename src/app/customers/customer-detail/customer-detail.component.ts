import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from '../customer.model';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-customer-detail',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.scss'
})
export class CustomerDetailComponent implements OnInit {
  customerForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  customerId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService
  ) {
    this.customerForm = this.createForm();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.customerId = params['id'];
        this.isEditMode = true;
        this.loadCustomer();
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      customer_number: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      salutation: [''],
      title: [''],
      email: ['', [Validators.email]],
      phone: [''],
      mobile: [''],
      fax: [''],
      customer_type: ['private', [Validators.required]],
      category: ['B', [Validators.required]]
    });
  }

  private loadCustomer() {
    if (this.customerId) {
      this.isLoading = true;
      this.customerService.getCustomer(+this.customerId).subscribe({
        next: (customer) => {
          this.populateForm(customer);
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Fehler beim Laden des Kunden';
          this.isLoading = false;
          console.error('Error loading customer:', error);
        }
      });
    }
  }

  private populateForm(customer: Customer) {
    this.customerForm.patchValue({
      customer_number: customer.customer_number,
      first_name: customer.first_name,
      last_name: customer.last_name,
      salutation: customer.salutation,
      title: customer.title,
      email: customer.email,
      phone: customer.phone,
      mobile: customer.mobile,
      fax: customer.fax,
      customer_type: customer.customer_type,
      category: customer.category
    });
  }

  onSubmit() {
    if (this.customerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const customerData: Partial<Customer> = this.customerForm.value;

      const operation = this.isEditMode && this.customerId
        ? this.customerService.updateCustomer(+this.customerId, customerData)
        : this.customerService.createCustomer(customerData);

      operation.subscribe({
        next: (customer) => {
          this.isLoading = false;
          this.router.navigate(['/customers']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Fehler beim Speichern des Kunden';
          console.error('Error saving customer:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.customerForm);
    }
  }

  cancel() {
    this.router.navigate(['/customers']);
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
