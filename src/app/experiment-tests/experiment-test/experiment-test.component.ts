import {Component, ElementRef, Input, OnChanges, QueryList, SimpleChanges, ViewChildren} from '@angular/core';
import {ExperimentTest} from '../../models/experiment-test';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-experiment-test',
  imports: [
    NgIf,
    FormsModule,
    RouterLink
  ],
  standalone: true,
  templateUrl: './experiment-test.component.html',
  styleUrl: './experiment-test.component.css'
})
export class ExperimentTestComponent implements OnChanges {
  @Input() test: ExperimentTest = {
    position: 1, name: "", description: "",
    estimatedExecutionTime: 0, state: "", experiment: null,
    id: 0, headDetailDescription: "", detailDescription: "", goalInstruction: ""
  }
  @Input() markedText: string = "";
  @ViewChildren('textAttribute') textAttributes!: QueryList<ElementRef>;

  ngOnChanges(changes: SimpleChanges): void {
    const textToMark = changes["markedText"].currentValue

    if (textToMark != "" && this.textAttributes) {
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
}
