import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.createForm();
  }

  ngOnInit() {
    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
      ]],
      confirmPassword: ['', [Validators.required]],
      position: [''],
      department: [''],
      agreeTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: AbstractControl): { [key: string]: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword?.hasError('passwordMismatch')) {
      delete confirmPassword.errors!['passwordMismatch'];
      if (Object.keys(confirmPassword.errors!).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const formValue = this.registerForm.value;
      const registrationData = {
        username: formValue.username,
        email: formValue.email,
        password: formValue.password,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        position: formValue.position || '',
        department: formValue.department || ''
      };

      this.authService.register(registrationData).subscribe({
        next: (response) => {
          this.isLoading = false;
          // Automatically log in after successful registration
          this.authService.login({
            username: registrationData.username,
            password: registrationData.password
          }).subscribe({
            next: () => {
              this.router.navigate(['/dashboard']);
            },
            error: () => {
              // Registration successful but login failed, redirect to login page
              this.router.navigate(['/login'], {
                queryParams: { message: 'Registrierung erfolgreich. Bitte melden Sie sich an.' }
              });
            }
          });
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 400 && error.error) {
            // Handle validation errors from backend
            if (error.error.username) {
              this.errorMessage = 'Benutzername bereits vergeben.';
            } else if (error.error.email) {
              this.errorMessage = 'E-Mail-Adresse bereits registriert.';
            } else {
              this.errorMessage = 'Ungültige Eingabedaten. Bitte überprüfen Sie Ihre Angaben.';
            }
          } else {
            this.errorMessage = 'Registrierung fehlgeschlagen. Bitte versuchen Sie es später erneut.';
          }
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.registerForm);
    }
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