import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Quote, QUOTE_STATUSES } from '../quote.model';
import { QuoteService } from '../quote.service';

@Component({
  selector: 'app-quote-detail',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './quote-detail.component.html',
  styleUrl: './quote-detail.component.scss'
})
export class QuoteDetailComponent implements OnInit {
  quoteForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  quoteId: string | null = null;
  quoteStatuses = QUOTE_STATUSES;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private quoteService: QuoteService
  ) {
    this.quoteForm = this.createForm();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.quoteId = params['id'];
        this.isEditMode = true;
        this.loadQuote();
      } else {
        this.initializeNewQuote();
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      quote_number: ['', [Validators.required]],
      customer: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: [''],
      status: ['draft', [Validators.required]],
      valid_until: ['', [Validators.required]],
      tax_rate: [19, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  private initializeNewQuote() {
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);
    
    this.quoteForm.patchValue({
      status: 'draft',
      tax_rate: 19,
      valid_until: validUntil.toISOString().split('T')[0]
    });
  }

  private loadQuote() {
    if (this.quoteId) {
      this.isLoading = true;
      this.quoteService.getQuote(+this.quoteId).subscribe({
        next: (quote) => {
          this.populateForm(quote);
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Fehler beim Laden des Angebots';
          this.isLoading = false;
          console.error('Error loading quote:', error);
        }
      });
    }
  }

  private populateForm(quote: Quote) {
    this.quoteForm.patchValue({
      quote_number: quote.quote_number,
      customer: quote.customer,
      title: quote.title,
      description: quote.description,
      status: quote.status,
      valid_until: quote.valid_until ? new Date(quote.valid_until).toISOString().split('T')[0] : '',
      tax_rate: quote.tax_rate
    });
  }

  onSubmit() {
    if (this.quoteForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const quoteData: Partial<Quote> = {
        ...this.quoteForm.value,
        valid_until: new Date(this.quoteForm.value.valid_until)
      };

      const operation = this.isEditMode && this.quoteId
        ? this.quoteService.updateQuote(+this.quoteId, quoteData)
        : this.quoteService.createQuote(quoteData);

      operation.subscribe({
        next: (quote) => {
          this.isLoading = false;
          this.router.navigate(['/quotes']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Fehler beim Speichern des Angebots';
          console.error('Error saving quote:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.quoteForm);
    }
  }

  cancel() {
    this.router.navigate(['/quotes']);
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
