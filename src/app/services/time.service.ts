import {inject, Injectable} from '@angular/core';
import {interval, Observable, Subscription} from 'rxjs';
import {UserNavigationTime} from '../models/user-navigation-time';
import {HttpClient} from '@angular/common/http';


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
  private navigationTimeSubscription!: Subscription;

  private autoStartSubscription!: Subscription
  autoStartCountdown: number = 3;
  private navigationTime: number = 0;

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

  startNavigationTimer(){
    this.navigationTime = 0;
    this.navigationTimeSubscription = interval(1000).subscribe(() => {
      this.navigationTime++;
      console.log(this.navigationTime);
    });
  }

  getNavigationTime(){
    return this.navigationTime;
  }


  startTimer() {
    this.time = 0;
      this.timerSubscription = interval(1000).subscribe(() => {
        this.time++;
        console.log(this.time);
      });
  }

  stopNavigationTimer() {
    if (this.navigationTimeSubscription){
      this.navigationTimeSubscription.unsubscribe();
    }

    this.navigationTime = 0;
  }
}
