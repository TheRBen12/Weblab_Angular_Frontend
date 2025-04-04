import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {ProductService} from '../services/product.service';
import {NgForOf, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatFabButton} from '@angular/material/button';
import {BusketProductComponent} from './busket-product/busket-product.component';

@Component({
  selector: 'app-basket',
  imports: [
    NgForOf,
    MatIcon,
    NgIf,
    MatFabButton,
    BusketProductComponent
  ],
  templateUrl: './basket.component.html',
  standalone: true,
  styleUrl: './basket.component.css'
})
export class BasketComponent implements OnInit{
  products: any[] = [];
  productService = inject(ProductService);
  @Input() basket: any[] = [];
  @Input() isHidden = false;
  @Output() checkoutEventEmitter: EventEmitter<number> = new EventEmitter<number>();
  @Output() hiddenEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  hideBasket(){
    this.isHidden = !this.isHidden;
    this.hiddenEventEmitter.emit(this.isHidden);
  }

  ngOnInit(): void {
    this.productService.getBasketSubscription().subscribe((basket) =>{
      if (basket.length > 0){
        this.isHidden = false;
      }
    });
  }
  removeProduct(product: any){
    this.productService.removeProductFromBusket(product);
  }
  checkOut(){
    this.checkoutEventEmitter.emit(this.basket.length);
  }

}
