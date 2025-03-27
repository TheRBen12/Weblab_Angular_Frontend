import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ProductIndexComponent} from '../product-index/product-index.component';
import {ProductDetailComponent} from '../product-detail/product-detail.component';
import {ShopIndexComponent} from '../shop-index/shop-index.component';
import {HomeComponent} from '../home/home.component';
import {redirectGuardGuard} from '../../../guards/redirect-guard.guard';



const routes: Routes = [
  {path: '', component: ShopIndexComponent, children: [
      { path: '', component: HomeComponent},
      {path: 'it-und-multimedia', component: ProductIndexComponent, title: 'IT und Multimedia'},
      {path: 'gaming', component: ProductIndexComponent, title: "Gaming"},
      {path: 'pc-und-notebooks', component: ProductIndexComponent, title: "PC und Notebooks"},
      {path: 'notebook', component: ProductIndexComponent, title: "Notebooks"},
      {path: 'smartphones-und-tablets', component: ProductIndexComponent, title: "Smartphone und Tablets"},
      {path: 'smartphone', component: ProductIndexComponent, title: "Smartphone"},
      {path: 'wohnen', component: ProductIndexComponent, title: "Wohnen"},
      {path: 'peripherie', component: ProductIndexComponent, title: "Peripherie"},
      {path: 'keypad', component: ProductIndexComponent, title: "Tastaturen"},
      {path: 'lebensmittel', component: ProductIndexComponent, title: "Lebensmittel"},
      {path: 'pc', component: ProductIndexComponent, title: "PC"},
      {path: 'haushalt', component: ProductIndexComponent, title: "Haushalt"},
      {path: 'kaffeemaschine', component: ProductIndexComponent, title: "Kaffemaschinen"},
      {path: 'gemuese', component: ProductIndexComponent, title: "Gemüse"},
      {path: 'wurzelgemuese', component: ProductIndexComponent, title: "Wurzelgemüse"},

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
