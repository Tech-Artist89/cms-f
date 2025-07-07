import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimeEntryListComponent } from './time-entry-list/time-entry-list.component';
import { TimeEntryFormComponent } from './time-entry-form/time-entry-form.component';

const routes: Routes = [
  { path: '', component: TimeEntryListComponent },
  { path: 'new', component: TimeEntryFormComponent },
  { path: ':id/edit', component: TimeEntryFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimetrackingRoutingModule { }
