import {Component, inject, OnInit} from '@angular/core';
import {SearchBarComponent} from '../../search-bar/search-bar.component';
import {ExperimentService} from '../../services/experiment.service';
import {Experiment} from '../../models/experiment';
import {ExperimentComponent} from '../experiment/experiment.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-experiment-index',
  imports: [SearchBarComponent, ExperimentComponent, NgForOf],
  standalone: true,
  templateUrl: './experiment-index.component.html',
  styleUrl: './experiment-index.component.css'
})
export class ExperimentIndexComponent implements OnInit{
  title = "Experimente";
  experimentService = inject(ExperimentService);
  experiments: Experiment[] = [];

  ngOnInit(): void {
    this.fetchExperiments();
  }
  fetchExperiments() {
    this.experimentService.getExperiments().subscribe((experiments) => {
      this.experiments = experiments
    })
  }

}
