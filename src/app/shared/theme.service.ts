import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'cms-mitra-theme';
  private themeSubject = new BehaviorSubject<Theme>('light');
  
  public theme$ = this.themeSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    if (savedTheme && this.isValidTheme(savedTheme)) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('light');
    }
  }

  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }

  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  private applyTheme(theme: Theme): void {
    const htmlElement = document.documentElement;
    
    // Remove existing theme classes
    htmlElement.classList.remove('theme-light', 'theme-dark');
    
    if (theme === 'auto') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      htmlElement.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
      htmlElement.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light');
    } else {
      htmlElement.classList.add(`theme-${theme}`);
      htmlElement.setAttribute('data-bs-theme', theme);
    }
  }

  private isValidTheme(theme: string): theme is Theme {
    return ['light', 'dark', 'auto'].includes(theme);
  }

  // Listen to system theme changes when auto mode is selected
  watchSystemTheme(): void {
    if (this.getCurrentTheme() === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        if (this.getCurrentTheme() === 'auto') {
          this.applyTheme('auto');
        }
      });
    }
  }
}