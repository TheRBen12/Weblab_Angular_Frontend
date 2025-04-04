import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {
  ExperimentTestInstructionComponent
} from '../../experiment-test-instruction/experiment-test-instruction.component';
import {NgIf} from '@angular/common';
import {EmailMenuComponent} from '../email-menu/email-menu.component';
import {ExperimentService} from '../../../services/experiment.service';
import {EmailService} from '../../../services/email.service';
import {Email} from '../../../models/email';
import {LoginService} from '../../../services/login.service';
import {ToastrService} from 'ngx-toastr';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {TimeService} from '../../../services/time.service';

@Component({
  selector: 'app-error-correction',
  imports: [
    RouterOutlet,
    ExperimentTestInstructionComponent,
    EmailMenuComponent,
    NgIf,
    MatCard,
    MatCardContent,
    MatProgressSpinner,
  ],
  templateUrl: './error-correction.component.html',
  standalone: true,
  styleUrl: './error-correction.component.css'
})
export class ErrorCorrectionComponent implements OnInit {
  router: Router = inject(Router);
  experimentService = inject(ExperimentService);
  emailService = inject(EmailService);
  userService: LoginService = inject(LoginService);
  timeService: TimeService = inject(TimeService);
  emailToDelete: number = 0;
  instructions: string[] = [];
  currentInstructionStep = 0;
  targetInstruction: string = "";
  mailWasDeleted = false;
  deletedMail: Email | null = null;
  execution: { [key: string]: any } = {};
  loading: boolean = false;
  private experimentId!: number;
  private firstClick: string|null = null;
  private deletedPos: number = -2;

  constructor(private readonly toasterService: ToastrService) {
  }


  ngOnInit(): void {
    this.timeService.startTimer();
    this.execution["numberClicks"] = 0;
    this.execution["failedClicks"] = 0;
    this.execution["clickedOnDeletedItems"] = false;
    this.emailService.getUndoEventSubscription().subscribe((emailIndex) => {
      if (emailIndex) {
        this.execution["timeToClickUndo"] = this.timeService.getCurrentTime();
        this.execution['clickedOnUndo'] = true;
        this.timeService.stopTimer();
      }
    })
    this.emailService.getDeletedMailSubscripition().subscribe((data) => {
      if (data) {
        this.deletedMail = data.mail??null;
        this.deletedPos = data.position;
        this.mailWasDeleted = true;
        this.currentInstructionStep++;
      }
    });

    this.emailToDelete = Math.floor(Math.random() * 10) + 1;

    this.instructions = ["Löschen Sie die " + this.emailToDelete + ". " + "E-Mail", "Geben Sie in das Eingabefeld ein, wann die gelöschte E-Mail erhalten worden ist. " +
    "Tipp: Das Datum wann die E-Mail erhalten wurde befindet sich am rechten Rand der E-Mails"];

    const urlSegments = this.router.url.split("/");
    const index = urlSegments.indexOf("error-correction") + 1
    this.experimentId = Number(urlSegments[index]);

    this.fetchExperimentTest(this.experimentId);

  }

  private fetchExperimentTest(experimentId: number) {

    this.experimentService.getExperimentTest(experimentId).subscribe((experimentTest) => {
      this.targetInstruction = experimentTest.goalInstruction
      const config = JSON.parse(experimentTest.configuration);
      this.execution['undoSnackBarPosition'] = config["horizontalPosition"] + " " + config["verticalPosition"];
    });
  }

  checkInput(value: string) {

    const regex = /^(20[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (regex.test(value)) {
      if (this.deletedMail && this.deletedMail.date == value && this.emailToDelete == this.deletedPos+1) {
        this.execution['correctInput'] = true;
      }else{
        this.execution['correctInput'] = false;
      }
      this.finishExperiment();
    }
  }

  finishExperiment() {
    this.execution['taskSuccess'] = (this.execution['clickedOnUndo'] && this.execution['correctInput']);
    this.execution['finishedExecutionAt'] = new Date();
    const id = this.userService.currentUser()?.id
    if (id) {
      this.experimentService.setLastFinishedExperimentTest(this.experimentId);
      this.loading = true;
      this.experimentService.getExperimentExecutionByStateAndTest(id, this.experimentId, "INPROCESS").subscribe((exec) => {
        this.execution["experimentTestExecutionId"] = exec.id;
        this.experimentService.saveErrorCorrectionExperiment(this.execution).subscribe(() => {
          setTimeout(() => {
            this.loading = false;
            this.router.navigateByUrl("/")
            this.toasterService.success("Vielen Dank! Sie haben das Experiment erfolgreich abgeschlossen");
          }, 2000);
        });
      });
    }
  }

  updateClickBehaviour(value: string) {
    if (value == 'deletedItems') {
      this.execution["clickedOnDeletedItems"] = true;
    }
    this.increaseFailedClicks();
  }

  increaseNumberClicks(event: MouseEvent) {
    if (!this.firstClick){
      this.execution["firstClick"] =  (event.target as HTMLElement).innerHTML;
    }
    this.execution["numberClicks"] = this.execution["numberClicks"]++;
  }

  increaseFailedClicks() {
    this.execution["failedClicks"] = this.execution["failedClicks"]++;
  }
}
