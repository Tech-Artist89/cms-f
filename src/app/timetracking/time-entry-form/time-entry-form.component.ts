import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimeEntry } from '../timetracking.model';
import { TimetrackingService } from '../timetracking.service';

@Component({
  selector: 'app-time-entry-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './time-entry-form.component.html',
  styleUrl: './time-entry-form.component.scss'
})
export class TimeEntryFormComponent implements OnInit {
  timeEntryForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  entryId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private timetrackingService: TimetrackingService
  ) {
    this.timeEntryForm = this.createForm();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.entryId = params['id'];
        this.isEditMode = true;
        this.loadTimeEntry();
      } else {
        this.initializeNewEntry();
      }
    });

    // Watch for start_time and end_time changes to auto-calculate duration
    this.timeEntryForm.get('start_time')?.valueChanges.subscribe(() => {
      this.calculateDuration();
    });
    
    this.timeEntryForm.get('end_time')?.valueChanges.subscribe(() => {
      this.calculateDuration();
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      entry_type: ['work', [Validators.required]],
      project: [''],
      description: ['', [Validators.required]],
      date: ['', [Validators.required]],
      start_time: ['', [Validators.required]],
      end_time: [''],
      duration_hours: [null],
      is_billable: [true],
      is_overtime: [false],
      notes: ['']
    });
  }

  private initializeNewEntry() {
    const now = new Date();
    this.timeEntryForm.patchValue({
      date: now.toISOString().split('T')[0],
      start_time: now.toTimeString().split(' ')[0].substring(0, 5), // HH:MM format
      entry_type: 'work',
      is_billable: true
    });
  }

  private loadTimeEntry() {
    if (this.entryId) {
      this.timetrackingService.getTimeEntry(this.entryId).subscribe({
        next: (entry) => {
          this.populateForm(entry);
        },
        error: (error) => {
          this.errorMessage = 'Fehler beim Laden des Zeiteintrags';
          console.error('Error loading time entry:', error);
        }
      });
    }
  }

  private populateForm(entry: TimeEntry) {
    this.timeEntryForm.patchValue({
      entry_type: entry.entry_type,
      project: entry.project,
      description: entry.description,
      date: entry.date,
      start_time: entry.start_time ? entry.start_time.substring(0, 5) : '',
      end_time: entry.end_time ? entry.end_time.substring(0, 5) : '',
      duration_hours: entry.duration_hours,
      is_billable: entry.is_billable,
      is_overtime: entry.is_overtime,
      notes: entry.notes
    });
  }

  private calculateDuration() {
    const startTime = this.timeEntryForm.get('start_time')?.value;
    const endTime = this.timeEntryForm.get('end_time')?.value;
    
    if (startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}:00`);
      const end = new Date(`2000-01-01T${endTime}:00`);
      
      const diffMs = end.getTime() - start.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      
      if (diffHours > 0) {
        this.timeEntryForm.get('duration_hours')?.setValue(diffHours, { emitEvent: false });
      }
    }
  }

  getCalculatedDuration(): string {
    const startTime = this.timeEntryForm.get('start_time')?.value;
    const endTime = this.timeEntryForm.get('end_time')?.value;
    const durationHours = this.timeEntryForm.get('duration_hours')?.value;
    
    if (startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}:00`);
      const end = new Date(`2000-01-01T${endTime}:00`);
      const diffMs = end.getTime() - start.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      
      if (diffHours > 0) {
        const hours = Math.floor(diffHours);
        const minutes = Math.round((diffHours - hours) * 60);
        return `${hours}:${minutes.toString().padStart(2, '0')}h`;
      }
    } else if (durationHours) {
      const hours = Math.floor(durationHours);
      const minutes = Math.round((durationHours - hours) * 60);
      return `${hours}:${minutes.toString().padStart(2, '0')}h`;
    }
    
    return 'Nicht berechnet';
  }

  onSubmit() {
    if (this.timeEntryForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const formValue = this.timeEntryForm.value;
      const entryData: Partial<TimeEntry> = {
        entry_type: formValue.entry_type,
        project: formValue.project || null,
        description: formValue.description,
        date: formValue.date,
        start_time: formValue.start_time + ':00', // Add seconds
        end_time: formValue.end_time ? formValue.end_time + ':00' : undefined,
        duration_hours: formValue.duration_hours,
        is_billable: formValue.is_billable,
        is_overtime: formValue.is_overtime,
        notes: formValue.notes
      };

      const operation = this.isEditMode && this.entryId
        ? this.timetrackingService.updateTimeEntry(this.entryId, entryData)
        : this.timetrackingService.createTimeEntry(entryData);

      operation.subscribe({
        next: (entry) => {
          this.isLoading = false;
          this.router.navigate(['/timetracking']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Fehler beim Speichern des Zeiteintrags';
          console.error('Error saving time entry:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.timeEntryForm);
    }
  }

  saveAsDraft() {
    if (this.timeEntryForm.get('description')?.value && this.timeEntryForm.get('date')?.value) {
      const formValue = this.timeEntryForm.value;
      const draftData: Partial<TimeEntry> = {
        ...formValue,
        start_time: formValue.start_time ? formValue.start_time + ':00' : undefined,
        end_time: formValue.end_time ? formValue.end_time + ':00' : undefined,
        // Mark as draft or incomplete
      };

      this.timetrackingService.createTimeEntry(draftData).subscribe({
        next: (entry) => {
          this.router.navigate(['/timetracking']);
        },
        error: (error) => {
          this.errorMessage = 'Fehler beim Speichern des Entwurfs';
          console.error('Error saving draft:', error);
        }
      });
    } else {
      this.errorMessage = 'Mindestens Beschreibung und Datum sind für einen Entwurf erforderlich';
    }
  }

  startQuickTimer(description: string) {
    this.timetrackingService.startTimer(undefined, description).subscribe({
      next: (timer) => {
        this.router.navigate(['/timetracking']);
      },
      error: (error) => {
        this.errorMessage = 'Fehler beim Starten des Quick Timers';
        console.error('Error starting quick timer:', error);
      }
    });
  }

  cancel() {
    this.router.navigate(['/timetracking']);
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