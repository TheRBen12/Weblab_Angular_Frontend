import {Injectable} from '@angular/core';
import {TimeInterval} from 'rxjs/internal/operators/timeInterval';
import {BehaviorSubject} from 'rxjs';
import {D} from '@angular/cdk/keycodes';
import {ExperimentNavigationTime} from '../models/experiment-navigation-time';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  timeToReadWelcomeModal = 0;
  welcomeModalTimer = 0;
  experimentNavigationTimeSubscription: BehaviorSubject<ExperimentNavigationTime|null> = new BehaviorSubject<any>(null);

  constructor() {

  }

  getExperimentNavigationTimeSubscription() {
    return this.experimentNavigationTimeSubscription.asObservable();
  }
  updateExperimentNavigationTime(navTime: ExperimentNavigationTime){
    this.experimentNavigationTimeSubscription.next(navTime);
  }

  saveTimeToReadWelcomeModal() {

  }

  startWelcomeModalTimer() {
    this.welcomeModalTimer = setInterval(() => {
      this.timeToReadWelcomeModal++;
    }, 1000);

  }

  stopTimer() {

  }

  getTimeToReadWelcomeModal(){
    return this.timeToReadWelcomeModal;
  }

  stopWelcomeModalTimer() {
    clearInterval(this.welcomeModalTimer);
  }

  saveNavigationTime(timeData: ExperimentNavigationTime) {

  }
}
