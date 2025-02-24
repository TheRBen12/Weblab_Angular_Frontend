import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-product',
  imports: [
    NgForOf
  ],
  templateUrl: './product.component.html',
  standalone: true,
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnChanges {
  @Input() product: any;
  tradeMark: string = "";
  specs:any = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (this.product) {
      this.specs = this.product.specifications;
      console.log(this.product);
    }
  }

}
