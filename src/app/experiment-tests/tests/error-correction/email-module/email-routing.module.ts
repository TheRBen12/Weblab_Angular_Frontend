import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {EmailIndexComponent} from '../email-index/email-index.component';
import {EmailDetailComponent} from '../email-detail/email-detail.component';


const routes: Routes = [
  {
    path: '', component: EmailIndexComponent, children: [
      {path: 'email/:emailId', component: EmailDetailComponent}
    ], title: "Posteingang"
  },
  {
    path: 'deletedItems', component: EmailIndexComponent, children: [
      {path: 'email/:emailId', component: EmailDetailComponent}
    ], title: "Gelöschte Elemente"
  },
  {
    path: 'sentItems', component: EmailIndexComponent, children: [
      {path: 'email/:emailId', component: EmailDetailComponent}
    ], title: "Gesendete Elemente"
  }
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class EmailRoutingModule {
}
