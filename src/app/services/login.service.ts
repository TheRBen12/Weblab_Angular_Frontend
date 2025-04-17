import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {User} from '../models/user';
import {UserBehaviour} from '../models/user-behaviour';
import {D} from '@angular/cdk/keycodes';
import {TimeService} from './time.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  http = inject(HttpClient);
  private userSource = new ReplaySubject<User | null>(1);
  currentUser = signal<User | null>(null);
  userBehaviourSubscription: BehaviorSubject<UserBehaviour | null> = new BehaviorSubject<UserBehaviour | null>(null);
  user$ = this.userSource.asObservable()
  private timeService: TimeService = inject(TimeService);
  baseUrl = environment.apiUrl;


  constructor() {
  }

  login(email: string): Observable<User> {
    return this.http.get<User>(this.baseUrl + "account/login", {params: {email: email}});
  }

  setUser(user: User) {
    this.currentUser.set(user);
    this.userSource.next(user);
  }

  refreshUser(email: any) {
    return this.http.get<User>(this.baseUrl + "account/login", {params: {email: email}}).subscribe(
      user => {
        if (user) {
          this.setUser(user);
          console.log(user);
        }
      }
    );
  }

  getUserBehaviourSubscription() {
    return this.userBehaviourSubscription.asObservable();
  }

  getCurrentUser() {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user: User = JSON.parse(userString);
      return user
    }
    return null;
  }

  logout() {
    this.timeService.stopTimer();
    localStorage.clear();
    sessionStorage.clear();
    const finishedAt = new Date();
    const user = this.currentUser();
    if (user) {
      user.finishedUserExperienceAt = finishedAt;
      this.updateUser(user).subscribe();
    }
    this.currentUser.set(null);
  }

  updateUser(currentUser: User): Observable<User> {
    return this.http.put<User>("https://localhost:7147/api/user/update", currentUser)

  }

  getUserBehaviour(userId: any) {
    return this.http.get<UserBehaviour>("https://localhost:7147/api/user/behaviour/find", {params: {userId: userId}});
  }

  updateUserBehaviour(userBehaviour: UserBehaviour): Observable<UserBehaviour> {
    return this.http.put<UserBehaviour>("https://localhost:7147/api/user/behaviour/update", userBehaviour);

  }

  createUserBehaviour(userBehaviour: UserBehaviour) {
    return this.http.post<UserBehaviour>("https://localhost:7147/api/user/behaviour/create", userBehaviour);
  }

  emitUserBehaviour(userBehaviour: UserBehaviour) {
    this.userBehaviourSubscription.next(userBehaviour);
  }

  increaseNumberClickedSettings(userBehaviour: UserBehaviour) {
    userBehaviour.clickedOnSettings = true;
    userBehaviour.numberClickedOnSettings = userBehaviour?.numberClickedOnSettings + 1;
    if (localStorage.getItem("closedSettingHint")){
      userBehaviour.clickedOnSettingsAfterHintDisplayed = true;
    }
    return userBehaviour;
  }

  increaseNumberClickedHelp(userBehaviour: UserBehaviour) {
    userBehaviour.clickedOnHelp = true;
    userBehaviour.numberClickedOnHelp = userBehaviour.numberClickedOnHelp + 1;
    return userBehaviour;
  }

}
