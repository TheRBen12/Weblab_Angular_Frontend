import {Component, inject, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {RouterOutlet} from '@angular/router';
import {SideMenuComponent} from '../side-menu/side-menu.component';
import {BasketComponent} from '../../../basket/basket.component';
import {MatFabButton} from '@angular/material/button';
import {
  ExperimentTestInstructionComponent
} from '../../experiment-test-instruction/experiment-test-instruction.component';
import {ProductType} from '../../../models/product-category';
import {ProductService} from '../../../services/product.service';
import {RouterService} from '../../../services/router.service';
import {routerLinks} from '../routes';
import {AutoCompleteComponent} from '../../../auto-complete/auto-complete.component';
import {FilterService} from '../../../services/filter.service';


@Component({
  selector: 'app-mental-model-left-side-navigation',
  imports: [
    MatIcon,
    RouterOutlet,
    SideMenuComponent,
    BasketComponent,
    MatFabButton,
    ExperimentTestInstructionComponent,
    AutoCompleteComponent
  ],
  templateUrl: './mental-model-left-side-navigation.component.html',
  standalone: true,
  styleUrl: './mental-model-left-side-navigation.component.css'
})
export class MentalModelLeftSideNavigationComponent implements OnInit{
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
  currentRoute: string = "Home";
  parentRoute: string | null = null;
  parentCategory: string | null = null;
  currentType: ProductType| undefined = undefined;
  routes = routerLinks

  constructor() {
    this.instructions = ["Finden Sie die passende Produktkategorie des unten spezifizierten Produktes"]
  }

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchProductTypes(this.currentRoute);
  }
  openBasket(){
    this.basketIsHidden = !this.basketIsHidden;
  }

  finishExperiment($event: number) {

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

  fetchProductTypes(currentRoute: string){
    this.productService.fetchSubCategoriesObjects(currentRoute).subscribe((categories) => {
      this.productCategories = categories;
      this.categoryLinks = this.routerService.buildValueKeyPairForCategoryLinks(this.productCategories);
    });
  }

  hideBasket($event: boolean) {
    this.basketIsHidden = $event;
  }
}
