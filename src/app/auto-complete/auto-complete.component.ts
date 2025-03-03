import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FilterService} from '../services/filter.service';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {map, Observable, startWith} from 'rxjs';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {AsyncPipe} from '@angular/common';
import {MatInput} from '@angular/material/input';
import {AutoCompleteProductComponent} from './auto-complete-product/auto-complete-product.component';

@Component({
  selector: 'app-auto-complete',
  imports: [
    MatFormField,
    MatAutocompleteTrigger,
    ReactiveFormsModule,
    MatAutocomplete,
    MatOption,
    AsyncPipe,
    MatInput,
    MatLabel,
    AutoCompleteProductComponent
  ],
  templateUrl: './auto-complete.component.html',
  standalone: true,
  styleUrl: './auto-complete.component.css'
})
export class AutoCompleteComponent implements OnInit {
  filteredProducts: any[] = [];
  @Input() products: any[] = [];
  @Output() onInputEventEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Input() placeholder: string = "";
  filterService = inject(FilterService);
  myControl = new FormControl('');
  filteredOptions: Observable<any[]> = new Observable<any[]>()

  emitFilterText(text: string) {
    this.onInputEventEmitter.emit(text);
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map(value => (value ?? "")),
      map((value: string) => {
        const a = this.filterService.filterProducts(value, this.products);
        return a;
      }));
  }
}
