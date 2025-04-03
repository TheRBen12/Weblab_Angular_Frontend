import {Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ProductType} from '../models/product-category';
import {ProductService} from '../services/product.service';
import {RouterService} from '../services/router.service';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-mega-drop-down-menu',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './mega-drop-down-menu.component.html',
  standalone: true,
  styleUrl: './mega-drop-down-menu.component.css'
})
export class MegaDropDownMenuComponent implements OnChanges{
  @Input() currentCategory: string|undefined = undefined;
  @Input() dummyCategories: string[] = [];

  @Output() routeEvent: EventEmitter<string> = new EventEmitter<string>();

  productService: ProductService = inject(ProductService);
  routerService: RouterService = inject(RouterService);
  productCategories: ProductType[] = [];
  categoryLinks: string[] = [];


  emitCategoryLink(link: string) {
    this.routeEvent.emit(link)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.currentCategory && this.currentCategory != "Home"){
      this.productService.getAllSubcategoriesByParentCategory(this.currentCategory).subscribe((types) => {
       this.productCategories = Array.from(new Set(types));
        this.categoryLinks = this.routerService.buildValueKeyPairForCategoryLinks(this.productCategories);
      });

    }
  }
}
