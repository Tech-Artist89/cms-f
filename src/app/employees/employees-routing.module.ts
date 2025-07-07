import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';

const routes: Routes = [
  { path: '', component: EmployeeListComponent },
  { path: 'new', component: EmployeeDetailComponent },
  { path: ':id', component: EmployeeDetailComponent },
  { path: ':id/edit', component: EmployeeDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }