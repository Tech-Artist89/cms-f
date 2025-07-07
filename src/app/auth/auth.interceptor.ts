import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const authInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();
  
  let authReq = req;
  
  if (token && !req.url.includes('/auth/token/refresh/')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !authReq.url.includes('/auth/token/refresh/')) {
        return handle401Error(authReq, next, authService, router);
      }
      
      return throwError(() => error);
    })
  );
};

function handle401Error(request: HttpRequest<any>, next: any, authService: AuthService, router: Router): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = localStorage.getItem('refresh_token');
    
    if (refreshToken) {
      return authService.refreshToken().pipe(
        switchMap((token: any): Observable<HttpEvent<unknown>> => {
          isRefreshing = false;
          refreshTokenSubject.next(token.access);
          
          const newAuthReq = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token.access}`
            }
          });
          
          return next(newAuthReq);
        }),
        catchError((refreshError) => {
          isRefreshing = false;
          authService.logout();
          router.navigate(['/login']);
          return throwError(() => refreshError);
        })
      );
    } else {
      authService.logout();
      router.navigate(['/login']);
      return throwError(() => new Error('No refresh token available'));
    }
  } else {
    return refreshTokenSubject.pipe(
      switchMap((token): Observable<HttpEvent<unknown>> => {
        if (token) {
          const newAuthReq = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next(newAuthReq);
        }
        return throwError(() => new Error('Token refresh failed'));
      })
    );
  }
}