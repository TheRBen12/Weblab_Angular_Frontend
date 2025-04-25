import {Component, inject, OnInit} from '@angular/core';
import {ExperimentTest} from '../models/experiment-test';
import {NgForOf, NgIf} from '@angular/common';
import {RadioButtonComponent} from '../radio-button/radio-button.component';
import {ExperimentService} from '../services/experiment.service';
import {switchMap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ExperimentFeedback} from '../models/experiment-feedback';
import {FormsModule} from '@angular/forms';
import {LoginService} from '../services/login.service';
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {RouterService} from '../services/router.service';

@Component({
  selector: 'app-experiment-test-feedback',
  imports: [
    NgForOf,
    RadioButtonComponent,
    FormsModule,
    MatCard,
    MatCardContent,
    MatProgressSpinner,
    NgIf
  ],
  templateUrl: './experiment-test-feedback.component.html',
  standalone: true,
  styleUrl: './experiment-test-feedback.component.css'
})
export class ExperimentTestFeedbackComponent implements OnInit {
  experimentTest!: ExperimentTest
  experimentService: ExperimentService = inject(ExperimentService);
  route: ActivatedRoute = inject(ActivatedRoute);
  loginService: LoginService = inject(LoginService);
  router: Router = inject(Router);
  loading: boolean = false;
  protected readonly String = String;

  feedback: ExperimentFeedback = {
    cognitiveStress: 0,
    consistency: 0,
    learnability: 0,
    understandable: 0,
    text: '',
    mentalModel: 0,
    experimentTestId: 0,
    userId: 0,
  }

  questions: string[] = ["Erforderte das Durchführen des Experimentes viel Mühe, Anstrengung, Aufmerksamkeit oder Konzentration?",
    "Entsprach die grafische Oberfläche, welche Sie gerade eben benutzten Ihrem mentalen Modell, d.h. funktionierte die Oberfläche so, wie Sie dies erwartet haben und so, wie Sie dies von anderen Webseiten her bereits kennen?",
    "War die Funktionsweise der grafischen Oberfläche klar und verständlich?", "War die Funktionsweise der Schnittstelle einfach erkennbar, einprägsam und erlernabar?",
    "Waren der Aufbau, Abfolgen und die Funktionsweise der Schnittstelle konsistent, d.h. befolgte die Schnittstelle Muster und wurden diese Muster über die gesamte Interaktion hinweg beigehalten?"];


  clickedRoutes: { [key: string]: string } = {};


  questionLabels: { [key: number]: string[] } = {
    0: ["sehr gering", "gering", "mittel", "hoch", "sehr hoch"],
    1: ["sehr gering", "gering", "mittel", "hoch", "sehr hoch"],
    2: ["kaum verständlich", "gering verständlich", "einigermassen verständlich", "gut verständlich", "sehr vertsändlich"],
    3: ["sehr schwierig", "schwierig", "einigermassen einfach", "einfach", "sehr einfach"],
    4: ["kaum konsistent", "wenig konsistent", "einigermassen konsistent", "gute Konsistenz", "sehr konsistent"]
  };

  identifier = ["cognitiveStress", "mentalModel", "understandable", "learnability", "consistency"];
  private routerService: RouterService = inject(RouterService);

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

  submitFeedback() {
    this.routerService.clearNumberNavigationClicks();
    const userId = this.loginService.currentUser()?.id;
    if (userId) {
      this.loading = true;
      this.feedback.userId = userId
      this.feedback.experimentTestId = this.experimentTest.id;
      this.experimentService.submitFeedback(this.feedback).subscribe((feedback) => {
        setTimeout(() => {
          localStorage.setItem("recentlySubmittedFeedbackForm", "true");
          this.loading = false;
          this.router.navigateByUrl("tests/" + this.experimentTest?.experiment?.id);
        }, 1500);
      });
    }
  }

  updateText(value: string) {
    this.feedback.text = value;
  }
}
