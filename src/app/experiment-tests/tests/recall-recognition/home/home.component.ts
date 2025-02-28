import {Component, inject, OnInit} from '@angular/core';
import {ProductService} from '../../../../services/product.service';
import {NgForOf, NgIf} from '@angular/common';
import {ProductComponent} from '../product/product.component';
import {FilterService} from '../../../../services/filter.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [NgForOf, ProductComponent, NgIf],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  productService = inject(ProductService);
  filterService = inject(FilterService);
  topSales: any[] = [];
  products: any[] = [];
  filteredProducts: any[] = [];
  filterSubscription: Subscription = new Subscription();


  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((products) => {
      this.products = products;
    })

    this.productService.fetchTopSales().subscribe((products) => {
      this.topSales = products
    })
    this.filterSubscription = this.filterService.getSubject().subscribe((filterText) => {
      this.filteredProducts = this.filterService.filterProducts(filterText, this.products);
    });

  }
}
