import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

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
}
