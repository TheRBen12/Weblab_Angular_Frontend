import {Component, effect, inject, OnInit} from '@angular/core';
import {ExperimentService} from '../../services/experiment.service';
import {ExperimentTest} from '../../models/experiment-test';
import {ExperimentComponent} from '../../experiments/experiment/experiment.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {SearchBarComponent} from '../../search-bar/search-bar.component';
import {ExperimentTestComponent} from '../experiment-test/experiment-test.component';
import {LoginService} from '../../services/login.service';
import {FilterService} from '../../services/filter.service';
import {ExperimentTestExecution} from '../../models/experiment-test-execution';
import {SettingService} from '../../services/setting.service';
import {ExperimentTestSelectionTime} from '../../models/experiment-test-selection-time';
import {TimeService} from '../../services/time.service';
import {UserSetting} from '../../models/user-setting';
import {NavigationSetting} from '../../models/navigation-setting';
import {Router} from '@angular/router';

@Component({
  selector: 'app-experiment-test-list',
  imports: [
    ExperimentComponent,
    NgForOf,
    NgIf,
    SearchBarComponent,
    ExperimentTestComponent,
    NgClass
  ],
  templateUrl: './experiment-test-list.component.html',
  standalone: true,
  styleUrl: './experiment-test-list.component.css'
})
export class ExperimentTestListComponent implements OnInit {
  experimentService: ExperimentService = inject(ExperimentService);
  experimentTests: ExperimentTest[] = [];
  loginService: LoginService = inject(LoginService);
  filterService: FilterService = inject(FilterService);
  settingService: SettingService = inject(SettingService);
  timeService: TimeService = inject(TimeService);
  router: Router = inject(Router);

  title: string = "Versuchsexperimente";
  serverError: boolean = false;
  navigationSetting?: NavigationSetting;
  finishedExperimentTests: ExperimentTest[] = [];
  finishedExecutions: ExperimentTestExecution[] = [];
  filteredExperimentTests: ExperimentTest[] = [];
  testCompletedKeyValues: { [key: number]: boolean } = {};
  currentUserSetting?: UserSetting;
  currentUserId?: number | null = null;
  markedText: string = "";

  constructor() {
    effect(() => {
      const userId = this.loginService.currentUser()?.id;
      if (userId) {
        this.fetchUserNavigationConfiguration(userId);
        this.fetchFinishedExecutions(userId, "FINISHED");
      }
    });
  }

  ngOnInit(): void {
    this.timeService.startTimer();
    this.fetchExperimentTests();
    this.currentUserId = this.loginService.currentUser()?.id;
    if (this.currentUserId) {
      this.fetchUserNavigationConfiguration(this.currentUserId);
      this.fetchFinishedExecutions(this.currentUserId, "FINISHED");
    }
  }

  fetchUserNavigationConfiguration(userId: number) {
    this.settingService.fetchNavigationSetting(userId).subscribe((config) => {
      this.navigationSetting = config
    });
  }

  private fetchExperimentTests() {
    this.experimentService.getExperimentTests().subscribe((tests) => {
      this.filteredExperimentTests = tests;
      this.experimentTests = tests;
    }, (error) => {
      if (error) {
        this.serverError = true;
      }
    });
  }

  updateUserBehaviour() {

  }

  filterExperimentTests($event: string) {
    this.markedText = $event;
    this.filteredExperimentTests = this.filterService.filterExperimentTests($event, this.experimentTests);
    this.filteredExperimentTests = this.filterService.filterExperimentTests($event, this.experimentTests);
  }

  saveTestSelectionTime(testId: number) {
    const time = this.timeService.getCurrentTime();
    this.timeService.stopTimer();
    const experimentTestSelectionTime: ExperimentTestSelectionTime = {
      experimentTestId: testId,
      time: time,
      userId: this.loginService.currentUser()?.id,
      settingId: this.currentUserSetting?.id,
    };
    localStorage.setItem("lastTestRoute", this.router.url);
    this.experimentService.saveExperimentTestSelectionTime(experimentTestSelectionTime).subscribe((result) => {
      //this.router.navigateByUrl("/tests/detail/"+testId)
    });

  }


  private fetchFinishedExecutions(userId: number, state: string) {
    this.experimentService.getExperimentExecutionByState(userId, state).subscribe((executions) => {
      this.finishedExecutions = executions;
      this.finishedExperimentTests = this.calculateFinishedTests(executions);

    });
  }

  private calculateFinishedTests(finishedExecutions: ExperimentTestExecution[]): (ExperimentTest)[] {
    const finishedTests: ExperimentTest[] = [];
    finishedExecutions.forEach((exec) => {
      if (exec.experimentTest) {
        finishedTests.push(exec.experimentTest);
      }
    })
    finishedExecutions.forEach((exec: ExperimentTestExecution) => {
      this.testCompletedKeyValues[exec.experimentTest?.id??-1] = true;
    });
    return finishedTests;
  }

}
