import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NavigationClickTime} from '../models/navigation-click-time';

@Injectable({
  providedIn: 'root'
})
export class UserNavigationService {
  http: HttpClient = inject(HttpClient);

  constructor() { }


  saveNavigationClickTime(navigationClickTime: NavigationClickTime): Observable<NavigationClickTime>{
    return this.http.post<NavigationClickTime>("https://localhost:7147/api/Navigation/navigation-click-time/new", navigationClickTime);
  }

}
