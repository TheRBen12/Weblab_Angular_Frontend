import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '../recall-recognition-part-one/home/home.component';
import {ProductIndexComponent} from '../recall-recognition-part-one/product-index/product-index.component';


const routes: Routes = [
  { path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'it-und-multimedia', component: ProductIndexComponent, title: 'IT und Multimedia'},
  {path: 'gaming', component: ProductIndexComponent, title: "Gaming"},
  {path: 'pc-und-notebooks', component: ProductIndexComponent, title: "PC und Notebooks"},
  {path: 'notebook', component: ProductIndexComponent, title: "Notebooks"},
  {path: 'smartphones-und-tablets', component: ProductIndexComponent, title: "Smartphone und Tablets"},
  {path: 'peripherie', component: ProductIndexComponent, title: "Peripherie"},
  {path: 'keypad', component: ProductIndexComponent, title: "Tastaturen"},
  { path: '**', redirectTo: 'home', pathMatch: 'full' }


];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ProductsRoutingModule { }
