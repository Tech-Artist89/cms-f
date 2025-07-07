import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ProjectTask } from './project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8000/api/v1/projects/projects';

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/`);
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}/`);
  }

  createProject(project: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/`, project);
  }

  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}/`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }

  getProjectTasks(projectId: number): Observable<ProjectTask[]> {
    return this.http.get<ProjectTask[]>(`${this.apiUrl}/${projectId}/tasks/`);
  }

  createProjectTask(projectId: number, task: Partial<ProjectTask>): Observable<ProjectTask> {
    return this.http.post<ProjectTask>(`${this.apiUrl}/${projectId}/tasks/`, task);
  }

  updateProjectTask(projectId: number, taskId: number, task: Partial<ProjectTask>): Observable<ProjectTask> {
    return this.http.put<ProjectTask>(`${this.apiUrl}/${projectId}/tasks/${taskId}/`, task);
  }

  deleteProjectTask(projectId: number, taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}/tasks/${taskId}/`);
  }

  updateProjectProgress(id: number, progress: number): Observable<Project> {
    return this.http.patch<Project>(`${this.apiUrl}/${id}/`, { progress_percentage: progress });
  }
}
