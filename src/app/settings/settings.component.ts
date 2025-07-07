import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  activeTab = 'appearance';
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  appearanceForm: FormGroup;
  notificationForm: FormGroup;
  languageForm: FormGroup;
  timetrackingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService
  ) {
    this.appearanceForm = this.createAppearanceForm();
    this.notificationForm = this.createNotificationForm();
    this.languageForm = this.createLanguageForm();
    this.timetrackingForm = this.createTimetrackingForm();
  }

  ngOnInit() {
    this.loadSettings();
  }

  private createAppearanceForm(): FormGroup {
    return this.fb.group({
      theme: ['light'],
      fontSize: ['medium'],
      compactMode: [false],
      animationsEnabled: [true]
    });
  }

  private createNotificationForm(): FormGroup {
    return this.fb.group({
      emailProjects: [true],
      emailInvoices: [true],
      emailReminders: [true],
      browserNotifications: [false],
      soundNotifications: [false]
    });
  }

  private createLanguageForm(): FormGroup {
    return this.fb.group({
      language: ['de'],
      timezone: ['Europe/Berlin'],
      dateFormat: ['DD.MM.YYYY'],
      timeFormat: ['24h']
    });
  }

  private createTimetrackingForm(): FormGroup {
    return this.fb.group({
      defaultProject: [''],
      autoStartTimer: [false],
      remindBreaks: [true],
      workingHoursStart: ['08:00'],
      workingHoursEnd: ['17:00'],
      roundingMinutes: [15]
    });
  }

  private loadSettings() {
    // Load settings from localStorage or service
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      
      if (settings.appearance) {
        this.appearanceForm.patchValue(settings.appearance);
      }
      if (settings.notifications) {
        this.notificationForm.patchValue(settings.notifications);
      }
      if (settings.language) {
        this.languageForm.patchValue(settings.language);
      }
      if (settings.timetracking) {
        this.timetrackingForm.patchValue(settings.timetracking);
      }
    }

    // Load current theme
    const currentTheme = this.themeService.getCurrentTheme();
    this.appearanceForm.patchValue({ theme: currentTheme });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.clearMessages();
  }

  saveAppearanceSettings() {
    if (this.appearanceForm.valid) {
      this.isLoading = true;
      this.clearMessages();

      const formData = this.appearanceForm.value;
      
      // Apply theme change
      this.themeService.setTheme(formData.theme);
      
      // Save settings
      this.saveSettings('appearance', formData);
      
      setTimeout(() => {
        this.isLoading = false;
        this.successMessage = 'Darstellungs-Einstellungen erfolgreich gespeichert!';
        this.hideMessage();
      }, 1000);
    }
  }

  saveNotificationSettings() {
    if (this.notificationForm.valid) {
      this.isLoading = true;
      this.clearMessages();

      const formData = this.notificationForm.value;
      
      // Handle browser notification permission
      if (formData.browserNotifications && 'Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission !== 'granted') {
            formData.browserNotifications = false;
            this.notificationForm.patchValue({ browserNotifications: false });
          }
        });
      }
      
      this.saveSettings('notifications', formData);
      
      setTimeout(() => {
        this.isLoading = false;
        this.successMessage = 'Benachrichtigungs-Einstellungen erfolgreich gespeichert!';
        this.hideMessage();
      }, 1000);
    }
  }

  saveLanguageSettings() {
    if (this.languageForm.valid) {
      this.isLoading = true;
      this.clearMessages();

      const formData = this.languageForm.value;
      this.saveSettings('language', formData);
      
      setTimeout(() => {
        this.isLoading = false;
        this.successMessage = 'Sprach-Einstellungen erfolgreich gespeichert!';
        this.hideMessage();
      }, 1000);
    }
  }

  saveTimetrackingSettings() {
    if (this.timetrackingForm.valid) {
      this.isLoading = true;
      this.clearMessages();

      const formData = this.timetrackingForm.value;
      this.saveSettings('timetracking', formData);
      
      setTimeout(() => {
        this.isLoading = false;
        this.successMessage = 'Zeiterfassungs-Einstellungen erfolgreich gespeichert!';
        this.hideMessage();
      }, 1000);
    }
  }

  private saveSettings(category: string, data: any) {
    const savedSettings = localStorage.getItem('userSettings');
    let settings = savedSettings ? JSON.parse(savedSettings) : {};
    
    settings[category] = data;
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }

  private clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  private hideMessage() {
    setTimeout(() => {
      this.clearMessages();
    }, 3000);
  }

  getBrowserInfo(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Google Chrome';
    if (userAgent.includes('Firefox')) return 'Mozilla Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Microsoft Edge';
    return 'Unbekannt';
  }

  getLastUpdate(): Date {
    return new Date(); // In a real app, this would come from the backend
  }
}
