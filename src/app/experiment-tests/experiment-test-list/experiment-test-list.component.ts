import {Component, inject, OnInit} from '@angular/core';
import {ExperimentService} from '../../services/experiment.service';
import {ExperimentTest} from '../../models/experiment-test';
import {ExperimentComponent} from '../../experiments/experiment/experiment.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {SearchBarComponent} from '../../search-bar/search-bar.component';
import {ExperimentTestComponent} from '../experiment-test/experiment-test.component';
import {LoginService} from '../../services/login.service';
import {FilterService} from '../../services/filter.service';

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
export class ExperimentTestListComponent implements OnInit{
  experimentService: ExperimentService = inject(ExperimentService);
  experimentTests: ExperimentTest[] = [];
  loginService: LoginService = inject(LoginService);
  filterService: FilterService = inject(FilterService);

  title: string = "Versuchsexperimente";
  serverError: boolean = false;
  navigationSetting: any;
  finishedExperimentTests: any;
  finishedExecutions: any;
  filteredExperimentTests: ExperimentTest[] = [];
  currentUserSetting: any;
  currentUserId?: number|null = null;
  markedText: string = "";
  ngOnInit(): void {

    this.fetchExperimentTests();

    this.currentUserId = this.loginService.currentUser()?.id;
    if (this.currentUserId){
      this.fetchFinishedExecutions(this.currentUserId, "FINISHED").subscribe((finishedExecutions) => {
        this.finishedExecutions = finishedExecutions;
      });
    }
  }

  private fetchExperimentTests() {
    this.experimentService.getExperimentTests().subscribe((tests) => {
      this.filteredExperimentTests = tests;
      this.experimentTests = tests;
    }, (error) => {
      if (error){
        this.serverError = true;
      }
    });
  }

  updateUserBehaviour() {

  }

  filterExperimentTests($event: string) {
    this.markedText = $event;
    this.filteredExperimentTests = this.filterService.filterExperimentTests($event, this.experimentTests);
    this.filteredExperimentTests = this.filterService.filterExperimentTests($event,this.experimentTests);
  }

  saveExperimentTestSelectionTime($event: ExperimentTest) {

  }


  private fetchFinishedExecutions(userId: number, state: string) {
    return this.experimentService.getExperimentExecutionByState(userId, state);
  }

}
