import {Component, inject, OnInit} from '@angular/core';
import {switchMap} from 'rxjs';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ExperimentService} from '../../services/experiment.service';
import {ExperimentTest} from '../../models/experiment-test';
import {experimentTestRoutes} from '../routes';
import {TimeService} from '../../services/time.service';
import {LoginService} from '../../services/login.service';
import {SettingService} from '../../services/setting.service';
import {UserSetting} from '../../models/user-setting';
import {ExperimentTestExecution} from '../../models/experiment-test-execution';
import {UserNavigationTime} from '../../models/user-navigation-time';
import {D} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-experiment-test-detail',
  imports: [
    RouterLink,
  ],
  standalone: true,
  templateUrl: './experiment-test-detail.component.html',
  styleUrl: './experiment-test-detail.component.css'
})
export class ExperimentTestDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  experimentService = inject(ExperimentService);
  timeService: TimeService = inject(TimeService);
  userService: LoginService = inject(LoginService);
  settingService: SettingService = inject(SettingService);
  experimentTestId: number = 0;
  experimentTest?: ExperimentTest
  experimentTestUrl: string = "";
  userSetting!: UserSetting;
  openedTestDescAt: Date = new Date();
  timeReadingDescription: number = 0;

  ngOnInit(): void {
    this.timeService.startTimer();
    this.openedTestDescAt = new Date();
    localStorage.removeItem("cart");
    this.route.paramMap.pipe(
      switchMap(params => {
        this.experimentTestId = Number(params.get('testId'));
        return this.experimentService.getExperimentTest(this.experimentTestId);
      })
    ).subscribe(test => {
      this.experimentTest = test;
      if (this.experimentTest?.experiment) {
        this.experimentTestUrl = experimentTestRoutes[this.experimentTest.experiment.name];
      }
    });

    this.fetchCurrentUserSetting();
  }


  fetchCurrentUserSetting() {
    this.settingService.fetchLastSetting(this.userService.currentUser()?.id).subscribe((setting) => {
      this.userSetting = setting;
    });
  }

  setLastStartedExperiment() {
    this.experimentService.setNextStartedExperimentTest({id: this.experimentTest?.id ?? 0, startedAt: new Date()});
    const lastFinishedExperiment = this.experimentService.getLastFinishedExperimentTest();
    const reachedSiteAt = localStorage.getItem('reachedSiteAt');
    const reachedSiteDate: Date = reachedSiteAt ? new Date(reachedSiteAt): new Date();
    const startedNavigation = lastFinishedExperiment != null ? lastFinishedExperiment.finishedAt : reachedSiteDate;
    const lastFinishedExperimentTestId = lastFinishedExperiment != null ? lastFinishedExperiment.experimentId : null
    let savedNumberClicks = localStorage.getItem('numberNavigationClicks');
    let numberClicks = 0;
    if (savedNumberClicks){
      numberClicks = Number(savedNumberClicks);
    }
    const navigationTime: UserNavigationTime = {
      userId: this.userSetting.userID,
      finishedNavigation: new Date(),
      startedNavigation: startedNavigation,
      toExperimentId: this.experimentTest?.id??-1,
      userSettingId: this.userSetting.id,
      fromExperimentId: lastFinishedExperimentTestId,
      numberClicks: numberClicks
    };
    localStorage.setItem('numberNavigationClicks', String(0));
    this.timeService.saveNavigationTime(navigationTime).subscribe();
    this.saveExperimentExecution();
  }

  private saveExperimentExecution() {
    this.timeReadingDescription = this.timeService.getCurrentTime();
    this.timeService.stopTimer();
    const newExecution: ExperimentTestExecution = {
      timeReadingDescription: this.timeReadingDescription,
      openedDescAt: this.openedTestDescAt,
      userId: this.userService.currentUser()?.id,
      experimentTestId: this.experimentTestId,
      startedExecutionAt: new Date(),
      state: "INPROCESS",
    }
    this.experimentService.saveExperimentExecution(newExecution).subscribe((execution) => {
    });
  }
}
