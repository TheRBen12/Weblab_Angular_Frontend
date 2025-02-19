import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  standalone: true,
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  @Input() elements: any[] = []
  filteredElements: any[] = this.elements
  @Output() inputTextEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() filteredElementsEvent = new EventEmitter<any[]>;


  filterResults(text: string) {
    if (!text) {
      this.filteredElementsEvent.emit(this.elements);
    }
    this.filteredElements = this.elements.filter(
      element => {
        return element?.name.toLowerCase().includes(text.toLowerCase()) ||
          element.description?.toLowerCase().includes(text.toLowerCase()) ||
          element.state?.toLowerCase().includes(text.toLowerCase());
      }
    );
    this.filteredElementsEvent.emit(this.filteredElements);
    this.inputTextEvent.emit(text);
  }
}
