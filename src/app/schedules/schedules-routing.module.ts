import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';

const routes: Routes = [
  { path: '', component: CalendarViewComponent },
  { path: 'new', component: AppointmentFormComponent },
  { path: ':id', component: AppointmentFormComponent },
  { path: ':id/edit', component: AppointmentFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulesRoutingModule { }
