import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {EmailIndexComponent} from '../email-index/email-index.component';


const routes: Routes = [
  {
    path: '', component: EmailIndexComponent
  },
  {
    path: 'deletedItems', component: EmailIndexComponent, children: [
      {path: 'email/:emailId', component: EmailIndexComponent}
    ]
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
