import {Component, Input} from '@angular/core';
import {
  MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {NgForOf, NgIf, SlicePipe} from '@angular/common';

@Component({
  selector: 'app-experiment-test-instruction',
  imports: [
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatExpansionModule,
    NgForOf,
    SlicePipe,
    NgIf
  ],
  templateUrl: './experiment-test-instruction.component.html',
  standalone: true,
  styleUrl: './experiment-test-instruction.component.css'
})
export class ExperimentTestInstructionComponent {
  @Input() instructions: string[] = [];
  @Input() currentInstructionStep: number = 0;
  @Input() target: string = "";
  @Input() product: any|null = null;


  protected readonly Object = Object;
}
