import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, LoginRequest } from '../auth.service';
import { clearAuthState, debugAuthState } from '../clear-auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  credentials: LoginRequest = {
    username: '',
    password: ''
  };
  isLoading = false;
  error = '';
  returnUrl = '/dashboard';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('LoginComponent: ngOnInit called');
    debugAuthState();
    
    // Force clear all authentication state
    clearAuthState();
    this.authService.logout();
    
    // Get return url from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    console.log('LoginComponent: Return URL:', this.returnUrl);
    
    // Debug state after clearing
    debugAuthState();
  }

  onSubmit() {
    if (!this.credentials.username || !this.credentials.password) {
      this.error = 'Bitte füllen Sie alle Felder aus.';
      return;
    }

    this.isLoading = true;
    this.error = '';

    console.log('LoginComponent: Attempting login with:', this.credentials.username);
    
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('LoginComponent: Login successful', response);
        this.isLoading = false;
        console.log('LoginComponent: Navigating to:', this.returnUrl);
        // Navigate to return URL or dashboard
        this.router.navigate([this.returnUrl]);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('LoginComponent: Login error:', err);
        if (err.status === 401) {
          this.error = 'Ungültige Anmeldedaten. Bitte versuchen Sie es erneut.';
        } else if (err.status === 0) {
          this.error = 'Verbindung zum Server fehlgeschlagen. Ist der Server gestartet?';
        } else {
          this.error = 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es später erneut.';
        }
      }
    });
  }

  debugAuth() {
    debugAuthState();
  }

  clearAuth() {
    clearAuthState();
    this.authService.logout();
    console.log('Manual auth clear completed');
  }
}