import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuoteListComponent } from './quote-list/quote-list.component';
import { QuoteDetailComponent } from './quote-detail/quote-detail.component';

const routes: Routes = [
  { path: '', component: QuoteListComponent },
  { path: 'new', component: QuoteDetailComponent },
  { path: ':id', component: QuoteDetailComponent },
  { path: ':id/edit', component: QuoteDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotesRoutingModule { }
