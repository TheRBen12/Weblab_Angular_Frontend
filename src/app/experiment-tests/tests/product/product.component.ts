import {Component, ElementRef, inject, Input, OnChanges, QueryList, SimpleChanges, ViewChildren} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

import {ProductService} from '../../../services/product.service';

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
  @Input() textToMark: string = "";
  productService = inject(ProductService);


  @ViewChildren('textAttribute') textAttributes!: QueryList<ElementRef>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  navigate() {
    const l = this.router.url.split("/").length;
    const urlSegments = this.router.url.split("/");
    const parentRoute = this.activatedRoute.parent?.parent;
    if ((urlSegments[l - 1] == "notebook" && this.product.type == "Notebook")) {
      this.activatedRoute.url.subscribe(url => {
        this.router.navigate(['show/product/' + this.product.id], {relativeTo: parentRoute});
      });
    } else if (urlSegments[l - 1] == "2" && this.product.type == "Smartphone") {
      this.activatedRoute.url.subscribe(url => {
        this.router.navigate(['show/product/' + this.product.id], {relativeTo: parentRoute});
      });
    }
    else if (urlSegments[l - 1] == "3" && this.product.type == "Keypad") {
      this.activatedRoute.url.subscribe(url => {
        this.router.navigate(['show/product/' + this.product.id], {relativeTo: parentRoute});
      });
    }
    else if (urlSegments[l-1] == "lebensmittel" && urlSegments[l-3] == "hicks-law"){
      if (this.productService.isFoodProduct(this.product.type)){
        this.router.navigate(['show/product/' + this.product.id], {relativeTo: parentRoute});
      }
    }

    else if (urlSegments[l-1] == "kaffeemaschine" && urlSegments[l-3] == "mental-model"){
      if (this.product.type == "Kaffeemaschine"){
        this.router.navigate(['show/product/' + this.product.id], {relativeTo: parentRoute});
      }
    }
  }





}
