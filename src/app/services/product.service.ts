import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProductType} from '../models/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  http = inject(HttpClient);

  constructor() {
  }

  getDailyOfferProduct(): Observable<any> {
    return this.http.get("https://localhost:7147/api/product/daily-offer");
  }
  getProductsByCategory(category: string): Observable<any> {
    return this.http.get("https://localhost:7147/api/product", {params: {category: category}});
  }

  fetchSubCategoriesObjects(category: string): Observable<ProductType[]> {
    return this.http.get<ProductType[]>("https://localhost:7147/api/product/category", {params: {category: category}});

  }

  fetchTopSales(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7147/api/product/top-sales");
  }
}
