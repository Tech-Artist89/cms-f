import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface DashboardStats {
  customers: number;
  activeProjects: number;
  pendingQuotes: number;
  overdueInvoices: number;
}

interface Activity {
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  color: string;
}

interface Appointment {
  date: Date;
  time: string;
  customer: string;
  description: string;
  employee: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    customers: 0,
    activeProjects: 0,
    pendingQuotes: 0,
    overdueInvoices: 0
  };

  recentActivities: Activity[] = [];
  upcomingAppointments: Appointment[] = [];

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.loadStats();
    this.loadRecentActivities();
    this.loadUpcomingAppointments();
  }

  private loadStats() {
    this.stats = {
      customers: 42,
      activeProjects: 8,
      pendingQuotes: 5,
      overdueInvoices: 2
    };
  }

  private loadRecentActivities() {
    this.recentActivities = [
      {
        title: 'Neuer Kunde erstellt',
        description: 'Müller GmbH wurde als neuer Kunde angelegt',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        icon: 'bi-person-plus',
        color: 'success'
      },
      {
        title: 'Angebot versendet',
        description: 'Angebot #2024-001 an Schmidt & Co versendet',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        icon: 'bi-file-text',
        color: 'info'
      },
      {
        title: 'Projekt abgeschlossen',
        description: 'Heizungsinstallation bei Weber fertiggestellt',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        icon: 'bi-check-circle',
        color: 'success'
      },
      {
        title: 'Rechnung erstellt',
        description: 'Rechnung #2024-089 für Johnson Projekt erstellt',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        icon: 'bi-receipt',
        color: 'warning'
      }
    ];
  }

  private loadUpcomingAppointments() {
    const today = new Date();
    this.upcomingAppointments = [
      {
        date: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        time: '09:00',
        customer: 'Müller GmbH',
        description: 'Wartung Heizungsanlage',
        employee: 'Max Mustermann'
      },
      {
        date: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        time: '14:00',
        customer: 'Schmidt & Co',
        description: 'Beratungstermin neue Sanitäranlage',
        employee: 'Anna Schmidt'
      },
      {
        date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
        time: '10:30',
        customer: 'Weber KG',
        description: 'Installation Klimaanlage',
        employee: 'Tom Weber'
      }
    ];
  }
}