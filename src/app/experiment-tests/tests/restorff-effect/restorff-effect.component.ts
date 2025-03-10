import {Component, inject, OnInit} from '@angular/core';
import {Email} from '../../../models/email';
import {EmailMenuComponent} from '../email-menu/email-menu.component';
import {
  ExperimentTestInstructionComponent
} from '../../experiment-test-instruction/experiment-test-instruction.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {ExperimentTest} from '../../../models/experiment-test';
import {EmailService} from '../../../services/email.service';
import {ExperimentService} from '../../../services/experiment.service';
import {EmailListItemComponent} from '../email-list-item/email-list-item.component';
import {RestorffEmailListItemComponent} from './restorff-email-list-item/restorff-email-list-item.component';
import {TimeInterval} from 'rxjs/internal/operators/timeInterval';

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
  }
];


@Component({
  selector: 'app-restorff-effect',
  imports: [
    EmailMenuComponent,
    ExperimentTestInstructionComponent,
    NgIf,
    RouterOutlet,
    EmailListItemComponent,
    NgForOf,
    RouterLink,
    RestorffEmailListItemComponent,
    NgClass
  ],
  templateUrl: './restorff-effect.component.html',
  standalone: true,
  styleUrl: './restorff-effect.component.css'
})
export class RestorffEffectComponent implements OnInit {
  mails: Email[] = [];
  experimentTest: ExperimentTest | null = null
  currentInstructionStep: number = 0;
  currentEmailIndex: number = 0;
  lastAddedEmailIndex: number = 0;

  instructions: string[] = [];
  emailService = inject(EmailService);
  experimentService = inject(ExperimentService);
  router = inject(Router);
  configuration: any = {};
  emailData: Email[] = [];
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
          this.lastAddedEmailIndex = this.mails.length - 1;

        } else {
          this.mails.unshift(mail);
          this.lastAddedEmailIndex = 0;
        }
      }
      this.currentEmailIndex++;
    }, 3000);

    if (this.currentEmailIndex >= this.emailData.length) {
      clearInterval(intervall);
    }
  }

  private fetchEmails() {
    this.emailService.getMails().subscribe((mails) => {
      this.mails = mails.filter((mail, index) => {
        return index < 3;
      })
    })
  }

  deleteEmail($event: Email) {
    debugger;
    if (this.emailData.find((mail) => mail.id == $event.id)){
      this.mails = this.mails.filter(mail => mail.id != $event.id);
    }

  }
}
