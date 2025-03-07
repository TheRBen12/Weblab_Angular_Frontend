import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {BasketComponent} from '../../../basket/basket.component';
import {
  ExperimentTestInstructionComponent
} from '../../experiment-test-instruction/experiment-test-instruction.component';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';
import {SearchBarComponent} from '../../../search-bar/search-bar.component';
import {SideMenuComponent} from '../side-menu/side-menu.component';
import {EmailMenuComponent} from './email-menu/email-menu.component';
import {ExperimentService} from '../../../services/experiment.service';
import {EmailIndexComponent} from './email-index/email-index.component';

@Component({
  selector: 'app-error-correction',
  imports: [
    RouterOutlet,
    BasketComponent,
    ExperimentTestInstructionComponent,
    MatIcon,
    NgIf,
    SearchBarComponent,
    SideMenuComponent,
    EmailMenuComponent,
    EmailIndexComponent
  ],
  templateUrl: './error-correction.component.html',
  standalone: true,
  styleUrl: './error-correction.component.css'
})
export class ErrorCorrectionComponent implements OnInit {
  router: Router = inject(Router);
  experimentService = inject(ExperimentService);
  emailToDelete: number = 0;
  instructions: string[] = [];
  currentInstructionStep = 0;
  targetInstruction: string = "";
  ngOnInit(): void {

    this.emailToDelete = Math.floor(Math.random() * 10) + 1;
    this.instructions = ["Löschen Sie die " + this.emailToDelete + ". " + "E-Mail", "Schreiben Sie in das Eingabefeld, wann die gelöscjte E-Mail erhalten worden ist. " +
    "Tipp: Das Datum wann die E-Mail erhalten wurde befindet sich am rechten Rand der E-Mails"];

    const urlSegments = this.router.url.split("/");
    const experimentId = Number(urlSegments[urlSegments.length-1]);
    this.fetchExperimentTest(experimentId);

  }

  private fetchExperimentTest(experimentId: number) {
    this.experimentService.getExperimentTest(experimentId).subscribe((experimentTest) => this.targetInstruction = experimentTest.goalInstruction)

  }
}
