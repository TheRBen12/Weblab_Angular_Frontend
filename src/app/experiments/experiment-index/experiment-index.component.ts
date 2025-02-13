import {Component, inject, OnInit} from '@angular/core';
import {SearchBarComponent} from '../../search-bar/search-bar.component';
import {ExperimentService} from '../../services/experiment.service';
import {Experiment} from '../../models/experiment';
import {ExperimentComponent} from '../experiment/experiment.component';
import {NgForOf} from '@angular/common';
import {SettingService} from '../../services/setting.service';
import {LoginService} from '../../services/login.service';
import {UserSetting} from '../../models/user-setting';
import {filter, switchMap} from 'rxjs';

@Component({
  selector: 'app-experiment-index',
  imports: [SearchBarComponent, ExperimentComponent, NgForOf],
  standalone: true,
  templateUrl: './experiment-index.component.html',
  styleUrl: './experiment-index.component.css'
})
export class ExperimentIndexComponent implements OnInit {
  title = "Experimente";
  experimentService = inject(ExperimentService);
  accountService = inject(LoginService);
  settingService = inject(SettingService);
  experiments: Experiment[] = [];
  currentUserSetting?: UserSetting;

  ngOnInit(): void {
    this.fetchExperiments();
    this.fetchCurrentUserSetting();
  }

  fetchExperiments() {
    this.experimentService.getExperiments().subscribe((experiments) => {
      this.experiments = this.sortExperimentsByPosition(experiments);
    });
  }

  fetchCurrentUserSetting() {
    this.accountService.user$.pipe(filter(user => !!user),
      switchMap(user =>
        this.settingService.fetchLastSetting(user.id))
    ).subscribe((setting) => {
      this.currentUserSetting = setting;
    });
  }

  sortExperimentsByPosition(experiments: Experiment[]) {
    experiments = experiments.sort((exp1, exp2) => {
      return Number(exp1.position) - Number(exp2.position);
    });
    return experiments;
  }

}
