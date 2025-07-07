import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ThemeService, Theme } from '../theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  currentTheme: Theme = 'light';
  private subscription: Subscription = new Subscription();

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.subscription.add(
      this.themeService.theme$.subscribe(theme => {
        this.currentTheme = theme;
      })
    );
    this.themeService.watchSystemTheme();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setTheme(theme: Theme) {
    this.themeService.setTheme(theme);
  }

  getThemeIcon(): string {
    switch (this.currentTheme) {
      case 'light':
        return 'bi-sun';
      case 'dark':
        return 'bi-moon';
      case 'auto':
        return 'bi-circle-half';
      default:
        return 'bi-sun';
    }
  }

  getThemeLabel(): string {
    switch (this.currentTheme) {
      case 'light':
        return 'Hell';
      case 'dark':
        return 'Dunkel';
      case 'auto':
        return 'Auto';
      default:
        return 'Hell';
    }
  }
}