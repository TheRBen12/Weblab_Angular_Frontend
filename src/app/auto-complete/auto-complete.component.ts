import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FilterService} from '../services/filter.service';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {map, Observable, switchMap, tap} from 'rxjs';
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
    MatInput,
    MatLabel,
    AutoCompleteProductComponent
  ],
  templateUrl: './auto-complete.component.html',
  standalone: true,
  styleUrl: './auto-complete.component.css'
})
export class AutoCompleteComponent implements OnInit {
  @Input() products: any[] = [];
  @Output() onInputEventEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Output() onSelectEventEmitter: EventEmitter<number> = new EventEmitter<number>()
  @Output() onInputClearedEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  @Input() placeholder: string = "";
  textToMark: string = "";
  filterService = inject(FilterService);
  myControl = new FormControl('');
  filteredOptions: any[] = [];

  emitFilterText(text: string, event: Event) {
    event.preventDefault();
    this.textToMark = text;
    this.onInputEventEmitter.emit(text);
  }

  ngOnInit(): void {
    this.myControl.valueChanges.pipe(
      map(value => value || ""),
      map((value: string) => {
         this.filteredOptions = this.filterService.filterProducts(value, this.products);
         return value;
      })
    ).subscribe((value: string) => {
      if (value == ""){
        this.onInputClearedEventEmitter.emit();
      }
      this.textToMark = value;
    });

  }

  emitSelection(productId: number) {
    this.onSelectEventEmitter.emit(productId)
  }
}
