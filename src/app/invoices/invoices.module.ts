import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { InvoicesRoutingModule } from './invoices-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InvoicesRoutingModule
  ]
})
export class InvoicesModule { }
