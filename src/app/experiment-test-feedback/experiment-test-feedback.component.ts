import {Component, inject, OnInit} from '@angular/core';
import {ExperimentTest} from '../models/experiment-test';
import {NgForOf} from '@angular/common';
import {RadioButtonComponent} from '../radio-button/radio-button.component';
import {ExperimentService} from '../services/experiment.service';
import {switchMap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ExperimentFeedback} from '../models/experiment-feedback';
import {FormsModule} from '@angular/forms';
import {LoginService} from '../services/login.service';

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
  experimentTest!: ExperimentTest
  experimentService: ExperimentService = inject(ExperimentService);
  route: ActivatedRoute = inject(ActivatedRoute);
  loginService: LoginService = inject(LoginService);
  router: Router = inject(Router);
  protected readonly String = String;

  feedback: ExperimentFeedback = {
    cognitiveStress: 0,
    consistency: 0,
    learnability: 0,
    structure: 0,
    text: '',
    mentalModel: 0,
    experimentTestId: 0,
    userId: 0,
  }

  questions: string[] = ["Erforderte das Durchführen des Experimentes viel Mühe, Anstrengung oder Konzentration?",
    "Entsprach die Schnittstelle Ihrem mentalen Modell, d.h. funktionierte die Schnittstelle so, wie Sie dies erwartet haben und so wie Sie dies von anderen Schnittstellen her bereits kennen?",
    "War die Funktionsweise der Schnittstelle klar und verständlich?", "War die Funktionsweise der Schnittstelle einfach erkennbar und erlernabar?",
    "Waren der Aufbau, Abfolgen und die Funktionsweise der Schnittstelle konsistent, d.h. befolgte die Schnittstelle Muster und wurden diese Muster über die gesamte Interaktion hinweg beigehalten?"];



  clickedRoutes: { [key: string]: string } = {};


  questionLabels: {[key: number]: string[]} = {0: ["sehr gering", "gering",  "mittel" ,"hoch", "sehr hoch"], 1: ["sehr gering", "gering",  "mittel" ,"hoch", "sehr hoch"],
  2: ["kaum verständlich", "gering verständlich", "einigermassen verständlich", "gut verständlich", "sehr vertsändlich"],
  3: ["sehr schwierig", "schwierig", "einigermassen einfach", "einfach", "sehr einfach"],
  4: ["kaum konsistent", "wenig konsistent", "einigermassen konsistent", "gute Konsistenz", "sehr konsistent"]};

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


  updateFeedback(value: number, identifier: string) {
    this.feedback[identifier] = value;
  }
  submitFeedback(){
   const userId =  this.loginService.currentUser()?.id;
    if (userId){
      this.feedback.userId = userId
      this.feedback.experimentTestId = this.experimentTest.id;
      this.experimentService.submitFeedback(this.feedback).subscribe();
      this.router.navigateByUrl("test/"+this.experimentTest?.experiment?.id);
    }

  }

  updateText(value: string) {
    this.feedback.text = value;
  }
}
