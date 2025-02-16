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
  @Output() filteredElementsEvent = new EventEmitter<any[]>;

  filterResults(text: string) {
    if (!text) {
      this.filteredElementsEvent.emit(this.elements);
    }
    this.filteredElements = this.elements.filter(
      element => element?.name.toLowerCase().includes(text.toLowerCase())
    );
    this.filteredElementsEvent.emit(this.filteredElements);
  }

}
