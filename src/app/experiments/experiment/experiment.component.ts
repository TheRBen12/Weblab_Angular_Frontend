import {Component, effect, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Experiment} from '../../models/experiment';
import {NgIf, NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ExperimentTestExecution} from '../../models/experiment-test-execution';
import {ExperimentService} from '../../services/experiment.service';
import {ExperimentTest} from '../../models/experiment-test';
import {LoginService} from '../../services/login.service';
import {MatIcon} from '@angular/material/icon';
import {ExperimentFeedback} from '../../models/experiment-feedback';

@Component({
  selector: 'app-experiment',
  imports: [
    NgIf, NgClass, RouterLink, MatIcon
  ],
  standalone: true,
  templateUrl: './experiment.component.html',
  styleUrl: './experiment.component.css'
})
export class ExperimentComponent {
  @Input() experiment: Experiment = {name: "", state: "", position: 0, id: 0, numberExperimentTest: 0};
  @Input() currentUserPosition = 0;
  @Input() isProgressiveVisualization: boolean = true;
  @Input() finishedExecutions: ExperimentTestExecution[] = [];
  @Input() finishedExperiments: Experiment[] = [];
  @Output() experimentSelectEventEmitter: EventEmitter<Experiment> = new EventEmitter<Experiment>()
  numberFinishedTests: number = 0;
  completed: boolean = false;
  experimentService: ExperimentService = inject(ExperimentService);
  accountService = inject(LoginService);
  state: string = 'Freigeschaltet';

  private tests: ExperimentTest[] = [];

  constructor() {

    effect(() => {
      const userId = this.accountService.currentUser()?.id;
      if (userId) {
        this.fetchFinishedExecutions(userId, "FINISHED").subscribe((executions) => {
          if (executions.length > 0) {
            this.finishedExecutions = executions;
            this.completed = this.experimentIsCompleted(executions);
            if (this.completed){
              this.experiment.state = 'Abgeschlossen';
            }

            this.experimentService.getExperimentTestsByExperiment(this.experiment.id).subscribe((tests) => {
              this.tests = tests;
              if (this.tests.length > 0) {
                const finishedTests = this.finishedExecutions.map(exec => exec.experimentTest?.id);
                this.tests.forEach((test) => {
                  if (finishedTests.indexOf(test.id) != -1) {
                    this.numberFinishedTests++;
                  }
                });
              }
            });
          }
        });
      }
    });
  }
  private fetchFinishedExecutions(userId: number, state: string) {
    return this.experimentService.getExperimentExecutionByState(userId, state);
  }

  private experimentIsCompleted(executions: ExperimentTestExecution[]) {
    executions = executions.filter(execution => execution.experimentTest?.experiment?.id == this.experiment.id);
    let executionTestIds = executions.map(exec => exec.experimentTest?.id);
    executionTestIds = Array.from(new Set(executionTestIds));
    return executionTestIds.length == this.experiment.numberExperimentTest;

  }

  emitExperimentSelection() {
    //let navigationClicks = Number(localStorage.getItem("numberNavigationClicks"));
    //navigationClicks = navigationClicks + 1;
    //localStorage.setItem("numberNavigationClicks", String(navigationClicks));
    this.experimentSelectEventEmitter.emit(this.experiment);
  }
}
