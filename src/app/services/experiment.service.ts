import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../models/user';
import {Experiment} from '../models/experiment';
import {ExperimentComponent} from '../experiments/experiment/experiment.component';

@Injectable({
  providedIn: 'root'
})
export class ExperimentService {
  http = inject(HttpClient);

  constructor() {
  }

  public getExperiments():Observable<Experiment[]> {
    return this.http.get<Experiment[]>('https://localhost:7147/api/experiments/');
  }
}
