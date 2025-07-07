import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-appointment-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss'
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  appointmentId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.appointmentForm = this.createForm();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.appointmentId = params['id'];
        this.isEditMode = true;
        this.loadAppointment();
      } else {
        this.initializeNewAppointment();
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      customer: ['', [Validators.required]],
      employee: [''],
      date: ['', [Validators.required]],
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
      location: [''],
      appointment_type: ['maintenance', [Validators.required]],
      priority: ['medium', [Validators.required]],
      notes: ['']
    });
  }

  private initializeNewAppointment() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    this.appointmentForm.patchValue({
      date: tomorrow.toISOString().split('T')[0],
      start_time: '09:00',
      end_time: '10:00',
      appointment_type: 'maintenance',
      priority: 'medium'
    });
  }

  private loadAppointment() {
    // Simulate loading appointment data
    if (this.appointmentId) {
      this.isLoading = true;
      setTimeout(() => {
        // Mock data
        this.appointmentForm.patchValue({
          title: 'Wartung Heizungsanlage',
          description: 'Jährliche Wartung der Heizungsanlage',
          customer: '1',
          employee: '1',
          date: '2024-01-15',
          start_time: '09:00',
          end_time: '11:00',
          location: 'Mustermann GmbH, Musterstraße 1',
          appointment_type: 'maintenance',
          priority: 'medium'
        });
        this.isLoading = false;
      }, 500);
    }
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/schedules']);
      }, 1000);
    } else {
      this.markFormGroupTouched(this.appointmentForm);
    }
  }

  cancel() {
    this.router.navigate(['/schedules']);
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
