import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from '@angular/common';
import {filter} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {MatFabButton} from '@angular/material/button';

@Component({
  selector: 'app-search-bar',
  imports: [
    NgIf,
    FormsModule,
    MatIcon,
    MatFabButton
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
  @Input() disabled: boolean = true;


  filterResults(text: string) {
    this.inputTextEvent.emit(text);
  }

  protected readonly filter = filter;
  filterText: string = "";
}
