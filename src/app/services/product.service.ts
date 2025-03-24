import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {ProductType} from '../models/product-category';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  http = inject(HttpClient);
  foodCategories: string[] = ["Teigwaren", "Penne", "Spaghetti", "Spiral-Nudeln", "Tomaten", "Brot", "Zwiebeln", "Schokolade"];
  basketSubscription: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private productLimitSubscription: BehaviorSubject<number|null> = new BehaviorSubject<number|null>(null);


  constructor(private toastr: ToastrService) {
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

  getProductById(productId: number): Observable<any> {
    return this.http.get<any>("https://localhost:7147/api/product/find", {params: {productId: productId}});
  }

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7147/api/product/all");
  }

  isFoodProduct(productType: string) {
    return this.foodCategories.indexOf(productType) != -1;

  }
  addToBasket(product: any) {
    let cart = JSON.parse(localStorage.getItem("cart") ?? "[]") || []; // Falls `null`, nutze leeres Array
    if (!cart.find((productInBasket: any) => productInBasket.id == product.id)){
      cart.push(product);
    }else{
      this.toastr.info("Sie können jedes Produkt nur einmal in den Warenkorb legen");
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    this.basketSubscription.next(cart);
  }

  basketIsEmpty() {
    const cart = JSON.parse(localStorage.getItem("cart") ?? "[]") || []; // Falls `null`, nutze leeres Array
    return cart.length == 0;
  }
  getBasketSubscription(){
    return this.basketSubscription.asObservable();
  }
   getBasket() {
     const cart = JSON.parse(localStorage.getItem("cart") ?? "[]") || []; // Falls `null`, nutze leeres Array
     this.basketSubscription.next(cart);
  }

  removeProductFromBusket(product: any) {
    let cart = JSON.parse(localStorage.getItem("cart") ?? "[]") || []; // Falls `null`, nutze leeres Array
    cart = cart.filter((productInBusket: any) => productInBusket.id != product.id)
    localStorage.setItem("cart", JSON.stringify(cart));
    this.basketSubscription.next(cart);
  }

  getAllSubcategoriesByParentCategory(category: string) {
    return this.http.get<ProductType[]>("https://localhost:7147/api/product/all/subcategories", {params: {category: category}});
  }

  updateProductLimit(productLimit: number) {
    this.productLimitSubscription.next(productLimit);
  }

  getProductLimitSubscription() {
    return this.productLimitSubscription.asObservable();
  }
}
