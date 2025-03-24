import {ChangeDetectorRef, Component, effect, inject, OnInit} from '@angular/core';
import {SearchBarComponent} from '../../search-bar/search-bar.component';
import {ExperimentService} from '../../services/experiment.service';
import {Experiment} from '../../models/experiment';
import {ExperimentComponent} from '../experiment/experiment.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {SettingService} from '../../services/setting.service';
import {LoginService} from '../../services/login.service';
import {UserSetting} from '../../models/user-setting';
import {filter, switchMap} from 'rxjs';
import {FilterService} from '../../services/filter.service';
import {Router} from '@angular/router';
import {ExperimentTestExecution} from '../../models/experiment-test-execution';
import {NavigationSetting} from '../../models/navigation-setting';

@Component({
  selector: 'app-experiment-index',
  imports: [SearchBarComponent, ExperimentComponent, NgForOf, NgIf, NgClass],
  standalone: true,
  templateUrl: './experiment-index.component.html',
  styleUrl: './experiment-index.component.css'
})
export class ExperimentIndexComponent implements OnInit {
  title = "Experimente";
  experimentService = inject(ExperimentService);
  settingService = inject(SettingService);
  filterService = inject(FilterService);
  experiments: Experiment[] = [];
  filteredExperiments: Experiment[] = []
  currentUserSetting?: UserSetting;
  serverError: boolean = false;
  router: Router = inject(Router);
  finishedExperiments: Experiment[] | null = [];
  finishedExecutions: ExperimentTestExecution[] = [];
  numberFinishedTestsForExperiments: number[] = [];
  protected navigationSetting!: NavigationSetting;

  constructor(public readonly accountService: LoginService, private cdrf: ChangeDetectorRef) {

    effect(() => {
      const userId = this.accountService.currentUser()?.id;
      if (userId) {
        this.settingService.fetchNavigationSetting(userId).subscribe((setting) => {
          this.navigationSetting = setting;
        })
        this.fetchFinishedExecutions(userId, "FINISHED").subscribe((executions) => {
          if (executions.length > 0) {
            this.finishedExecutions = executions;
          }
        });
      }
    });
  }

  ngOnInit(): void {
    if (!localStorage.getItem('reachedSiteAt')) {
      localStorage.setItem("reachedSiteAt", String(new Date()));
    }
    this.fetchExperiments();
    this.fetchCurrentUserSetting();

  }


  updateUserBehaviour() {
  }

  fetchExperiments() {
    this.experimentService.getExperiments().subscribe((experiments) => {
      this.experiments = this.sortExperimentsByPosition(experiments);
      this.filteredExperiments = experiments;
    }, error => {
      if (error) {
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
        const userId = setting.userID;
          //fetch executions
          this.fetchFinishedExecutions(userId, "FINISHED").subscribe((executions) => {

              this.finishedExecutions = executions;
              // extract exp with min pos
              this.findFinishedExperiments(this.finishedExecutions);

              // extract finished experiments
              const finishedExperiments = this.filteredExperiments.filter((experiment) => {
                const finishedExperimentIds = this.finishedExperiments?.map(exp => exp.id);
                return finishedExperimentIds?.indexOf(experiment.id) != -1;
              });

              // extract non-finished experiments
              const nonFinishedExperiments = this.filteredExperiments.filter((exp) => {
                const finishedExperiments = this.finishedExperiments?.map(exp => exp.id);
                return finishedExperiments?.indexOf(exp.id) == -1;
              });
              // Find experiment with minimal position
              const expPosValues = nonFinishedExperiments.reduce((min, exp, index) =>
                  exp.position < min.value.position ? {value: exp, index} : min
                , {value: nonFinishedExperiments[0], index: 0});

              const expWithMinPos = expPosValues.value;
              this.filteredExperiments = [...finishedExperiments].concat([expWithMinPos]);

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

  private fetchFinishedExecutions(userId: number, state: string) {
    return this.experimentService.getExperimentExecutionByState(userId, state);
  }

  private findFinishedExperiments(executions: ExperimentTestExecution[]) {
    this.experiments.forEach((experiment) => {
      const finishedExecutions = executions.filter(execution => execution.experimentTest?.experiment?.id == experiment.id)
      if (finishedExecutions.length == experiment.numberExperimentTest) {
        this.finishedExperiments?.push(experiment);
      }
    });
  }
}
