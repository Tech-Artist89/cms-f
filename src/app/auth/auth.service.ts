import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  position?: string;
  department?: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/v1/auth';
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('access_token'));
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/token/`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
          }
          this.tokenSubject.next(response.access);
        })
      );
  }

  logout(): void {
    console.log('AuthService: Logging out user');
    localStorage.clear(); // Clear all localStorage data
    this.tokenSubject.next(null);
    
    // Verify logout
    console.log('AuthService: Token after logout:', this.getToken());
    console.log('AuthService: User after logout:', this.getUser());
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    
    // Check if token is expired (basic check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < currentTime) {
        // Token is expired, remove it
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      // Invalid token format
      this.logout();
      return false;
    }
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    const registerData = {
      username: data.username,
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
      position: data.position,
      department: data.department
    };
    
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register/`, registerData);
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post<any>(`${this.apiUrl}/token/refresh/`, { refresh: refreshToken })
      .pipe(
        tap(response => {
          localStorage.setItem('access_token', response.access);
          this.tokenSubject.next(response.access);
        })
      );
  }
}