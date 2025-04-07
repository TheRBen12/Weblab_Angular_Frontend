import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-radio-button',
  imports: [],
  templateUrl: './radio-button.component.html',
  standalone: true,
  styleUrl: './radio-button.component.css'
})
export class RadioButtonComponent {
  @Input() label: string = "";
  @Input() value: any = "";
  @Input() title: string = "";
  @Input() id: string = "";
  @Output() selectionEventEmitter: EventEmitter<{value: number, identifier: string }> = new EventEmitter<{value: number, identifier: string }>();
  @Input() identifier: string = "";

  emitSelection(value: number, identifier: string){
    this.selectionEventEmitter.emit({value: value, identifier: identifier});
  }
}
