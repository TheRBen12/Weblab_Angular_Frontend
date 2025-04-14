import {Component, inject, OnInit} from '@angular/core';
import {ExperimentService} from '../../services/experiment.service';
import {ExperimentTest} from '../../models/experiment-test';
import {ExperimentComponent} from '../../experiments/experiment/experiment.component';
import {NgForOf, NgIf} from '@angular/common';
import {SearchBarComponent} from '../../search-bar/search-bar.component';
import {ExperimentTestComponent} from '../experiment-test/experiment-test.component';

@Component({
  selector: 'app-experiment-test-list',
  imports: [
    ExperimentComponent,
    NgForOf,
    NgIf,
    SearchBarComponent,
    ExperimentTestComponent
  ],
  templateUrl: './experiment-test-list.component.html',
  standalone: true,
  styleUrl: './experiment-test-list.component.css'
})
export class ExperimentTestListComponent implements OnInit{
  experimentService: ExperimentService = inject(ExperimentService);
  experimentTests: ExperimentTest[] = [];

  title: string = "Versuchsexperimente";
  serverError: boolean;
  navigationSetting: any;
  finishedExperimentTests: any;
  finishedExecutions: any;
  filteredExperimentTests: ExperimentTest[] = [];
  currentUserSetting: any;
  ngOnInit(): void {
    this.fetchExperimentTests();

  }

  private fetchExperimentTests() {
    this.experimentService.getExperimentTests().subscribe((tests) => {
      this.experimentTests = tests;
    });
  }

  updateUserBehaviour() {

  }

  filterExperimentTests($event: string) {

  }

  saveExperimentTestSelectionTime($event: ExperimentTest) {

  }
}
