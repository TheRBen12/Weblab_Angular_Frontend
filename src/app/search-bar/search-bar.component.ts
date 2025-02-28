import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-search-bar',
  imports: [
    NgIf
  ],
  standalone: true,
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  @Input() elements: any[] = []
  @Output() inputTextEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() filteredElementsEvent = new EventEmitter<any[]>;
  @Input() placeholder: string = "";
  @Input() searchOnEnter: boolean = false;


  filterResults(text: string) {
    this.inputTextEvent.emit(text);
  }
}
