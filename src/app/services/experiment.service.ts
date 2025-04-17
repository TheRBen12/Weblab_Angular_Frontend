import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Experiment} from '../models/experiment';
import {ExperimentTest} from '../models/experiment-test';
import {ExperimentTestExecution} from '../models/experiment-test-execution';
import {RecallRecognitionExperimentExecution} from '../models/recall-recognition-experiment-execution';
import {HicksLawExperimentExecution} from '../models/hicks-law-experiment-execution';
import {ErrorCorrectionExperimentExecution} from '../models/ErrorCorrectionExperimentExecution';
import {MentalModelExecution} from '../models/mental-model-execution';
import {FormFeedbackExperimentExecution} from '../models/form-feedback-experiment-execution';
import {FittsLawExperiment} from '../models/fitts-law-experiment';
import {RestorffExperiment} from '../models/restorff-experiment';
import {ExperimentFeedback} from '../models/experiment-feedback';
import {ExperimentSelectionTime} from '../models/experiment-selection-time';
import {ExperimentTestSelectionTime} from '../models/experiment-test-selection-time';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExperimentService {
  http = inject(HttpClient);
  baseUrl = environment.apiUrl;


  constructor() {
  }

  public getExperiments(): Observable<Experiment[]> {
    return this.http.get<Experiment[]>(this.baseUrl + "experiment");
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
    const d = new Date();
    const data: any = {experimentId: id, finishedAt: d}
    localStorage.setItem('lastFinishedExperimentTest', JSON.stringify(data));
  }

  getLastFinishedExperimentTest() {
    const data = localStorage.getItem("lastFinishedExperimentTest")
    if (data) {
      return JSON.parse(data);
    }
    return null;

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
    return this.http.post<HicksLawExperimentExecution>('https://localhost:7147/api/HicksLawExperiment/new', hicksLawExecution);

  }

  saveErrorCorrectionExperiment(execution: ErrorCorrectionExperimentExecution): Observable<ErrorCorrectionExperimentExecution> {
    return this.http.post<ErrorCorrectionExperimentExecution>('https://localhost:7147/api/ErrorCorrectionExperiment/new', execution);

  }

  saveMentalModelExperimentExecution(execution: { [p: string]: any }) {
    return this.http.post<MentalModelExecution>('https://localhost:7147/api/experiment/mental-model/new', execution);
  }

  saveFormFeedbackExperiment(execution: { [p: string]: any }) {
    return this.http.post<FormFeedbackExperimentExecution>('https://localhost:7147/api/formAndFeedbackExperiment/form-feedback-experiment/new', execution);  }

  saveFittsLawExperiment(execution: {[p: string]: any}) {
    return this.http.post<FittsLawExperiment>('https://localhost:7147/api/fittsLawExperiment/new', execution);
  }

  saveRestorffExperiment(execution: { [p: string]: any }) {
    return this.http.post<RestorffExperiment>('https://localhost:7147/api/restorffExperiment/new', execution);
  }

  submitFeedback(feedback: ExperimentFeedback) {
    return this.http.post<ExperimentFeedback>('https://localhost:7147/api/experiment/feedback/new', feedback);

  }

  saveExperimentSelectionTime(experimentSelectionTime: ExperimentSelectionTime) {
    return this.http.post<ExperimentSelectionTime>('https://localhost:7147/api/experiment/selection-time/new', experimentSelectionTime);

  }

  saveExperimentTestSelectionTime(experimentTestSelectionTime: ExperimentTestSelectionTime) {
    return this.http.post<ExperimentTestSelectionTime>('https://localhost:7147/api/experimentTest/selection-time/new', experimentTestSelectionTime);

  }

  getExperimentTests(): Observable<ExperimentTest[]> {
    return this.http.get<ExperimentTest[]>('https://localhost:7147/api/experimentTest/all');

  }
}
