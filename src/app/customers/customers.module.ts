import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CustomersRoutingModule } from './customers-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomersRoutingModule
  ]
})
export class CustomersModule { }
