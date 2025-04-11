import {
  Component,
  ElementRef, EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit, Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import {ExperimentTest} from '../../models/experiment-test';
import {NgClass, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-experiment-test',
  imports: [
    NgIf,
    FormsModule,
    RouterLink,
    NgClass,
    MatIcon
  ],
  standalone: true,
  templateUrl: './experiment-test.component.html',
  styleUrl: './experiment-test.component.css'
})
export class ExperimentTestComponent implements OnChanges, OnInit {
  @Input() test: ExperimentTest = {
    position: 1, name: "", description: "",
    estimatedExecutionTime: 0, state: "", experiment: null,
    id: 0, headDetailDescription: "", detailDescription: "", goalInstruction: "",
    configuration: {},
  }
  @Input() completed: boolean = false;
  @Input() markedText: string = "";
  @ViewChildren('textAttribute') textAttributes!: QueryList<ElementRef>;
  @Input() finishedExecutions: { [key: number]: boolean } = {};
  @Input() state: string = 'Freigeschaltet';
  @Input() isProgressiveVisualization: boolean = false;
  @Output() experimentTestSelectionEventEmitter: EventEmitter<ExperimentTest> = new EventEmitter<ExperimentTest>();


  ngOnChanges(changes: SimpleChanges): void {

    const textToMark = changes["markedText"]?.currentValue

    if (textToMark != "" && this.textAttributes && textToMark != undefined) {
      this.textAttributes.forEach((attr) => {
        if (!attr.nativeElement.dataset.originalText) {
          attr.nativeElement.dataset.originalText = attr.nativeElement.innerText;
        }

        const originalText = attr.nativeElement.dataset.originalText;
        const regex = new RegExp(`(${textToMark})`, "gi");
        attr.nativeElement.innerHTML = originalText.replace(regex, `<mark>$1</mark>`);
      });

    } else {
      this.textAttributes?.forEach((attr) => {
        if (attr.nativeElement.dataset.originalText) {
          attr.nativeElement.innerHTML = attr.nativeElement.dataset.originalText;
        }
      });
    }
  }

  ngOnInit(): void {
    if (this.completed){
      this.test.state = 'Abgeschlossen';
      this.state = 'Abgeschlossen';
    }

  }

  emitSelection(){
    this.experimentTestSelectionEventEmitter.emit(this.test);
  }


}
