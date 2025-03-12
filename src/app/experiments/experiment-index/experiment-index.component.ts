import {Component, inject, OnInit} from '@angular/core';
import {SearchBarComponent} from '../../search-bar/search-bar.component';
import {ExperimentService} from '../../services/experiment.service';
import {Experiment} from '../../models/experiment';
import {ExperimentComponent} from '../experiment/experiment.component';
import {NgForOf, NgIf} from '@angular/common';
import {SettingService} from '../../services/setting.service';
import {LoginService} from '../../services/login.service';
import {UserSetting} from '../../models/user-setting';
import {filter, switchMap} from 'rxjs';
import {FilterService} from '../../services/filter.service';

@Component({
  selector: 'app-experiment-index',
  imports: [SearchBarComponent, ExperimentComponent, NgForOf, NgIf],
  standalone: true,
  templateUrl: './experiment-index.component.html',
  styleUrl: './experiment-index.component.css'
})
export class ExperimentIndexComponent implements OnInit {
  title = "Experimente";
  experimentService = inject(ExperimentService);
  accountService = inject(LoginService);
  settingService = inject(SettingService);
  filterService = inject(FilterService);
  experiments: Experiment[] = [];
  filteredExperiments: Experiment[] = []
  currentUserSetting?: UserSetting;
  serverError: boolean = false;

  ngOnInit(): void {
    this.fetchExperiments();
    this.fetchCurrentUserSetting();
  }

  fetchExperiments() {
    this.experimentService.getExperiments().subscribe((experiments) => {
      this.experiments = this.sortExperimentsByPosition(experiments);
      this.filteredExperiments = experiments;
    }, error => {
      if (error){
        this.serverError = true;
      }
    });
  }

  fetchCurrentUserSetting() {
    this.accountService.user$.pipe(filter(user => !!user),
      switchMap(user =>
        this.settingService.fetchLastSetting(user.id))
    ).subscribe((setting) => {
      this.currentUserSetting = setting;

      if (this.currentUserSetting?.progressiveVisualizationExperiment) {
        this.experiments = this.experiments.filter((experiment) => {
          const pos = this.accountService.currentUser()?.currentExperimentPos ?? 0;
          return experiment.position <= pos;
        });
      }
    });
  }

  sortExperimentsByPosition(experiments: Experiment[]) {
    experiments = experiments.sort((exp1, exp2) => {
      return Number(exp1.position) - Number(exp2.position);
    });
    return experiments;
  }


  filterExperiment($event: string) {
    this.filteredExperiments = this.filterService.filterExperiments($event, this.experiments)
  }
}
