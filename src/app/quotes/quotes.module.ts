import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { QuotesRoutingModule } from './quotes-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QuotesRoutingModule
  ]
})
export class QuotesModule { }
