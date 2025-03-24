import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Experiment} from '../models/experiment';
import {ExperimentTest} from '../models/experiment-test';
import {ExperimentTestExecution} from '../models/experiment-test-execution';
import {RecallRecognitionExperimentExecution} from '../models/recall-recognition-experiment-execution';
import {HicksLawExperimentExecution} from '../models/hicks-law-experiment-execution';

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
    return this.http.get<Experiment>('https://localhost:7147/api/experiment/' + experimentId, {params: {experimentId: experimentId}});
  }

  getExperimentTest(experimentTestId: number): Observable<ExperimentTest> {
    return this.http.get<ExperimentTest>('https://localhost:7147/api/ExperimentTest/test', {params: {experimentTestId: experimentTestId}});
  }


  setLastFinishedExperimentTest(id: number) {
    const data: any = {experimentId: id, finishedAt: new Date()}
    localStorage.setItem('lastFinishedExperimentTest', JSON.stringify(data));
  }

  getLastFinishedExperimentTest() {
    const data = localStorage.getItem("lastFinishedExperimentTest")
    if (data) {
      return JSON.parse(data);
    }
    return null;

  }


  getLastStartedExperiment(id: number) {
    return localStorage.getItem('lastSelectedExperimentTest');
  }

  setNextStartedExperimentTest(experiment: any) {
    const data: any = {experimentId: experiment.id, startedAt: experiment.startedAt}
    localStorage.setItem('lastStartedExperimentTest', JSON.stringify(data));
  }

  saveExperimentExecution(newExecution: ExperimentTestExecution): Observable<ExperimentTestExecution> {
    return this.http.post<ExperimentTestExecution>('https://localhost:7147/api/ExperimentTest/execution/new', newExecution);
  }


  getExperimentExecutionByStateAndTest(userId: number, testId: number, state: string): Observable<ExperimentTestExecution> {
    return this.http.get<ExperimentTestExecution>('https://localhost:7147/api/ExperimentTest/execution/find', {
      params: {
        userId: userId,
        testId: testId,
        state: state
      }
    });

  }

  getExperimentExecutionByState(userId: number, state: string): Observable<ExperimentTestExecution[]> {
    return this.http.get<ExperimentTestExecution[]>('https://localhost:7147/api/ExperimentTest/execution/find/state', {
      params: {
        userId: userId,
        state: state
      }
    });
  }


  saveRecallRecognitionExecution(recallRecognitionExecution: RecallRecognitionExperimentExecution) {
    return this.http.post<RecallRecognitionExperimentExecution>('https://localhost:7147/api/RecallRecognitionExperiment/new', recallRecognitionExecution);

  }

  getExperimentExecutionByTestAndState(testId: number, state: string): Observable<ExperimentTestExecution[]> {
    return this.http.get<ExperimentTestExecution[]>('https://localhost:7147/api/ExperimentTest/execution/find/test', {
      params: {
        testId: testId,
        state: state
      }
    });

  }

  saveHicksLawExperimentExecution(hicksLawExecution: HicksLawExperimentExecution): Observable<HicksLawExperimentExecution> {
    return this.http.post<HicksLawExperimentExecution>('https://localhost:7147/api/RecallRecognitionExperiment/new', hicksLawExecution);

  }
}
