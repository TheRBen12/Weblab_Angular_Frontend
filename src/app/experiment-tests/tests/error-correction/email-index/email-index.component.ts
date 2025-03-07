import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {EmailMenuComponent} from '../email-menu/email-menu.component';
import {
  ExperimentTestInstructionComponent
} from '../../../experiment-test-instruction/experiment-test-instruction.component';

@Component({
  selector: 'app-email-index',
  imports: [
    RouterOutlet,
    EmailMenuComponent,
    ExperimentTestInstructionComponent
  ],
  templateUrl: './email-index.component.html',
  standalone: true,
  styleUrl: './email-index.component.css'
})
export class EmailIndexComponent {

}
