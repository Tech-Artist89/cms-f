import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  credentials: LoginRequest = {
    username: '',
    password: ''
  };
  isLoading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.credentials.username || !this.credentials.password) {
      this.error = 'Bitte füllen Sie alle Felder aus.';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/customers']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.';
      }
    });
  }
}