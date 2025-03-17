import {Component, inject, OnInit} from '@angular/core';
import {switchMap} from 'rxjs';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ExperimentService} from '../../services/experiment.service';
import {ExperimentTest} from '../../models/experiment-test';
import {experimentTestRoutes} from '../routes';
import {ExperimentNavigationTime} from '../../models/experiment-navigation-time';
import {D} from '@angular/cdk/keycodes';
import {TimeService} from '../../services/time.service';
import {LoginService} from '../../services/login.service';
import {SettingService} from '../../services/setting.service';
import {UserSetting} from '../../models/user-setting';

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
  private readonly route = inject(ActivatedRoute);
  experimentService = inject(ExperimentService);
  timeService: TimeService = inject(TimeService);
  userService: LoginService = inject(LoginService);
  settingService: SettingService = inject(SettingService);
  experimentTestId: number = 0;
  experimentTest: ExperimentTest | undefined
  experimentTestUrl: string = "";
  private userSetting: UserSetting | null = null;

  ngOnInit(): void {
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
    // saveNavigationTime
    const lastFinishedExperiment = this.experimentService.getLastFinishedExperimentTest();
    const reachedSiteAt = localStorage.getItem('reachedSiteAt');
    let reachedSiteDate = null;
    if (reachedSiteAt) {
      reachedSiteDate = new Date(reachedSiteAt);
    }
    const startedNavigation = lastFinishedExperiment ? lastFinishedExperiment.finishedAt : reachedSiteDate;
    const lastFinishedExperimentTestId = lastFinishedExperiment ? lastFinishedExperiment.id : null
    const navigationTime: ExperimentNavigationTime = {
      userSetting: this.userSetting,
      startedNavigation,
      endedNavigation: new Date(),
      fromExperimentId: lastFinishedExperimentTestId,
      toExperimentId: this.experimentTestId
    }
    this.timeService.saveNavigationTime(navigationTime);
  }

}
