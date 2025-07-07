import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './shared/navigation/navigation.component';
import { ThemeService } from './shared/theme.service';
import { AuthService } from './auth/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'CMS Mitra';
  showNavigation = true;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Theme service wird automatisch initialisiert
    console.log('AppComponent: ngOnInit called');
    
    // Check initial route
    this.checkRoute(this.router.url);
    
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log('AppComponent: Route changed to:', event.url);
      this.checkRoute(event.url);
    });
    
    // Listen to authentication changes
    this.authService.token$.subscribe(token => {
      console.log('AppComponent: Token changed:', !!token);
    });
  }

  private checkRoute(url: string) {
    // Hide navigation on login and register pages
    const hideNavigationRoutes = ['/login', '/register'];
    this.showNavigation = !hideNavigationRoutes.some(route => url.startsWith(route));
    console.log('AppComponent: Show navigation:', this.showNavigation, 'for URL:', url);
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
