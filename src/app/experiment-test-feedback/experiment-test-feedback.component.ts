import {Component, inject, OnInit} from '@angular/core';
import {ExperimentTest} from '../models/experiment-test';
import {NgForOf} from '@angular/common';
import {RadioButtonComponent} from '../radio-button/radio-button.component';
import {ExperimentService} from '../services/experiment.service';
import {switchMap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ExperimentFeedback} from '../models/experiment-feedback';
import {FormControl, FormGroup, FormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-experiment-test-feedback',
  imports: [
    NgForOf,
    RadioButtonComponent,
    FormsModule
  ],
  templateUrl: './experiment-test-feedback.component.html',
  standalone: true,
  styleUrl: './experiment-test-feedback.component.css'
})
export class ExperimentTestFeedbackComponent implements OnInit{
  experimentTest?: ExperimentTest
  experimentService: ExperimentService = inject(ExperimentService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  feedback: ExperimentFeedback = {
    cognitiveStress: 0,

    consistency: 0,
    learnability: 0,
    structure: 0,
    text: '',
    mentalModel: 0,

  }
  questions: string[] = ["Wie hoch war die kognitive Belastung, um das Experiment abzuschliessen?",
    "Entsprach die Webseite Ihrem mentalen Modell, d,h. funktionierte die Schnittstelle so, wie Sie dies erwartet haben?",
    "War die Funktionsweise der Schnittstelle klar und verständlich?", "War die Funktionsweise der Schnittstelle einfach erkennbar und erlernabar?",
    "War der Aufbau und die Funktionsweise der Schnittstelle konsistent?"];

  questionValues: string[] = ["1) sehr gering, 2) gering, 3) mittel, 4) hoch, 5) sehr hoch",
    "1) sehr gering, 2) gering, 3) mittel, 4) hoch, 5) sehr hoch", "1) kaum verständlich, 2) gering verständlich, 3) einigermassen verständlich, 4) gut verständlich 5) sehr vertsändlich",
    "1) sehr schwierig, 2) schwierig, 3) einigermassen einfach, 4) einfach, 5) sehr einfach",
    "1) kaum konsistent, 2) gering konsistent, 3) einigermassen konsistent, 4) gute Konsistenz, 5) sehr konsistent"];

  identifier = ["cognitiveStress", "mentalModel", "understandable", "learnability", "consistency"];

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const experimentTestId = Number(params.get('id'));
        return this.experimentService.getExperimentTest(experimentTestId);
      })).subscribe((test) => {
        this.experimentTest = test;
    })
  }

  protected readonly String = String;

  updateFeedback(value: number, identifier: string) {
    this.feedback[identifier] = value;
  }
  submitFeedback(){
    this.experimentService.submitFeedback(this.feedback);
    this.router.navigateByUrl("test/"+this.experimentTest?.experiment?.id);
  }

  updateText(value: string) {
    this.feedback.text = value;
  }
}
