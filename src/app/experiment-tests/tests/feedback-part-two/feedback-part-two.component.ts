import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {dateOrderValidator} from '../feedback-part-one/validator';
import {
  ExperimentTestInstructionComponent
} from '../../experiment-test-instruction/experiment-test-instruction.component';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatFormField, MatHint, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {NgClass, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {ExperimentTest} from '../../../models/experiment-test';
import {ExperimentService} from '../../../services/experiment.service';
import {MatCard, MatCardContent} from '@angular/material/card';
import {TimeService} from '../../../services/time.service';
import {LoginService} from '../../../services/login.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-feedback-part-two',
  imports: [
    ExperimentTestInstructionComponent,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatHint,
    MatInput,
    MatLabel,
    MatSuffix,
    NgIf,
    ReactiveFormsModule,
    NgClass,
    MatCard,
    MatCardContent,
    MatProgressSpinner
  ],
  templateUrl: './feedback-part-two.component.html',
  standalone: true,
  styleUrl: './feedback-part-two.component.css'
})
export class FeedbackPartTwoComponent implements OnInit {
  protected currentInstructionStep: number = 1;
  splitForm: any;
  formStep: number = 0;
  router = inject(Router);
  experimentTest!: ExperimentTest;
  experimentService: ExperimentService = inject(ExperimentService)
  timeService: TimeService = inject(TimeService);
  loginService: LoginService = inject(LoginService);
  offset = 0;
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

  instructions = ["Geben sie für den Zielort ein: Madrid", "Geben Sie ein Ankunftsdatum und Abreisedatum ein",
    "Geben Sie Ihre Kontaktdaten an", "Geben Sie für die Strasse und Hausnummer ein: Engestrasse",
    "Geben Sie Ihren Wohnort an", "Geben sie für das Land ein: CH", "Geben Sie für die PLZ ein: 3011", "Treffen Sie eine Auswahl für die Persoen, welche mitreisen."];

  constructor(private readonly toasterService: ToastrService) {
  }

  form = new FormGroup({

    location: new FormControl("", {
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[a-zA-ZäöüÄÖÜß]+$')
      ],
    }),


    arrival: new FormControl("", {
      validators: [
        Validators.required,
      ],
    }),

    departure: new FormControl("", {
      validators: [
        Validators.required,
      ]
    }),

    numberRooms: new FormControl(0, {
      validators: [
        Validators.required,
        Validators.min(1)
      ]
    }),

    email: new FormControl("", {
      validators: [
        Validators.email,
        Validators.required
      ]
    }),

    name: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern('^[a-zA-ZäöüÄÖÜß]+$')
      ]
    }),

    firstName: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern('^[a-zA-ZäöüÄÖÜß]+$')
      ]
    }),

    street: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern('^[a-zA-ZäöüÄÖÜß ]+ \\d+[a-zA-Z]?$')
      ]
    }),

    city: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern('^[a-zA-ZäöüÄÖÜß ]+$')
      ],
    }),

    country: new FormControl("", {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-ZäöüÄÖÜß ]+$')
      ]
    }),

    plz: new FormControl("", {
      validators: [
        Validators.required,
        Validators.maxLength(4),
        Validators.minLength(4),
        Validators.pattern('^[0-9]{4}$')
      ]
    }),


    numberAdults: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern('^[0-9]{1}$'),
        Validators.min(1),
      ]
    }),

    numberChildren: new FormControl("", {
      validators: [
        Validators.pattern('^[0-9]{1}$')
      ]
    }),


  }, {validators: [dateOrderValidator]});
  private submit: boolean = false;


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


  submitForm() {
    if (this.formStep == 3 && this.submit){
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
      });
      this.currentInstructionStep++;
      if (this.form.valid) {
        this.finishExperiment();
      }
      this.execution["numberFormValidations"] = this.execution["numberFormValidations"] + 1;
    }
  }

  ngOnInit(): void {
    this.timeService.startTimer();
    const urlSegments = this.router.url.split("/");
    const index = urlSegments.indexOf("feedback") + 1;
    const experimentTestId = Number(urlSegments[index]);
    this.experimentService.getExperimentTest(experimentTestId).subscribe((experimentTest) => {
      this.experimentTest = experimentTest;
      this.splitForm = JSON.parse(experimentTest.configuration)["splitForm"];
    })
  }

  private finishExperiment() {
    this.execution["executionTime"] = this.timeService.getCurrentTime();
    this.execution["finishedExecutionAt"] = new Date();
    this.execution["numberErrors"] = this.numberErrors;
    this.timeService.stopTimer();
    const userId = this.loginService.currentUser()?.id;
    if (userId){
      this.experimentService.setLastFinishedExperimentTest(this.experimentTest.id);
      this.experimentService.getExperimentExecutionByStateAndTest(userId, this.experimentTest.id, "INPROCESS").subscribe((exec) => {
        this.execution["experimentTestExecutionId"] = exec.id;
        this.loading = true;
        this.experimentService.saveFormFeedbackExperiment(this.execution).subscribe()
        setTimeout(() => {
          this.toasterService.success("Vielen Dank, Sie haben das Experiment erfolgreich abgeschlossen")
          this.loading = false;
          this.router.navigateByUrl("/test/"+this.experimentTest.id+"/feedback");
        }, 2000)
      });
    }

  }

  increaseNumberClicks() {
    this.execution["numberClicks"] = this.execution["numberClicks"] + 1;
  }

  clearErrors() {
    console.log(Object.keys(this.form.controls));
    Object.keys(this.form.controls).forEach((key: string, index: number) => {
      const control = this.form.get(key) as FormControl;
      if (index > this.offset){
        control.setErrors(null);
      }
    });

  }

  checkInputForCurrentFormStep() {
    const keys = Object.keys(this.form.controls);
    const key = keys[0];
    let start = 0
    let end = 0;
    if (this.formStep == 0) {
      this.offset = 3;
      start = 0;
      end = 3;
    }else if (this.formStep == 1){
      this.offset = 7;
      start = 4;
      end = 6;
    }else if (this.formStep == 2){
      this.offset = 10
      start = 7;
      end = 10;
    }
    let increaseFormStep = true;

    Object.keys(this.form.controls).forEach((key: string, index: number) => {
      const control = this.form.get(key) as FormControl;
      if ((index <= end && index >= start)){
        control?.markAsTouched({onlySelf: true});
      }
      if (control.errors && (index <= end && index >= start)) {
        increaseFormStep = false;
        this.numberErrors = this.numberErrors + 1;
      }
    });
    this.clearErrors();
    if (increaseFormStep) {
      this.execution["numberFormValidations"] = this.execution["numberFormValidations"] + 1;
      this.formStep++;
      if (this.formStep == 2){
        this.currentInstructionStep = 6
      }else{
        this.currentInstructionStep++;
      }
    }
  }

  back() {
    this.formStep--;
  }

  sendForm() {
    this.submit = true;
  }
}
