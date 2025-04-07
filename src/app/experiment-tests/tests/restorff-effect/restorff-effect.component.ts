import {Component, inject, OnInit} from '@angular/core';
import {Email} from '../../../models/email';
import {EmailMenuComponent} from '../email-menu/email-menu.component';
import {
  ExperimentTestInstructionComponent
} from '../../experiment-test-instruction/experiment-test-instruction.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {ExperimentTest} from '../../../models/experiment-test';
import {EmailService} from '../../../services/email.service';
import {ExperimentService} from '../../../services/experiment.service';
import {RestorffEmailListItemComponent} from './restorff-email-list-item/restorff-email-list-item.component';
import {TimeService} from '../../../services/time.service';
import {LoginService} from '../../../services/login.service';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

const emails: Email[] = [
  {
    id: 25,
    user: 0,
    sender: "alice@example.com",
    receiver: "bob@example.com",
    date: "2025-03-10T08:30:00Z",
    subject: "Meeting Reminder",
    body: "Hallo Bob, vergiss unser Meeting um 10:00 Uhr nicht."
  },
  {
    id: 26,
    user: 0,
    sender: "charlie@example.com",
    receiver: "alice@example.com",
    date: "2025-03-09T14:15:00Z",
    subject: "Projektstatus",
    body: "Hey Alice, das Projekt ist fast fertig. Lass uns morgen sprechen."
  },
  {
    id: 27,
    user: 0,
    sender: "bob@example.com",
    receiver: "dave@example.com",
    date: "2025-03-08T19:45:00Z",
    subject: "Urlaubsantrag",
    body: "Hallo Dave, ich möchte nächste Woche Urlaub nehmen. Ist das in Ordnung?"
  },
  {
    id: 28,
    user: 0,
    sender: "eva@example.com",
    receiver: "frank@example.com",
    date: "2025-03-07T12:00:00Z",
    subject: "Rechnung Nr. 12345",
    body: "Guten Tag Frank, anbei die Rechnung für die letzte Bestellung."
  },
  {
    id: 29,
    user: 0,
    sender: "george@example.com",
    receiver: "harry@example.com",
    date: "2025-03-06T16:20:00Z",
    subject: "Geburtstagsfeier",
    body: "Hey Harry, ich lade dich zu meiner Geburtstagsfeier am Samstag ein!"
  },
  {
    id: 30,
    sender: "isabelle@example.com",
    receiver: "jack@example.com",
    date: "2025-03-05T09:10:00Z",
    subject: "Neues Jobangebot",
    body: "Hallo Jack, wir haben eine spannende Stelle für dich. Interesse?",
    user: 0
  },
  {
    id: 30,
    sender: "info@bern.com",
    receiver: "peter.schaller@example.com",
    date: "2025-02-02T09:10:00Z",
    subject: "Wir aktualisieren unsere Datenschutzbedingungen",
    body: "Hallo Peter, wir aktualisieren ",
    user: 0
  }


];


@Component({
  selector: 'app-restorff-effect',
  imports: [
    EmailMenuComponent,
    ExperimentTestInstructionComponent,
    NgForOf,
    RestorffEmailListItemComponent,
    NgClass,
    MatCard,
    MatCardContent,
    MatProgressSpinner,
    NgIf
  ],
  templateUrl: './restorff-effect.component.html',
  standalone: true,
  styleUrl: './restorff-effect.component.css'
})
export class RestorffEffectComponent implements OnInit {
  mails: Email[] = [];
  experimentTest!: ExperimentTest
  currentInstructionStep: number = 0;
  currentEmailIndex: number = 0;
  lastAddedEmailIndex: number = 0;

  instructions: string[] = [];
  emailService = inject(EmailService);
  timeService: TimeService = inject(TimeService);
  experimentService = inject(ExperimentService);
  loginService: LoginService = inject(LoginService);
  router = inject(Router);
  configuration: any = {};
  emailData: Email[] = [];
  reactions: { [key: number]: number } = {};
  tasks: { [key: number]: boolean } = {};
  loading: boolean = false;


