import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ProductIndexComponent} from '../product-index/product-index.component';
import {ProductDetailComponent} from '../product-detail/product-detail.component';
import {ShopIndexComponent} from '../shop-index/shop-index.component';
import {HomeComponent} from '../home/home.component';


const routes: Routes = [
  {path: '', component: ShopIndexComponent, children: [
      { path: '', component: HomeComponent},
      {path: 'it-und-multimedia', component: ProductIndexComponent, title: 'IT und Multimedia'},
      {path: 'gaming', component: ProductIndexComponent, title: "Gaming"},
      {path: 'pc-und-notebooks', component: ProductIndexComponent, title: "PC und Notebooks"},
      {path: 'notebook', component: ProductIndexComponent, title: "Notebooks"},
      {path: 'smartphones-und-tablets', component: ProductIndexComponent, title: "Smartphone und Tablets"},
      {path: 'peripherie', component: ProductIndexComponent, title: "Peripherie"},
      {path: 'keypad', component: ProductIndexComponent, title: "Tastaturen"},
    ]
  },

  {path: "show/product/:productId", component: ProductDetailComponent}

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ProductsRoutingModule { }
