import {Component, inject, OnInit} from '@angular/core';
import {EmailMenuComponent} from '../email-menu/email-menu.component';
import {
  ExperimentTestInstructionComponent
} from '../../experiment-test-instruction/experiment-test-instruction.component';
import {Email} from '../../../models/email';
import {ExperimentTest} from '../../../models/experiment-test';
import {EmailService} from '../../../services/email.service';
import {ExperimentService} from '../../../services/experiment.service';
import {Router, RouterOutlet} from '@angular/router';
import {emails} from '../data/emails';
import {TimeService} from '../../../services/time.service';
import {RouterService} from '../../../services/router.service';
import {LoginService} from '../../../services/login.service';

@Component({
  selector: 'app-fitts-law',
  imports: [
    EmailMenuComponent,
    ExperimentTestInstructionComponent,
    RouterOutlet,
  ],
  templateUrl: './fitts-law.component.html',
  standalone: true,
  styleUrl: './fitts-law.component.css'
})
export class FittsLawComponent implements OnInit {

  router: Router = inject(Router);
  experimentService = inject(ExperimentService);
  emailService = inject(EmailService);
  timeService: TimeService = inject(TimeService);
  routerService: RouterService = inject(RouterService);
  loginService: LoginService = inject(LoginService);
  instructions: string[] = [];
  currentInstructionStep = 0;
  targetInstruction: string = "";

  experimentTest!: ExperimentTest;
  configuration: any = {};
  emailData: Email[] = [];
  emailToDelete: number = 0;
  deletedEmail: Email | null = null;
  reactions: { [key: number]: number } = {};
  tasks: { [key: number]: boolean } = {};


  loading: boolean = false;
  execution: {
    [key: string]: any
  } = {
    'experimentTestExecutionId': null,
    'numberFailedClicks': 0,
    'finishedExecutionAt': null,
    'executionTime': 0,
    "tasks": "",
    "taskSuccess": false,
    "clickReactionTimes": "",
  };


  private fetchExperimentTest() {
    const experimentId = this.routerService.getExperimentTestIdByUrl(this.router.url, "fitts-law");
    this.experimentService.getExperimentTest(experimentId).subscribe((experimentTest) => {
      this.experimentTest = experimentTest;
    })

  }

  ngOnInit(): void {
    this.timeService.startTimer();
    this.instructions = ["Löschen Sie alle E-Mails in der Liste. Versuche Sie jedes Mal das Löschen danch rückgängig zu machen."];
    this.emailToDelete = Math.floor(Math.random() * 6) + 1;
    this.emailService.getDeletedMailSubscripition().subscribe((data) => {
      if (data) {
        this.tasks[data.position] = false;
        this.deletedEmail = data.mail;
      }
    });

    this.emailService.getUndoEventSubscription().subscribe((emailIndex) => {
      if (emailIndex) {
        if (!this.tasks[emailIndex]) {
          this.tasks[emailIndex] = true;
        }
        this.reactions[emailIndex] = this.timeService.getCurrentTime();
        this.timeService.stopTimer();
      }
    });
    this.emailData = emails;
    this.fetchExperimentTest()
  }


  finishExperiment() {
    this.execution["clickReactionTimes"] = JSON.stringify(this.reactions);
    this.execution["finishedExecutionAt"] = new Date();
    this.execution["tasks"] = JSON.stringify(this.tasks);
    const userID = this.loginService.currentUser()?.id;
    if (userID) {
      this.experimentService.getExperimentExecutionByStateAndTest(userID, this.experimentTest.id, "INPROCESS").subscribe((exec) => {
        this.execution["experimentTestExecutionId"] = exec.id;
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.router.navigateByUrl("/tests/" + this.experimentTest.experiment?.id);
        }, 2000);
        this.experimentService.saveFittsLawExperiment(this.execution).subscribe();

      });
    }


  }
}
