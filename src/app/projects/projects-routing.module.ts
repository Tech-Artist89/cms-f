import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';

const routes: Routes = [
  { path: '', component: ProjectListComponent },
  { path: 'new', component: ProjectDetailComponent },
  { path: ':id', component: ProjectDetailComponent },
  { path: ':id/edit', component: ProjectDetailComponent },
  { path: ':id/tasks', component: ProjectDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
