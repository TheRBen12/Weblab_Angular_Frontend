import {Component, inject, OnInit} from '@angular/core';
import {BasketComponent} from '../../../basket/basket.component';
import {
  ExperimentTestInstructionComponent
} from '../../experiment-test-instruction/experiment-test-instruction.component';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {RouterLink, RouterOutlet} from '@angular/router';
import {ProductService} from '../../../services/product.service';
import {RouterService} from '../../../services/router.service';
import {FilterService} from '../../../services/filter.service';
import {ProductType} from '../../../models/product-category';
import {routerLinks} from '../routes';

import {SearchBarComponent} from '../../../search-bar/search-bar.component';
import {CommonModule} from '@angular/common';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MegaDropDownMenuComponent} from '../../../mega-drop-down-menu/mega-drop-down-menu.component';

@Component({

  animations: [
    trigger('hoverState', [
      state('open', style({'opacity': 1, })),
      state('closed', style({'opacity': 0} )),
      transition('open => closed', [animate('500ms ease-out')]),
      transition('closed => open', [animate('500ms ease-in')]),

    ])
  ],
  selector: 'app-mental-model-mega-dropdown',
  imports: [
    CommonModule,
    BasketComponent,
    ExperimentTestInstructionComponent,
    MatFabButton,
    MatIcon,
    RouterOutlet,
    SearchBarComponent,
    RouterLink,
    MegaDropDownMenuComponent,
  ],
  templateUrl: './mental-model-mega-dropdown.component.html',
  standalone: true,
  styleUrl: './mental-model-mega-dropdown.component.css'
})
export class MentalModelMegaDropdownComponent implements OnInit{

  productService = inject(ProductService);
  routerService = inject(RouterService);
  filterService = inject(FilterService);
  currentInstructionStep: number = 0;
  instructions: string[] = [];
  basketIsHidden: boolean = true;
  basket: any[] = [];
  categoryLinks: string[] = [];
  products: any[] = [];
  productCategories: ProductType[] = [];
  parentProductCategories: ProductType[] = [];
  currentRoute: string = "Home";
  parentRoute: string | null = null;
  parentCategory: string | null = null;
  currentType: ProductType| undefined = undefined;
  routes = routerLinks
  showSubNavMenu = false;

  constructor() {
    this.instructions = ["Finden Sie die passende Produktkategorie des unten spezifizierten Produktes"]
  }



  ngOnInit(): void {
    this.productService.getBasket();
    this.productService.getBasketSubscription().subscribe((basket) => {
      this.basket = basket;
    })
    this.fetchParentProductTypes();
    this.fetchProducts();
    this.fetchProductTypes(this.currentRoute);
  }
  openBasket(){
    this.basketIsHidden = !this.basketIsHidden;
  }

  finishExperiment($event: number) {

  }

  checkIfCloseMenu(){
    if (this.showSubNavMenu){
      return
    }
  }

  setCurrentRoute(route: string) {
    this.currentRoute = route;
    this.fetchProductTypes(route);
    if (this.parentCategory == route) {
      this.currentType = this.currentType?.parentType;
    } else {
      this.currentType = this.productCategories.find(category => route);
    }
    if (!this.currentType) {
      this.parentCategory = "Home";
      this.parentRoute = this.routes["Home"]
    } else {
      this.parentCategory = this.currentType.parentType ? this.currentType.parentType.name : "Home";
      this.parentRoute = this.routes[this.parentCategory]
    }
    localStorage.setItem("parentRoute", this.parentCategory);
    this.updateInstructions(this.currentRoute);

  }

  filterProducts(text: string) {

    this.filterService.dispatchFilterText(text);
  }


  fetchProducts(){
    this.productService.getAllProducts().subscribe((products) => {
      this.products= products;
    })
  }


  private updateInstructions($event: string) {

  }


  fetchParentProductTypes(){
    this.productService.fetchSubCategoriesObjects("Home").subscribe((categories) => {
      this.parentProductCategories = categories;
      this.categoryLinks = this.routerService.buildValueKeyPairForCategoryLinks(this.parentProductCategories);
    });
  }

  fetchProductTypes(currentRoute: string){
    this.productService.fetchSubCategoriesObjects(currentRoute).subscribe((categories) => {
      this.productCategories = categories;
      this.categoryLinks = this.routerService.buildValueKeyPairForCategoryLinks(this.productCategories);
    });
  }

  hideBasket($event: boolean) {
    this.basketIsHidden = $event;
  }

  showSubMenu(link: string){
    this.currentRoute = link
    this.showSubNavMenu = true;
  }

  hideSubMenu(){
    this.showSubNavMenu = false;
  }


  toggleSubMenu(link: string) {
    this.currentRoute = link;
    this.showSubNavMenu  = !this.showSubNavMenu;
  }
}
