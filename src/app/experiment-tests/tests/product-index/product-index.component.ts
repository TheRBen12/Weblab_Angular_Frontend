import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProductService} from '../../../services/product.service';
import {ProductComponent} from '../product/product.component';
import {NgForOf} from '@angular/common';
import {Subscription} from 'rxjs';
import {FilterService} from '../../../services/filter.service';

@Component({
  selector: 'app-product-index',
  imports: [
    ProductComponent,
    NgForOf
  ],
  templateUrl: './product-index.component.html',
  standalone: true,
  styleUrl: './product-index.component.css'
})
export class ProductIndexComponent implements OnInit, OnDestroy{
  title: string | undefined = "";
  productService = inject(ProductService);
  filterService = inject(FilterService);
  @Input() products: any[] = [];
  filterSubscription: Subscription = new Subscription();
  @Input() category: string = "";

  constructor(private route: ActivatedRoute) {
    this.title = this.route.snapshot.title;

  }

  ngOnInit(): void {
    this.fetchAllProducts();

    if (this.category != 'all') {
      this.route.url.subscribe((url) => {
        this.category = url[0].path

        if (this.category == "it-und-multimedia") {
          this.category = "IT und Multimedia"
        }
        if (this.category == "smartphones-und-tablets") {
          this.category = "Smartphones und Tablets"
        }
        if (this.category == "pc-und-notebooks") {
          this.category = "PC und Notebooks"
        }

        if (this.category.split("-").length < 2) {
          const capital = this.category.charAt(0);
          const upperCapital = capital.toUpperCase()
          this.category = this.category.replace(capital, upperCapital);
        }

        this.fetchProductsByCategory()
      });
    }else {
      this.title = "Gesamtsortiment";
    }


  }

  fetchAllProducts() {
    this.productService.getAllProducts().subscribe((products) => {
      this.products = products
    });
  }

  fetchProductsByCategory() {
    this.productService.getProductsByCategory(this.category).subscribe((result) => {
      this.products = result;
    }, error => {
      this.products = [];
    });
  }

  ngOnDestroy(): void {
    this.filterSubscription.unsubscribe();
  }
}
