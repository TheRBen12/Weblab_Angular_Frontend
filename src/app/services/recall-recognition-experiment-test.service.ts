import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecallRecognitionExperimentTestService {
  categoryLinksSubject = new BehaviorSubject<boolean>(false);
  constructor() { }

  updateSideMenu(updateLinks: boolean){
    this.categoryLinksSubject.next(updateLinks);
  }
  getSubject(){
    return this.categoryLinksSubject.asObservable();
  }
}
