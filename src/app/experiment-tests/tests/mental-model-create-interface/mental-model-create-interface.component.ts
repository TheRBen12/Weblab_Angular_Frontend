import {Component, inject, OnInit} from '@angular/core';
import {BasketComponent} from '../../../basket/basket.component';
import {
  ExperimentTestInstructionComponent
} from '../../experiment-test-instruction/experiment-test-instruction.component';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MegaDropDownMenuComponent} from '../../../mega-drop-down-menu/mega-drop-down-menu.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {SearchBarComponent} from '../../../search-bar/search-bar.component';
import {ProductService} from '../../../services/product.service';
import {RouterService} from '../../../services/router.service';
import {FilterService} from '../../../services/filter.service';
import {ProductType} from '../../../models/product-category';
import {routerLinks} from '../routes';
import {SideMenuComponent} from '../side-menu/side-menu.component';
import {AutoCompleteComponent} from '../../../auto-complete/auto-complete.component';
import {ExperimentService} from '../../../services/experiment.service';
import {ExperimentTest} from '../../../models/experiment-test';

@Component({
  selector: 'app-mental-model-create-interface',
  imports: [
    BasketComponent,
    ExperimentTestInstructionComponent,
    MatFabButton,
    MatIcon,
    MegaDropDownMenuComponent,
    NgForOf,
    RouterOutlet,
    SearchBarComponent,
    NgClass,
    SideMenuComponent,
    RouterLink,
    AutoCompleteComponent,
    NgIf,
  ],
  templateUrl: './mental-model-create-interface.component.html',
  standalone: true,
  styleUrl: './mental-model-create-interface.component.css'
})
export class MentalModelCreateInterfaceComponent implements OnInit {
  productService = inject(ProductService);
  routerService = inject(RouterService);
  filterService = inject(FilterService);
  experimentService: ExperimentService = inject(ExperimentService);
  router: Router = inject(Router);
  currentInstructionStep: number = 0;
  instructions: string[] = [];
  basketIsHidden: boolean = true;
  basket: any[] = [];
  categoryLinks: string[] = [];
  products: any[] = [];
  productCategories: ProductType[] = [];
  parentProductCategories: string[] = ["IT und Multimedia", "Haushalt", "Audio"];
  currentRoute: string = "Home";
  parentRoute: string | null = null;
  parentCategory: string | null = null;
  currentType: ProductType | undefined = undefined;
  routes = routerLinks
  showSubNavMenu = false;
  dummyCategories: string[] = ["PC", "Notebook", "Smartphone", "Keypad"]
  showInstructions: boolean = true;
  protected experimentTest: ExperimentTest | null = null;

  selectedInterFace: { [key: string]: boolean } = {
    'navbarTop': false,
    'navbarBottom': false,
    "shoppingCartBottomLeft": false,
    "shoppingCartBottomRight": false,
   " shoppingCartTopRight": false,
    "shoppingCartTopLeft": false,
    "searchBarTop": false,
    "searchBarBottom": false,
    "autoCompleteTop": false,
    "autoCompleteBottom": false,
    "sideMenuLeft": false,
    "sideMenuRight": false,
    "mega-drop-down": false,
  }


  selectElement(element: string, event: Event) {
    event.stopPropagation();
    if (element == "navbarTop" && this.selectedInterFace[element]){
      return;
    }
    if (this.selectedInterFace[element]){
      this.selectedInterFace[element] = false;
      return;
    }
    if (element.includes('shoppingCartBottom') && (this.selectedInterFace["shoppingCartBottomLeft"] || this.selectedInterFace["shoppingCartBottomRight"])){
      return;
    }else if (element.includes('shoppingCartTop') && (this.selectedInterFace["shoppingCartTopLeft"] || this.selectedInterFace["shoppingCartTopRight"])){
      return;
    }else{
      this.selectedInterFace[element] = true;
    }

  }

  isSelected(elementName: string): boolean {
    return this.selectedInterFace[elementName];
  }

  setCurrentRoute($event: string) {

  }

  toggleInstructions() {
    this.showInstructions = !this.showInstructions;

  }

  ngOnInit(): void {
    this.fetchProductTypes(this.currentRoute);
    this.fetchExperimentTest();

  }

  fetchProductTypes(currentRoute: string) {
    this.productService.fetchSubCategoriesObjects(currentRoute).subscribe((categories) => {
      this.productCategories = categories;
      this.categoryLinks = this.routerService.buildValueKeyPairForCategoryLinks(this.productCategories);
    });
  }

  private fetchExperimentTest() {
    const experimentIdIndex = this.router.url.split("/").indexOf("mental-model") + 1;
    const id = Number(this.router.url.split("/")[experimentIdIndex]);
    this.experimentService.getExperimentTest(id).subscribe((test) => {
      this.experimentTest = test;
    });

  }

}
