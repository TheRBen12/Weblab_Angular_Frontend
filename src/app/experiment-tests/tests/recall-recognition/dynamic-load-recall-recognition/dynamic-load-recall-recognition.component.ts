import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RecallRecognitionPartOneComponent} from '../recall-recognition-part-one/recall-recognition-part-one.component';
import {NgComponentOutlet, NgIf} from '@angular/common';
import {
  ExperimentTestInstructionComponent
} from '../../../experiment-test-instruction/experiment-test-instruction.component';
import {InstructionService} from '../../../../services/instruction.service';

@Component({
  selector: 'app-dynamic-load-recall-recognition',
  imports: [
    NgComponentOutlet,
    NgIf,
    ExperimentTestInstructionComponent
  ],
  templateUrl: './dynamic-load-recall-recognition.component.html',
  standalone: true,
  styleUrl: './dynamic-load-recall-recognition.component.css'
})
export class DynamicLoadRecallRecognitionComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  instructionService = inject(InstructionService);
  pos: number = 0;
  component: any;
  instructions: string[] = [];

  ngOnInit() {
    debugger;
    console.log(this.route.url.subscribe((value)=>{
      console.log(value);
    }));
    this.pos = Number(this.route.snapshot.paramMap.get('pos'));
    switch (this.pos) {
      case 0:
        this.component = RecallRecognitionPartOneComponent;
        this.instructions = this.instructionService.getRecallRecognitionPartOneInstructions();
        break;
      default:
        console.log("No experiment was found");
    }
  }

}
