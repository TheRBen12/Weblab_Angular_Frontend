import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '../recall-recognition-part-one/home/home.component';
import {ProductIndexComponent} from '../recall-recognition-part-one/product-index/product-index.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent},
  {path: 'it-und-multimedia', component: ProductIndexComponent, title: 'IT und Multimedia'},
  {path: 'gaming', component: ProductIndexComponent, title: "Gaming"}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ProductsRoutingModule { }
