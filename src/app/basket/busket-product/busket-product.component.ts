import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-busket-product',
  imports: [
    MatFabButton,
    MatIcon,
    NgIf
  ],
  templateUrl: './busket-product.component.html',
  standalone: true,
  styleUrl: './busket-product.component.css'
})
export class BusketProductComponent {
  @Input() product: any;
  @Output() removeProductEventEmitter: EventEmitter<any> = new EventEmitter<any>();
  removeProduct(product: any){
    this.removeProductEventEmitter.emit(product)
  }
}
