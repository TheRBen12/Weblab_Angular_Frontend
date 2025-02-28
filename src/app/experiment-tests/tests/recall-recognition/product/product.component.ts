import {Component, Input} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

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
  @ Input() routerLink: string = "";

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  navigate(productType: string) {
    const l = this.router.url.split("/").length;
    const urlSegments = this.router.url.split("/");
    const parentRoute = this.activatedRoute.parent;
    if ((urlSegments[l-1] == "notebook" && this.product.type == "Notebook" ) ){
      this.activatedRoute.url.subscribe(url => {
        this.router.navigate(['show/product/' + this.product.id], {relativeTo: parentRoute});
      });
    }else if (urlSegments[l-1] == "1" && this.product.type == "Smartphone"){
      this.activatedRoute.url.subscribe(url => {
        this.router.navigate(['show/product/' + this.product.id], {relativeTo: parentRoute});
      });
    }

  }
}
