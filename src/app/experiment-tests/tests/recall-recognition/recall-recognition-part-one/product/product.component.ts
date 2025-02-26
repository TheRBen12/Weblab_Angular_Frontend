import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-product',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './product.component.html',
  standalone: true,
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input() product: any;
  @Input() specifications: any[] = [];
}
