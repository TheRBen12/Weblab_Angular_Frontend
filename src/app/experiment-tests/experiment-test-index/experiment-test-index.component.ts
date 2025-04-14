import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, switchMap} from 'rxjs';
import {ExperimentTest} from '../../models/experiment-test';
import {ExperimentService} from '../../services/experiment.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {ExperimentTestComponent} from '../experiment-test/experiment-test.component';
import {SearchBarComponent} from '../../search-bar/search-bar.component';
import {Experiment} from '../../models/experiment';
import {FilterService} from '../../services/filter.service';
import {ExperimentTestExecution} from '../../models/experiment-test-execution';
import {LoginService} from '../../services/login.service';
import {SettingService} from '../../services/setting.service';
import {NavigationSetting} from '../../models/navigation-setting';
import {UserSetting} from '../../models/user-setting';
import {TimeService} from '../../services/time.service';
import {ExperimentTestSelectionTime} from '../../models/experiment-test-selection-time';

@Component({
  selector: 'app-experiment-test-index',
  imports: [
    NgForOf,
    NgIf,
    ExperimentTestComponent,
    SearchBarComponent,
    NgClass
  ],
  standalone: true,
  templateUrl: './experiment-test-index.component.html',
  styleUrl: './experiment-test-index.component.css'
})
export class ExperimentTestIndexComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  experimentService = inject(ExperimentService);
  filterService = inject(FilterService);
  userService = inject(LoginService);
  settingService: SettingService = inject(SettingService);
  timeService: TimeService = inject(TimeService);
  router: Router = inject(Router);
  loginService: LoginService = inject(LoginService);

  experimentId: number = 0;
  experimentTests: ExperimentTest[] = [];
  nextExperiment?: ExperimentTest | null
  filteredExperimentTests: ExperimentTest[] = [];
  experiment: Experiment | null = null;
  markedText: string = "";
  finishedExecutions: ExperimentTestExecution[] = [];
  testCompletedKeyValues: { [key: number]: boolean } = {};
  navigationConfig: NavigationSetting | null = null;
  countDownToStartNextTest: number = 4;
  setting?: UserSetting
  numberTests: number = 0;
  private redirectTimeout: number = 0;

  constructor() {

    effect(() => {
      const userId = this.userService.currentUser()?.id;
      if (userId) {
        this.fetchExecutions(userId);
      }
    });
  }

  ngOnInit() {
    this.timeService.startTimer();

    this.router.events
      .pipe(filter(event => (event instanceof NavigationEnd)))
      .subscribe((sub) => {
        if (this.router.url == "/") {
          this.countDownToStartNextTest = 3;
          this.timeService.stopTimer();
        }
      });

    localStorage.setItem('numberNavigationClicks', "0");
    localStorage.removeItem("cart");
    this.route.paramMap.pipe(
      switchMap(params => {
        this.experimentId = Number(params.get('expId'));
        this.fetchExperiment()
        return this.experimentService.getExperimentTestsByExperiment(this.experimentId);
      })
    ).subscribe(tests => {
      this.experimentTests = tests;
      this.numberTests = tests.length;
      this.experimentTests = this.sortExperimentTestsByPosition(this.experimentTests)
      this.filteredExperimentTests = this.experimentTests;
      const userId = this.userService.currentUser()?.id
      if (userId) {
        this.fetchExecutions(userId);
        this.fetchNavigationConfig(userId);
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
      this.setting = setting;
      if (setting.autoStartNextExperiment) {
        this.nextExperiment = this.findNextExperiment();
        if (this.nextExperiment) {
          // Countdown visualisieren (optional)
          const interval = setInterval(() => {
            this.countDownToStartNextTest--;
            if (this.countDownToStartNextTest < 1) {
              clearInterval(interval);
            }
          }, 1000);

          const testId = this.nextExperiment.id;
          this.redirectTimeout = setTimeout(() => {
            clearInterval(this.redirectTimeout);
            this.saveTestSelectionTime(testId);
            this.router.navigateByUrl("/tests/detail/" + this.nextExperiment?.id);
          }, 3000);
        }
      }
      if (setting.progressiveVisualizationExperimentTest && this.experimentTests.length > 0) {
        this.displayProgressiveVisualizationTestsAccordingToSetting();
      }
    });
  }

  private displayProgressiveVisualizationTestsAccordingToSetting() {
    let tests: any[] = [];
    // find finished tests
    const finishedTests = this.findFinishedTests();
    // extract non-finished tests
    const nonFinishedTests = this.findNonFinishedTests();
    // find test with min pos
    let testWithMinPosition = this.findTestWithMinPos(nonFinishedTests);
    this.filteredExperimentTests = tests.concat(finishedTests.concat([testWithMinPosition]))
    this.experimentTests = this.filteredExperimentTests;
  }

  private fetchNavigationConfig(userId: number) {
    this.settingService.fetchNavigationSetting(userId).subscribe((navigationConfig) => {
      this.navigationConfig = navigationConfig;
    })
  }

  private findNextExperiment(): ExperimentTest | null {
    // extract non-finished tests
    const nonFinishedTests = this.findNonFinishedTests();
    if (nonFinishedTests.length == 0) {
      return null
    }
    return this.findTestWithMinPos(nonFinishedTests);

  }

  findFinishedTests() {
    return this.finishedExecutions.map(exec => exec.experimentTest);
  }

  findNonFinishedTests() {
    return this.experimentTests.filter((test) => {
      const finishedTestIds = this.finishedExecutions.map(exec => exec.experimentTest?.id);
      return finishedTestIds.indexOf(test.id) == -1;
    });
  }

  findTestWithMinPos(tests: ExperimentTest[]) {
    let testWithMinPosition = tests[0]!;
    const minPos = testWithMinPosition.position;
    tests.forEach((test) => {
      if (test?.position < minPos) {
        testWithMinPosition = test;
      }
    });
    return testWithMinPosition;
  }

  ngOnDestroy(): void {
    this.countDownToStartNextTest = 3;
    debugger;
    clearInterval(this.redirectTimeout);
  }

  saveTestSelectionTime(testId: number) {
    const time = this.timeService.getCurrentTime();
    this.timeService.stopTimer();
    const experimentTestSelectionTime: ExperimentTestSelectionTime = {
      experimentTestId: testId,
      time: time,
      userId: this.loginService.currentUser()?.id,
      settingId: this.setting?.id,
    };
    this.experimentService.saveExperimentTestSelectionTime(experimentTestSelectionTime).subscribe((result) => {
    });
  }
}
