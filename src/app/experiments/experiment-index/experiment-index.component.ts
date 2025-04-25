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
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {ExperimentTestExecution} from '../../models/experiment-test-execution';
import {NavigationSetting} from '../../models/navigation-setting';
import {TimeService} from '../../services/time.service';
import {ExperimentSelectionTime} from '../../models/experiment-selection-time';
import {MatDialog} from '@angular/material/dialog';
import {SettingHintDialogComponent} from '../../setting-hint-dialog/setting-hint-dialog.component';

@Component({
  selector: 'app-experiment-index',
  imports: [SearchBarComponent, ExperimentComponent, NgForOf, NgIf, NgClass],
  standalone: true,
  templateUrl: './experiment-index.component.html',
  styleUrl: './experiment-index.component.css'
})
export class ExperimentIndexComponent implements OnInit {
  title = "Experimente";
  timeService: TimeService = inject(TimeService);
  experimentService = inject(ExperimentService);
  settingService = inject(SettingService);
  filterService = inject(FilterService);
  experiments: Experiment[] = [];
  filteredExperiments: Experiment[] = []
  currentUserSetting?: UserSetting;
  serverError: boolean = false;
  router: Router = inject(Router);
  finishedExperiments: Experiment[] = [];
  finishedExecutions: ExperimentTestExecution[] = [];
  protected navigationSetting?: NavigationSetting;
  userId: number = 0;

  constructor(public readonly accountService: LoginService, private dialog: MatDialog) {

    effect(() => {
      const userId = this.accountService.currentUser()?.id;
      if (userId) {
        this.userId = userId;
        this.settingService.fetchNavigationSetting(this.userId).subscribe((setting) => {
          this.navigationSetting = setting;
        }, (error) => {
          console.log(error);
        });
        this.fetchFinishedExecutions(this.userId, "FINISHED").subscribe((executions) => {
          if (executions.length > 0) {
            this.finishedExecutions = executions;
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => (event instanceof NavigationEnd)))
      .subscribe((sub) => {
        if ( this.router.url.includes("/tests/detail")) {
          this.timeService.stopTimer();
        }
      });


    if (!localStorage.getItem('reachedSiteAt')) {
      localStorage.setItem("reachedSiteAt", String(new Date()));
    }
    this.fetchExperiments();
    this.fetchCurrentUserSetting();
    this.timeService.stopTimer();
    this.timeService.startTimer();

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

      const userId = setting.userID;
      //fetch executions
      this.fetchFinishedExecutions(userId, "FINISHED").subscribe((executions) => {
        this.finishedExecutions = executions;

        // extract finishedExperiments
        this.findFinishedExperiments(this.finishedExecutions);

        // remove duplicate experiments
        const finishedExperiments = this.filteredExperiments.filter((experiment) => {
          const finishedExperimentIds = this.finishedExperiments?.map(exp => exp.id);
          return finishedExperimentIds?.indexOf(experiment.id) != -1;
        });

        // extract non-finished experiments
        const nonFinishedExperiments = this.filteredExperiments.filter((exp) => {
          const finishedExperiments = this.finishedExperiments?.map(exp => exp.id);
          return finishedExperiments?.indexOf(exp.id) == -1;
        });

        if (this.currentUserSetting?.progressiveVisualizationExperiment) {
          // Find experiment with minimal position
          const expPosValues = nonFinishedExperiments.reduce((min, exp, index) =>
              exp.position < min.value.position ? {value: exp, index} : min
            , {value: nonFinishedExperiments[0], index: 0});

          const expWithMinPos = expPosValues.value;
          this.filteredExperiments = [...finishedExperiments].concat([expWithMinPos]);
        }
        if (finishedExperiments.length == 3 && !this.currentUserSetting?.progressiveVisualizationExperiment &&
          !localStorage.getItem('closedSettingHint')) {
          this.displaySettingsHing();
        }

      });

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
      let finishedExecutionTestIds = finishedExecutions.map(exec => exec.experimentTest?.id);
      finishedExecutionTestIds = Array.from(new Set(finishedExecutionTestIds));
      if (finishedExecutionTestIds.length == experiment.numberExperimentTest) {
        this.finishedExperiments?.push(experiment);
      }
    });
  }

  saveExperimentSelectionTime(experiment: Experiment) {
    const selectionTime = this.timeService.getCurrentTime();
    this.timeService.stopTimer();
    const experimentSelectionTime: ExperimentSelectionTime = {
      experimentId: experiment.id,
      time: selectionTime,
      userId: this.userId,
      settingId: this.currentUserSetting?.id
    };
    this.experimentService.saveExperimentSelectionTime(experimentSelectionTime).subscribe();
  }

  private displaySettingsHing() {
    this.openDialog()
  }

  openDialog() {
    const dialogRef = this.dialog.open(SettingHintDialogComponent, {
        disableClose: true,
      }
    );
  }

  updateUserBehaviour() {
    localStorage.setItem("used_search_bar_for_tests", "true");
  }
}
