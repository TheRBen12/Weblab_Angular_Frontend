import {Component, Input} from '@angular/core';
import {
  MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-experiment-test-instruction',
  imports: [
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatExpansionModule,
    NgForOf
  ],
  templateUrl: './experiment-test-instruction.component.html',
  standalone: true,
  styleUrl: './experiment-test-instruction.component.css'
})
export class ExperimentTestInstructionComponent {
  @Input() instructions: string[] = [];

}
