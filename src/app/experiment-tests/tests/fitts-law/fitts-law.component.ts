import {Component, inject, OnInit} from '@angular/core';
import {EmailMenuComponent} from '../email-menu/email-menu.component';
import {
  ExperimentTestInstructionComponent
} from '../../experiment-test-instruction/experiment-test-instruction.component';
import {NgIf} from '@angular/common';

import {Email} from '../../../models/email';
import {ExperimentTest} from '../../../models/experiment-test';
import {EmailService} from '../../../services/email.service';
import {ExperimentService} from '../../../services/experiment.service';
import {Router, RouterOutlet} from '@angular/router';
import {emails} from '../data/emails';

@Component({
  selector: 'app-fitts-law',
  imports: [
    EmailMenuComponent,
    ExperimentTestInstructionComponent,
    NgIf,
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
  instructions: string[] = [];
  currentInstructionStep = 0;
  targetInstruction: string = "";
  mailWasDeleted = false;

  experimentTest: ExperimentTest | null = null
  configuration: any = {};
  emailData: Email[] = [];
  emailToDelete:number = 0;
  deletedEmail: Email | null = null;


  private fetchExperimentTest() {
    const urlSegments = this.router.url.split("/");
    const index = urlSegments.indexOf("restorff-effect") + 1;
    const experimentId = Number(urlSegments.at(index));
    this.experimentService.getExperimentTest(experimentId).subscribe((experimentTest) => {
      this.experimentTest = experimentTest;
    })

  }

  ngOnInit(): void {
    this.instructions = ["Löschen Sie alle E-Mails in der Liste. Versuche Sie jedes Mal das Löschen danch rückgängig zu machen."];
    this.emailToDelete = Math.floor(Math.random() * 6) + 1;
    this.emailService.getDeletedMailSubscripition().subscribe((email) => {
      this.deletedEmail = email;
    })
    this.emailData = emails;
    this.fetchExperimentTest()
  }

  checkInput(value: string) {
    if (this.deletedEmail && this.deletedEmail.date == value) {
      console.log("korrekt")
    }

  }

}
