import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

declare var bootstrap: any;

@Component({
  selector: 'app-navigation',
  imports: [RouterModule, CommonModule, ThemeToggleComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit, AfterViewInit, OnDestroy {
  private dropdownElement: any;
  userDropdownOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    console.log('NavigationComponent: ngOnInit called');
  }

  ngAfterViewInit() {
    // Initialize Bootstrap dropdowns manually
    setTimeout(() => {
      this.initializeDropdowns();
    }, 100);
  }

  ngOnDestroy() {
    if (this.dropdownElement) {
      this.dropdownElement.dispose();
    }
  }

  private initializeDropdowns() {
    try {
      // Find all dropdown elements
      const dropdownElements = this.elementRef.nativeElement.querySelectorAll('[data-bs-toggle="dropdown"]');
      
      dropdownElements.forEach((element: any) => {
        if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
          new bootstrap.Dropdown(element);
        } else {
          console.warn('Bootstrap is not available, using manual dropdown handling');
        }
      });
    } catch (error) {
      console.warn('Could not initialize Bootstrap dropdowns:', error);
    }
  }

  toggleUserDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    this.userDropdownOpen = !this.userDropdownOpen;
    console.log('NavigationComponent: User dropdown toggled:', this.userDropdownOpen);
    
    // Close dropdown when clicking outside
    if (this.userDropdownOpen) {
      setTimeout(() => {
        document.addEventListener('click', this.closeDropdown.bind(this), { once: true });
      }, 100);
    }
  }

  private closeDropdown() {
    this.userDropdownOpen = false;
  }

  navigateToProfile(event: Event) {
    event.preventDefault();
    this.userDropdownOpen = false;
    console.log('NavigationComponent: Navigating to profile');
    this.router.navigate(['/profile']);
  }

  navigateToSettings(event: Event) {
    event.preventDefault();
    this.userDropdownOpen = false;
    console.log('NavigationComponent: Navigating to settings');
    this.router.navigate(['/settings']);
  }

  logout(event: Event) {
    event.preventDefault();
    this.userDropdownOpen = false;
    console.log('NavigationComponent: Logout button clicked');
    
    try {
      this.authService.logout();
      console.log('NavigationComponent: Logout service called, navigating to login');
      // Navigate immediately to login
      this.router.navigate(['/login']).then(() => {
        console.log('NavigationComponent: Navigation to login completed');
        // Force page reload to clear any cached state
        window.location.reload();
      });
    } catch (error) {
      console.error('NavigationComponent: Logout error:', error);
      // Force navigation to login even if error occurs
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
    }
  }
}
