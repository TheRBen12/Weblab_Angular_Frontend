import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatFormField, MatLabel, MatOption, MatSelect} from '@angular/material/select';
import {MatSlider, MatSliderRangeThumb} from '@angular/material/slider';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-filter-select-dropdown',
  imports: [
    MatSelect,
    MatOption,
    MatLabel,
    MatFormField,
    MatSlider,
    MatSliderRangeThumb,
    FormsModule,
    NgIf,
    MatFormField,
    MatOption,
    MatOption,
    MatOption,
    MatOption,
  ],
  templateUrl: './filter-select-dropdown.component.html',
  standalone: true,
  styleUrl: './filter-select-dropdown.component.css'
})
export class FilterSelectDropdownComponent {


  @Input() title: string = "";
  @Input() values: string[] = [];
  @Output() onFilterEventEmitter = new EventEmitter<{ propertyName: string, value: string }>
  @Output() onFilterPriceEventEmitter = new EventEmitter<{ min: number, max: number }>

  filterProductsByProperty(propertyName: string, value: string) {
    this.onFilterEventEmitter.emit({propertyName: propertyName, value: value});
  }

  filterByPrice(min: string, max: string) {
    this.onFilterPriceEventEmitter.emit({min: Number(min), max: Number(max)})
  }

  toggle($event: Event) {
    $event.stopPropagation();
    $event.preventDefault();
  }
}
