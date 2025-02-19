import { Injectable } from '@angular/core';
import {TimeInterval} from 'rxjs/internal/operators/timeInterval';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  timeToReadWelcomeModal = 0;
  welcomeModalTimer = 0;
  constructor() {

  }


  saveTimeToReadWelcomeModal(){

  }

  startWelcomeModalTimer(){
    this.welcomeModalTimer = setInterval(() => {
      this.timeToReadWelcomeModal ++;
    }, 1000);

  }

  stopTimer(){

  }

  stopWelcomeModalTimer() {
    clearInterval(this.welcomeModalTimer);
  console.log(this.timeToReadWelcomeModal);
  }

}
