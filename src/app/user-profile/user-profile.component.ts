import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  position?: string;
  department?: string;
  date_joined: Date;
  last_login?: Date;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  isEditMode = false;
  showPasswordChange = false;
  isLoading = false;
  isPasswordLoading = false;
  errorMessage = '';
  passwordErrorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.createProfileForm();
    this.passwordForm = this.createPasswordForm();
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  private createProfileForm(): FormGroup {
    return this.fb.group({
      first_name: [''],
      last_name: [''],
      email: ['', [Validators.required, Validators.email]],
      position: [''],
      department: ['']
    });
  }

  private createPasswordForm(): FormGroup {
    return this.fb.group({
      current_password: ['', [Validators.required]],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = form.get('new_password');
    const confirmPassword = form.get('confirm_password');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
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

  private loadUserProfile() {
    // Get user from AuthService
    this.user = this.authService.getUser();
    
    if (this.user) {
      this.populateProfileForm();
    } else {
      this.errorMessage = 'Benutzerdaten konnten nicht geladen werden';
    }
  }

  private populateProfileForm() {
    if (this.user) {
      this.profileForm.patchValue({
        first_name: this.user.first_name || '',
        last_name: this.user.last_name || '',
        email: this.user.email || '',
        position: this.user.position || '',
        department: this.user.department || ''
      });
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.populateProfileForm();
    }
    this.errorMessage = '';
  }

  cancelEdit() {
    this.isEditMode = false;
    this.populateProfileForm();
    this.errorMessage = '';
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const profileData = this.profileForm.value;
      
      // Here you would typically call a user profile update service
      // For now, we'll simulate an API call
      setTimeout(() => {
        // Update local user data
        if (this.user) {
          this.user = {
            ...this.user,
            ...profileData
          };
          
          // Update user in localStorage (for demo purposes)
          localStorage.setItem('user', JSON.stringify(this.user));
        }
        
        this.isLoading = false;
        this.isEditMode = false;
      }, 1000);
      
    } else {
      this.markFormGroupTouched(this.profileForm);
    }
  }

  onPasswordSubmit() {
    if (this.passwordForm.valid) {
      this.isPasswordLoading = true;
      this.passwordErrorMessage = '';
      
      const passwordData = this.passwordForm.value;
      
      // Here you would typically call a password change service
      // For now, we'll simulate an API call
      setTimeout(() => {
        // Simulate password change
        this.isPasswordLoading = false;
        this.showPasswordChange = false;
        this.passwordForm.reset();
        
        // You could show a success message here
        alert('Passwort erfolgreich geändert!');
      }, 1000);
      
    } else {
      this.markFormGroupTouched(this.passwordForm);
    }
  }

  cancelPasswordChange() {
    this.showPasswordChange = false;
    this.passwordForm.reset();
    this.passwordErrorMessage = '';
  }

  getInitials(): string {
    if (!this.user) return 'U';
    
    const firstName = this.user.first_name || this.user.username.charAt(0);
    const lastName = this.user.last_name || '';
    
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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