import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Project, PROJECT_STATUSES, PROJECT_PRIORITIES } from '../project.model';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-project-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  loading = false;
  error: string | null = null;
  projectStatuses = PROJECT_STATUSES;
  projectPriorities = PROJECT_PRIORITIES;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = null;
    
    this.projectService.getProjects().subscribe({
      next: (response) => {
        this.projects = Array.isArray(response) ? response : (response as any).results || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Fehler beim Laden der Projekte';
        this.loading = false;
        console.error('Error loading projects:', err);
      }
    });
  }

  deleteProject(id: number): void {
    if (confirm('Sind Sie sicher, dass Sie dieses Projekt löschen möchten?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.loadProjects();
        },
        error: (err) => {
          this.error = 'Fehler beim Löschen des Projekts';
          console.error('Error deleting project:', err);
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    const statusObj = this.projectStatuses.find(s => s.value === status);
    return statusObj ? `badge bg-${statusObj.color}` : 'badge bg-secondary';
  }

  getStatusLabel(status: string): string {
    const statusObj = this.projectStatuses.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  }

  getPriorityBadgeClass(priority: string): string {
    const priorityObj = this.projectPriorities.find(p => p.value === priority);
    return priorityObj ? `badge bg-${priorityObj.color}` : 'badge bg-secondary';
  }

  getPriorityLabel(priority: string): string {
    const priorityObj = this.projectPriorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.label : priority;
  }

  getProgressBarClass(progress: number): string {
    if (progress >= 90) return 'progress-bar bg-success';
    if (progress >= 70) return 'progress-bar bg-info';
    if (progress >= 50) return 'progress-bar bg-warning';
    return 'progress-bar bg-primary';
  }
}