  execution: {
    [key: string]: any
  } = {
    'executionTime': 0,
    'experimentTestExecutionId': null,
    'numberFailedClicks': 0,
    'numberClicks': 0,
    'finishedExecutionAt': null,
    'reactionTimes': "",
    'tasks': "",
    "numberDeletedMails": 0
  };
  private startTime: number = 0;

  constructor() {

  }

  fetchExperimentTest() {
    const urlSegments = this.router.url.split("/");
    const index = urlSegments.indexOf("restorff-effect") + 1;
    const experimentId = Number(urlSegments.at(index));
    if (experimentId != undefined) {
      this.experimentService.getExperimentTest(experimentId).subscribe((experimentTest) => {
        this.experimentTest = experimentTest;
        this.configuration = JSON.parse(experimentTest.configuration)
      });
    }
  }

  ngOnInit(): void {
    this.timeService.startTimer();
    this.emailData = emails;
    this.fetchExperimentTest();
    this.fetchEmails();
    const intervall = setInterval(() => {
      if (emails.length == 0) {
        clearInterval(intervall);
      }
      const mail = emails.at(this.currentEmailIndex);

      if (mail) {
        if (Math.random() < 0.5) {
          this.mails.push(mail)
          this.startTime = performance.now();
          this.lastAddedEmailIndex = this.mails.length - 1;

        } else {
          this.startTime = performance.now();
          this.mails.unshift(mail);
          this.lastAddedEmailIndex = 0;
        }
      }

      this.tasks[this.currentEmailIndex] = false;
      this.currentEmailIndex++;
      if (this.currentEmailIndex >= this.emailData.length) {
        clearInterval(intervall);
        this.finishExperiment();
      }
    }, 4000);


  }

  private fetchEmails() {
    this.emailService.getMails().subscribe((mails) => {
      this.mails = mails.filter((mail, index) => {
        return index < 3;
      })
    })
  }

  deleteEmail($event: Email, index: number) {
    if (this.emailData.find((mail) => mail.id == $event.id)) {
      const endTime = performance.now(); // Endzeit
      // Differenz in ms
      this.execution["numberDeletedMails"] = this.execution["numberDeletedMails"] + 1;
      this.reactions[this.currentEmailIndex - 1] = Math.round(endTime - this.startTime)

      if (this.lastAddedEmailIndex == this.currentEmailIndex-1 || this.lastAddedEmailIndex == index){
        this.tasks[this.currentEmailIndex - 1] = true;
      }
      this.mails = this.mails.filter(mail => mail.id != $event.id);
    } else {
      this.increaseFailedClicks();
    }

  }

  private finishExperiment() {
    setTimeout(() => {
      this.execution["executionTime"] = this.timeService.getCurrentTime();
      this.timeService.stopTimer();
      const userId = this.loginService.currentUser()?.id;
      this.execution["finishedExecutionAt"] = new Date();
      this.execution["tasks"] = JSON.stringify(this.tasks);
      this.execution["reactionTimes"] = JSON.stringify(this.reactions);
      if (userId) {
        this.experimentService.getExperimentExecutionByStateAndTest(userId, this.experimentTest.id, "INPROCESS").subscribe((exec) => {
          this.execution["experimentTestExecutionId"] = exec.id;
          this.loading = true
          this.experimentService.saveRestorffExperiment(this.execution).subscribe();
          setTimeout(() => {
            this.loading = false;
            this.router.navigateByUrl("/tests/" + this.experimentTest.experiment?.id)
          }, 4000);
        });
      }
    }, 2000);

  }

  increaseNumberClicks() {
    this.execution["numberClicks"] = this.execution["numberClicks"] + 1;
  }

  increaseFailedClicks() {
    this.execution["numberFailedClicks"] + 1;
  }

  send(email: Email, index: number,) {
    if (this.currentEmailIndex == 3 || this.currentEmailIndex==5){
      this.deleteEmail(email, index);
    }else{
      this.increaseFailedClicks();
    }
  }

  checkIfCanDelete($event: Email, i: number) {
    if (this.currentEmailIndex != 3 && this.currentEmailIndex != 5 ){
      this.deleteEmail($event, i);
    }else{
      this.increaseFailedClicks();
    }
  }
}
