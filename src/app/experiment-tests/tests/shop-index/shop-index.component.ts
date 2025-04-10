import {Component, inject, OnInit} from '@angular/core';
import {ProductComponent} from '../product/product.component';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet, RouterStateSnapshot, Routes} from '@angular/router';
import {ProductService} from '../../../services/product.service';
import {DatePipe, NgForOf} from '@angular/common';
import {filter, take} from 'rxjs';
import Popper from 'popper.js';
import Data = Popper.Data;
import {RouterService} from '../../../services/router.service';



@Component({
  selector: 'app-shop-index',
  imports: [
    ProductComponent,
    RouterOutlet,
    DatePipe,
    NgForOf
  ],
  templateUrl: './shop-index.component.html',
  standalone: true,
  styleUrl: './shop-index.component.css'
})
export class ShopIndexComponent implements OnInit{
  currentDate = Date.now();
  favoriteCategories : string[] = ["Smartphone und Tablets", "Küche"];
  dailyOfferProduct: any;
  productService = inject(ProductService);
  routerService: RouterService = inject(RouterService);
  router: Router = inject(Router);
  specifications: any[] = [];
  title: string = "";



  constructor() {
  }

  ngOnInit(): void {
    this.title =  this.routerService.rebuildCurrentRoute(this.router.url.split("/"));
    this.fetchDailyOffer();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.title = this.routerService.rebuildCurrentRoute(this.router.url.split("/"));
      });
  }

  fetchDailyOffer() {
    this.productService.getDailyOfferProduct().subscribe((result) => {
      this.dailyOfferProduct = result;
      this.specifications = this.dailyOfferProduct.specifications;
    });
  }

}
