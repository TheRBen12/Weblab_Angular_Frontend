import {Component, inject, OnInit} from '@angular/core';
import {ProductComponent} from '../product/product.component';
import {RouterOutlet} from '@angular/router';
import {ProductService} from '../../../services/product.service';
import {DatePipe, NgForOf} from '@angular/common';

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
  specifications: any[] = [];


  ngOnInit(): void {
    this.fetchDailyOffer();
  }

  fetchDailyOffer() {
    this.productService.getDailyOfferProduct().subscribe((result) => {
      this.dailyOfferProduct = result;
      this.specifications = this.dailyOfferProduct.specifications;
    });
  }

}
