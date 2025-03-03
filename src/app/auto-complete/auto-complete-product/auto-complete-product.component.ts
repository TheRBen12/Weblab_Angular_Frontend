import {Component, Input} from '@angular/core';
import {KeyValuePipe, NgForOf, NgIf} from '@angular/common';
import {MatCard} from '@angular/material/card';

@Component({
  selector: 'app-auto-complete-product',
  imports: [
    KeyValuePipe,
    MatCard,
    NgForOf,
    NgIf
  ],
  templateUrl: './auto-complete-product.component.html',
  standalone: true,
  styleUrl: './auto-complete-product.component.css'
})
export class AutoCompleteProductComponent {
  @Input() product: any
}
