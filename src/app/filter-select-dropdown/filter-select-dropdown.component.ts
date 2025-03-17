import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {MatFormField, MatLabel, MatOption, MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-filter-select-dropdown',
  imports: [
    MatSelect,
    MatFormField,
    MatOption,
    MatLabel,
  ],
  templateUrl: './filter-select-dropdown.component.html',
  standalone: true,
  styleUrl: './filter-select-dropdown.component.css'
})
export class FilterSelectDropdownComponent implements OnChanges{


  @Input() title: string = "";
  @Input() values: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {

  }

}
