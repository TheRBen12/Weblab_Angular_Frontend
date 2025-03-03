import {Component, inject, OnInit} from '@angular/core';
import {switchMap} from 'rxjs';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ExperimentService} from '../../services/experiment.service';
import {ExperimentTest} from '../../models/experiment-test';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-experiment-test-detail',
  imports: [
    RouterLink,
    NgIf
  ],
  standalone: true,
  templateUrl: './experiment-test-detail.component.html',
  styleUrl: './experiment-test-detail.component.css'
})
export class ExperimentTestDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  experimentTestId: number = 0;
  experimentService = inject(ExperimentService);
  experimentTest: ExperimentTest | undefined

  ngOnInit(): void {

    this.route.paramMap.pipe(
      switchMap(params => {
        this.experimentTestId = Number(params.get('testId'));
        return this.experimentService.getExperimentTest(this.experimentTestId);
      })
    ).subscribe(test => {
      this.experimentTest = test;
    });
  }

}
