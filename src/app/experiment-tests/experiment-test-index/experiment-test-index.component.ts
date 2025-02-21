import {Component, ElementRef, inject, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {switchMap} from 'rxjs';
import {ExperimentTest} from '../../models/experiment-test';
import {ExperimentService} from '../../services/experiment.service';
import {NgForOf, NgIf} from '@angular/common';
import {ExperimentTestComponent} from '../experiment-test/experiment-test.component';
import {SearchBarComponent} from '../../search-bar/search-bar.component';
import {Experiment} from '../../models/experiment';

@Component({
  selector: 'app-experiment-test-index',
  imports: [
    NgForOf,
    NgIf,
    ExperimentTestComponent,
    SearchBarComponent,
    RouterLink
  ],
  standalone: true,
  templateUrl: './experiment-test-index.component.html',
  styleUrl: './experiment-test-index.component.css'
})
export class ExperimentTestIndexComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  experimentService = inject(ExperimentService);
  experimentId: number = 0;
  experimentTests: ExperimentTest[] = [];
  filteredExperimentTests: ExperimentTest[] = [];
  experiment: Experiment | null = null;
  markedText: string = "";


  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.experimentId = Number(params.get('expId'));
        this.fetchExperiment()
        return this.experimentService.getExperimentTestsByExperiment(this.experimentId);
      })
    ).subscribe(tests => {
      this.experimentTests = tests;
      this.filteredExperimentTests = this.experimentTests;
    });
  }

  fetchExperiment() {
    this.experimentService.getExperiment(this.experimentId).subscribe((experiment) => {
      this.experiment = experiment;
    })
  }

  setExperiments($event: any[]) {
    this.filteredExperimentTests = $event;
  }

  markText($event: string) {
    this.markedText = $event;
  }
}
