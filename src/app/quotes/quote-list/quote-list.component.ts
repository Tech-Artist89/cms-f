import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Quote, QUOTE_STATUSES } from '../quote.model';
import { QuoteService } from '../quote.service';

@Component({
  selector: 'app-quote-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './quote-list.component.html',
  styleUrl: './quote-list.component.scss'
})
export class QuoteListComponent implements OnInit {
  quotes: Quote[] = [];
  loading = false;
  error: string | null = null;
  quoteStatuses = QUOTE_STATUSES;

  constructor(private quoteService: QuoteService) {}

  ngOnInit(): void {
    this.loadQuotes();
  }

  loadQuotes(): void {
    this.loading = true;
    this.error = null;
    
    this.quoteService.getQuotes().subscribe({
      next: (response) => {
        this.quotes = Array.isArray(response) ? response : (response as any).results || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Fehler beim Laden der Angebote';
        this.loading = false;
        console.error('Error loading quotes:', err);
      }
    });
  }

  deleteQuote(id: number): void {
    if (confirm('Sind Sie sicher, dass Sie dieses Angebot löschen möchten?')) {
      this.quoteService.deleteQuote(id).subscribe({
        next: () => {
          this.loadQuotes();
        },
        error: (err) => {
          this.error = 'Fehler beim Löschen des Angebots';
          console.error('Error deleting quote:', err);
        }
      });
    }
  }

  duplicateQuote(id: number): void {
    this.quoteService.duplicateQuote(id).subscribe({
      next: () => {
        this.loadQuotes();
      },
      error: (err) => {
        this.error = 'Fehler beim Duplizieren des Angebots';
        console.error('Error duplicating quote:', err);
      }
    });
  }

  convertToProject(id: number): void {
    if (confirm('Möchten Sie dieses Angebot in ein Projekt umwandeln?')) {
      this.quoteService.convertToProject(id).subscribe({
        next: () => {
          this.loadQuotes();
        },
        error: (err) => {
          this.error = 'Fehler beim Umwandeln in Projekt';
          console.error('Error converting to project:', err);
        }
      });
    }
  }

  generatePdf(id: number): void {
    this.quoteService.generatePdf(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `angebot-${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.error = 'Fehler beim Generieren der PDF';
        console.error('Error generating PDF:', err);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    const statusObj = this.quoteStatuses.find(s => s.value === status);
    return statusObj ? `badge bg-${statusObj.color}` : 'badge bg-secondary';
  }

  getStatusLabel(status: string): string {
    const statusObj = this.quoteStatuses.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  }
}
