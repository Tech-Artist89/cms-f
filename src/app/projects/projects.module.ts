import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ProjectsRoutingModule } from './projects-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProjectsRoutingModule
  ]
})
export class ProjectsModule { }
