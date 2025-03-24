import {Component, ElementRef, inject, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {switchMap} from 'rxjs';
import {ExperimentTest} from '../../models/experiment-test';
import {ExperimentService} from '../../services/experiment.service';
import {NgForOf, NgIf} from '@angular/common';
import {ExperimentTestComponent} from '../experiment-test/experiment-test.component';
import {SearchBarComponent} from '../../search-bar/search-bar.component';
import {Experiment} from '../../models/experiment';
import {FilterService} from '../../services/filter.service';
import {ExperimentTestExecution} from '../../models/experiment-test-execution';
import {LoginService} from '../../services/login.service';
import {SettingService} from '../../services/setting.service';
import {UserSetting} from '../../models/user-setting';

@Component({
  selector: 'app-experiment-test-index',
  imports: [
    NgForOf,
    NgIf,
    ExperimentTestComponent,
    SearchBarComponent,
    RouterLink
  ],
  standalone: true,
  templateUrl: './experiment-test-index.component.html',
  styleUrl: './experiment-test-index.component.css'
})
export class ExperimentTestIndexComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  experimentService = inject(ExperimentService);
  filterService = inject(FilterService);
  userService = inject(LoginService);
  settingService: SettingService = inject(SettingService);
  experimentId: number = 0;
  experimentTests: ExperimentTest[] = [];
  filteredExperimentTests: ExperimentTest[] = [];
  experiment: Experiment | null = null;
  markedText: string = "";
  finishedExecutions: ExperimentTestExecution[] = [];
  testCompletedKeyValues: { [key: number]: boolean } = {};


  ngOnInit() {

    localStorage.removeItem("cart");
    this.route.paramMap.pipe(
      switchMap(params => {
        this.experimentId = Number(params.get('expId'));
        this.fetchExperiment()
        return this.experimentService.getExperimentTestsByExperiment(this.experimentId);
      })
    ).subscribe(tests => {
      this.experimentTests = tests;
      this.experimentTests = this.sortExperimentTestsByPosition(this.experimentTests)
      this.filteredExperimentTests = this.experimentTests;
      const userId = this.userService.currentUser()?.id
      if (userId) {
        this.fetchExecutions(userId);
      }
    });

  }

  fetchExecutions(userId: number) {
    this.experimentService.getExperimentExecutionByState(userId, "FINISHED").subscribe((executions) => {
      this.finishedExecutions = executions;
      this.finishedExecutions = this.finishedExecutions.filter((exec, index) => {
        const ids = this.finishedExecutions.map(exec => exec.experimentTest?.id);
        return ids.indexOf(exec.experimentTest?.id) == index && exec.experimentTest?.experiment?.id == this.experiment?.id;
      });
      this.fetchCurrentUserSetting(userId);
      this.finishedExecutions.forEach((exec) => {
        this.testCompletedKeyValues[exec.experimentTest?.id ?? -1] = true;
        let test = this.experimentTests.find(test => test.id == exec.experimentTest?.id);
        if (test) {
          test.state = "Abgeschlossen";
        }
      })
    });
  }

  fetchExperiment() {
    this.experimentService.getExperiment(this.experimentId).subscribe((experiment) => {
      this.experiment = experiment;
    })
  }

  sortExperimentTestsByPosition(experiments: ExperimentTest[]) {
    experiments = experiments.sort((exp1, exp2) => {
      return Number(exp1.position) - Number(exp2.position);
    });
    return experiments;
  }

  filterTestsAndMarkText($event: string) {
    this.markedText = $event;
    this.filteredExperimentTests = this.filterService.filterExperimentTests($event, this.experimentTests);
  }

  private fetchCurrentUserSetting(userId: number) {
    this.settingService.fetchLastSetting(userId).subscribe((setting) => {
      if (setting.progressiveVisualizationExperimentTest && this.experimentTests.length > 0) {
        this.displayProgressiveVisualizationTestsAccordingToSetting();
      }
    });
  }

  private displayProgressiveVisualizationTestsAccordingToSetting() {
    let tests: any[] = [];
    // find finished tests
    const finishedTests = this.finishedExecutions.map(exec => exec.experimentTest);
    // extract non-finished tests
    const nonFinishedTests = this.experimentTests.filter((test) => {
      const finishedTestIds = this.finishedExecutions.map(exec => exec.experimentTest?.id);
      return finishedTestIds.indexOf(test.id) == -1;
    });
    // find test with min pos
    let testWithMinPosition = nonFinishedTests[0]!;
    const minPos = testWithMinPosition.position;
    nonFinishedTests.forEach((test) => {
      if (test?.position < minPos) {
        testWithMinPosition = test;
      }
    });
    this.filteredExperimentTests =  tests.concat(finishedTests.concat([testWithMinPosition]))
    this.experimentTests = this.filteredExperimentTests;
  }
}
