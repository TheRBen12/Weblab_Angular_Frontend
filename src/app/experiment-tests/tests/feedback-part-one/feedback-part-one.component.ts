import {Component, inject, OnInit} from '@angular/core';
import {MatFormField, MatHint, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatInput} from '@angular/material/input';
import {
  ExperimentTestInstructionComponent
} from '../../experiment-test-instruction/experiment-test-instruction.component';
import {Router} from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {ExperimentService} from '../../../services/experiment.service';
import {ExperimentTest} from '../../../models/experiment-test';
import {dateOrderValidator} from './validator';
import {RouterService} from '../../../services/router.service';
import {TimeService} from '../../../services/time.service';
import {LoginService} from '../../../services/login.service';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-feedback-part-one',
  imports: [
    MatFormField,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatInput,
    MatHint,
    MatLabel,
    MatSuffix,
    ExperimentTestInstructionComponent,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    MatCard,
    MatCardContent,
    MatProgressSpinner,
  ],
  templateUrl: './feedback-part-one.component.html',
  standalone: true,
  styleUrl: './feedback-part-one.component.css'
})
export class FeedbackPartOneComponent implements OnInit {
  instructions: string[] = [];
  experimentTest!: ExperimentTest;
  experimentService: ExperimentService = inject(ExperimentService)
  loginService: LoginService = inject(LoginService);
  routerService: RouterService = inject(RouterService);
  timeService: TimeService = inject(TimeService);
  currentInstructionStep = 6;
  router = inject(Router);
  formStep = 0;
  splitForm: boolean = true;
  loading: boolean = false;
  numberErrors: number = 0;
  execution: {
    [key: string]: any
  } = {
    'experimentTestExecutionId': null,
    'numberClicks': 0,
    'finishedExecutionAt': null,
    'numberFormValidations': 0,
    "executionTime": 0,
    "numberErrors": 0
  };
  private experimentFinished: boolean = false;

  constructor() {
    this.instructions = ["Geben sie für das Reiseziel ein: Berlin", "Geben Sie ein Ankunftsdatum und Abreisedatum ein",
      "Geben Sie Ihre Kontaktdaten an", "Geben Sie für Strasse und Hausnummer ein: Müllereckstrasse",
      "Geben Sie Ihren Wohnort an", "Geben sie für das Land ein: CH", "Geben Sie für die PLZ ein: 30654",
      "Korrigieren Sie all Fehleingaben, Entscheiden Sie selbst, wie Sie die EIngaben korrigieren"];
  }


  form = new FormGroup({
    email: new FormControl("", {
      validators: [
        Validators.email,
        Validators.required
      ], updateOn: "submit"
    }),

    name: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern('^[a-zA-ZäöüÄÖÜß]+$')
      ], updateOn: "submit"
    }),

    firstName: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern('^[a-zA-ZäöüÄÖÜß]+$')
      ], updateOn: "submit"
    }),

    street: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern('^[a-zA-ZäöüÄÖÜß ]+ \\d+[a-zA-Z]?$')
      ], updateOn: "submit"
    }),

    city: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern('^[a-zA-ZäöüÄÖÜß ]+$')
      ], updateOn: "submit"
    }),

    country: new FormControl("", {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-ZäöüÄÖÜß ]+$')
      ], updateOn: "submit"
    }),

    plz: new FormControl("", {
      validators: [
        Validators.required,
        Validators.maxLength(4),
        Validators.minLength(4),
        Validators.pattern('^[0-9]{4}$')
      ], updateOn: "submit"
    }),

    location: new FormControl("", {
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[a-zA-ZäöüÄÖÜß]+$')
      ], updateOn: "submit"
    }),

    numberAdults: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern('^[0-9]{1}$'),
        Validators.min(1),
      ], updateOn: "submit"
    }),

    numberChildren: new FormControl("", {
      validators: [
        Validators.pattern('^[0-9]{1}$')
      ], updateOn: "submit"
    }),

    arrival: new FormControl("", {
      validators: [
        Validators.required,
      ], updateOn: "submit"
    }),

    departure: new FormControl("", {
      validators: [
        Validators.required,
      ], updateOn: "submit"
    }),
    numberRooms: new FormControl(0, {
      validators: [
        Validators.required,
        Validators.min(1)
      ]
    })

  }, {validators: [dateOrderValidator]});


  get numberAdults() {
    return this.form.get('numberAdults');
  }

  get city() {
    return this.form.get('city');
  }

  get name() {
    return this.form.get('name');
  }

  get firstName() {
    return this.form.get('firstName');
  }

  get location() {
    return this.form.get('location');
  }

  get email() {
    return this.form.get('email');
  }

  get plz() {
    return this.form.get('plz');
  }

  get street() {
    return this.form.get('street');
  }

  get country() {
    return this.form.get('country');
  }

  get numberRooms() {
    return this.form.get('numberRooms');

  }

  canDeactivate() {
    if (!this.experimentFinished) {
      return confirm("Achtung Sie sind, dabei das Experiment zu verlassen. All Ihre Änderungen werden nicht gespeichert. Wollen Sie fortfahren.")
    } else {
      return true;
    }
  }


  submitForm() {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      control?.markAsTouched({onlySelf: true});
      if (control?.errors) {
        this.numberErrors++;
      }
    });
    this.execution["numberErrors"] = this.numberErrors;
    this.currentInstructionStep++;
    if (this.form.valid) {
      this.finishExperiment();
    }
    this.execution["numberFormValidations"] = this.execution["numberFormValidations"] + 1;

  }

  ngOnInit(): void {
    this.timeService.startTimer();
    const experimentTestId = this.routerService.getExperimentTestIdByUrl(this.router.url, "feedback");
    this.experimentService.getExperimentTest(experimentTestId).subscribe((experimentTest) => {
      this.experimentTest = experimentTest;
      this.splitForm = JSON.parse(experimentTest.configuration)["splitForm"];
    })
  }

  private finishExperiment() {
    this.execution["executionTime"] = this.timeService.getCurrentTime();
    this.execution["finishedExecutionAt"] = new Date();
    this.timeService.stopTimer();
    const userId = this.loginService.currentUser()?.id;
    if (userId) {
      this.experimentFinished = true;
      this.experimentService.setLastFinishedExperimentTest(this.experimentTest.id);
      this.experimentService.getExperimentExecutionByStateAndTest(userId, this.experimentTest.id, "INPROCESS").subscribe((exec) => {
        this.execution["experimentTestExecutionId"] = exec.id;
        this.loading = true;
        this.experimentService.saveFormFeedbackExperiment(this.execution).subscribe()
        setTimeout(() => {
          this.loading = false;
          this.router.navigateByUrl("/test/" + this.experimentTest.id + "/feedback");
        }, 2000)
      });
    }

  }

  increaseNumberClicks() {
    this.execution["numberClicks"] = this.execution["numberClicks"] + 1;
  }
}
