import {inject, Injectable} from '@angular/core';
import {TimeInterval} from 'rxjs/internal/operators/timeInterval';
import {BehaviorSubject, interval, Observable, Subscription} from 'rxjs';
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
  interval: any
  time: number = 0;
  http: HttpClient = inject(HttpClient);
  private timerSubscription!: Subscription;

  startWelcomeModalTimer() {
    this.welcomeModalTimer = setInterval(() => {
      this.timeToReadWelcomeModal++;
    }, 1000);

  }

  stopTimer() {
    clearInterval(this.interval);
    if (this.timerSubscription){
      this.timerSubscription.unsubscribe();
    }

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
    this.time = 0;
      this.timerSubscription = interval(1000).subscribe(() => {
        this.time++;
        console.log(this.time);
      });

  }

}
