import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Experiment} from '../models/experiment';
import {ExperimentTest} from '../models/experiment-test';

@Injectable({
  providedIn: 'root'
})
export class ExperimentService {
  http = inject(HttpClient);

  constructor() {
  }

  public getExperiments(): Observable<Experiment[]> {
    return this.http.get<Experiment[]>('https://localhost:7147/api/experiment');
  }

  public getExperimentTestsByExperiment(experimentId: number): Observable<ExperimentTest[]> {
    return this.http.get<ExperimentTest[]>('https://localhost:7147/api/ExperimentTest', {params: {experimentId: experimentId}});
  }

  getExperiment(experimentId: number): Observable<Experiment> {
    return this.http.get<Experiment>('https://localhost:7147/api/experiment/'+experimentId, {params: {experimentId: experimentId}});
  }

  getExperimentTest(experimentTestId: number): Observable<ExperimentTest> {
    return this.http.get<ExperimentTest>('https://localhost:7147/api/ExperimentTest/test', {params: {experimentTestId: experimentTestId}});
  }
}
