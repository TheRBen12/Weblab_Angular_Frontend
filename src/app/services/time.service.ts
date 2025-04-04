import {inject, Injectable} from '@angular/core';
import {TimeInterval} from 'rxjs/internal/operators/timeInterval';
import {BehaviorSubject, Observable} from 'rxjs';
import {D} from '@angular/cdk/keycodes';
import {UserNavigationTime} from '../models/user-navigation-time';
import {HttpClient} from '@angular/common/http';
import {NavigationTime} from '../models/navigation-time';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  timeToReadWelcomeModal = 0;
  welcomeModalTimer = 0;
  experimentNavigationTimeSubscription: BehaviorSubject<UserNavigationTime|null> = new BehaviorSubject<any>(null);
  interval: any
  time: number = 0;
  http: HttpClient = inject(HttpClient);
  constructor() {

  }

  getExperimentNavigationTimeSubscription() {
    return this.experimentNavigationTimeSubscription.asObservable();
  }
  updateExperimentNavigationTime(navTime: UserNavigationTime){
    this.experimentNavigationTimeSubscription.next(navTime);
  }

  startWelcomeModalTimer() {
    this.welcomeModalTimer = setInterval(() => {
      this.timeToReadWelcomeModal++;
    }, 1000);

  }

  stopTimer() {
    clearInterval(this.interval);
    this.time = 0;
  }

  getCurrentTime(){
    return this.time;
  }

  getTimeToReadWelcomeModal(){
    return this.timeToReadWelcomeModal;
  }

  stopWelcomeModalTimer() {
    clearInterval(this.welcomeModalTimer);
  }

  saveNavigationTime(timeData: UserNavigationTime): Observable<UserNavigationTime> {
    return this.http.post<UserNavigationTime>("https://localhost:7147/api/userNavigation/new", timeData)
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.time++;
    }, 1000)
  }
}
