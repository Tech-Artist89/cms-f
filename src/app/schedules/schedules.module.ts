import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SchedulesRoutingModule } from './schedules-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SchedulesRoutingModule
  ]
})
export class SchedulesModule { }
