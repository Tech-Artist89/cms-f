import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';

const routes: Routes = [
  { path: '', component: InvoiceListComponent },
  { path: 'new', component: InvoiceDetailComponent },
  { path: ':id', component: InvoiceDetailComponent },
  { path: ':id/edit', component: InvoiceDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesRoutingModule { }
