import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {
  ExperimentTestInstructionComponent
} from '../../experiment-test-instruction/experiment-test-instruction.component';
import {NgIf} from '@angular/common';
import {EmailMenuComponent} from './email-menu/email-menu.component';
import {ExperimentService} from '../../../services/experiment.service';
import {EmailService} from '../../../services/email.service';
import {Email} from '../../../models/email';

@Component({
  selector: 'app-error-correction',
  imports: [
    RouterOutlet,
    ExperimentTestInstructionComponent,
    EmailMenuComponent,
    NgIf,
  ],
  templateUrl: './error-correction.component.html',
  standalone: true,
  styleUrl: './error-correction.component.css'
})
export class ErrorCorrectionComponent implements OnInit {
  router: Router = inject(Router);
  experimentService = inject(ExperimentService);
  emailService = inject(EmailService);
  emailToDelete: number = 0;
  instructions: string[] = [];
  currentInstructionStep = 0;
  targetInstruction: string = "";
  mailWasDeleted = false;
  deletedMail: Email|null = null;
  ngOnInit(): void {
    this.emailService.getDeletedMailSubscripition().subscribe((email) => {
      if (email){
        this.deletedMail = email;
        this.mailWasDeleted = true;
        this.currentInstructionStep++;
      }
    });

    this.emailToDelete = Math.floor(Math.random() * 10) + 1;
    this.instructions = ["Löschen Sie die " + this.emailToDelete + ". " + "E-Mail", "Geben Sie in das Eingabefeld ein, wann die gelöschte E-Mail erhalten worden ist. " +
    "Tipp: Das Datum wann die E-Mail erhalten wurde befindet sich am rechten Rand der E-Mails"];

    const urlSegments = this.router.url.split("/");
    const experimentId = Number(urlSegments[urlSegments.length-1]);
    this.fetchExperimentTest(experimentId);

  }

  private fetchExperimentTest(experimentId: number) {
    this.experimentService.getExperimentTest(experimentId).subscribe((experimentTest) => this.targetInstruction = experimentTest.goalInstruction)

  }

  checkInput(value: string) {
    if (this.deletedMail && this.deletedMail.date == value){
      console.log("korrekt")
    }

  }
}
