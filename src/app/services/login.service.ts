import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, ReplaySubject} from 'rxjs';
import {User} from '../models/user';
import {J} from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  http = inject(HttpClient);
  private userSource = new ReplaySubject<User | null>(1);
  currentUser = signal<User | null>(null);
  user$ = this.userSource.asObservable()
  constructor() { }

  login(email: string): Observable<User>{
    return this.http.get<User>("https://localhost:7147/api/account/login", {params: {email: email}});
  }
  setUser(user: User){
    this.currentUser.set(user);
    this.userSource.next(user);
  }

  refreshUser(email: any){
    return this.http.get<User>("https://localhost:7147/api/account/login", {params: {email: email}}).subscribe(
      user => {
        if (user){
          this.setUser(user);
          console.log("user has been set");
        }
      }
    );
  }

  getCurrentUser() {
    const userString = localStorage.getItem('user');
    if (userString){
      const user: User = JSON.parse(userString);
      return user
    }
    return null;
  }

  logout(){
    localStorage.clear();
    this.currentUser.set(null);
  }

}
