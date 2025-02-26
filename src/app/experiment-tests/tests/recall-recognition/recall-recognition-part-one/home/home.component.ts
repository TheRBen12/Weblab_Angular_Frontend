import {Component, inject, OnInit} from '@angular/core';
import {ProductIndexComponent} from '../product-index/product-index.component';
import {ProductService} from '../../../../../services/product.service';
import {NgForOf} from '@angular/common';
import {ProductComponent} from '../product/product.component';

@Component({
  selector: 'app-home',
  imports: [NgForOf, ProductComponent],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  productService = inject(ProductService);
  products: any[] = [];
  ngOnInit(): void {
    this.productService.fetchTopSales().subscribe((products) => {
      this.products = products
      console.log(products);
    })
  }
}
