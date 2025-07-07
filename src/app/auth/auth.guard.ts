import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('AuthGuard: Checking authentication for route:', state.url);
  console.log('AuthGuard: Current token:', authService.getToken());
  console.log('AuthGuard: Is authenticated:', authService.isAuthenticated());

  if (authService.isAuthenticated()) {
    console.log('AuthGuard: User is authenticated, allowing access');
    return true;
  }
  
  console.log('AuthGuard: User not authenticated, redirecting to login');
  // Redirect to login page with return url
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};