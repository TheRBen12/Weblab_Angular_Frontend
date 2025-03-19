import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {
  ExperimentTestInstructionComponent
} from '../../experiment-test-instruction/experiment-test-instruction.component';
import {SideMenuComponent} from '../side-menu/side-menu.component';
import {SearchBarComponent} from '../../../search-bar/search-bar.component';
import {MatIcon} from '@angular/material/icon';
import {ProductType} from '../../../models/product-category';
import {ProductService} from '../../../services/product.service';
import {Router, RouterOutlet} from '@angular/router';
import {RouterService} from '../../../services/router.service';
import {routerLinks} from '../routes';
import {Subscription} from 'rxjs';
import {SideMenuService} from '../../../services/side-menu.service';
import {BasketComponent} from '../../../basket/basket.component';
import {NgIf} from '@angular/common';
import {ExperimentService} from '../../../services/experiment.service';
import {FilterService} from '../../../services/filter.service';

@Component({
  selector: 'app-hicks-law',
  imports: [
    ExperimentTestInstructionComponent,
    SideMenuComponent,
    SearchBarComponent,
    MatIcon,
    RouterOutlet,
    BasketComponent,
    NgIf
  ],
  templateUrl: './hicks-law.component.html',
  standalone: true,
  styleUrl: './hicks-law.component.css'
})
export class HicksLawComponent implements OnInit {
  productService = inject(ProductService);
  productCategoryRouterLinksService = inject(RouterService);
  experimentService: ExperimentService = inject(ExperimentService);
  filterService = inject(FilterService);
  menuService: SideMenuService = inject(SideMenuService);
  router = inject(Router);
  currentInstructionStep: number = 0;
  instructions: string[] = [];
  currentRoute: string = "Home";
  productCategories: ProductType[] = [];
  currentType: ProductType | undefined;
  parentCategory: string = "";
  categoryLinks: string[] = [];
  routes = routerLinks
  parentRoute: string = "";
  updateMenuSubscription: Subscription = new Subscription();
  targetRoutes = ["Lebensmittel"]
  basket: any[] = [];
  searchBarDisabled = true;
  experimentId: number | null = null;
  targetInstruction: string = "";
  productLimit: number = 0;
  categoryLimit: number = 0;


  constructor(private cdRef: ChangeDetectorRef) {
    this.instructions = ["Finden Sie die Produktkategorie Lebensmittel", "Wählen Sie ein Lebensmittel aus.",
      "Fügen Sie das Lebensmittel dem Warenkrob hinzu"];
  }

  ngOnInit(): void {
    const urlSegments = this.router.url.split("/");
    const id = urlSegments.indexOf("hicks-law")

    const expId = Number(urlSegments[id + 1]);
    if (expId) {
      this.experimentId = expId;
      this.fetchExperimentTest(this.experimentId);
    }
    if (this.experimentId == 6) {
      this.searchBarDisabled = false;
    }

    this.productService.getBasket();
    this.productService.getBasketSubscription().subscribe((products) => {
      if (products.length > this.basket.length) {
        this.currentInstructionStep = 0;
      } else if (this.basket.length > products.length) {
        this.currentInstructionStep = 1;
      }
      this.basket = products;
      if (this.basket.length >= 3) {
        this.instructions.push("Gehen Sie zur Kasse");
        this.currentInstructionStep = 3;
      }
    });

    this.updateMenuSubscription = this.menuService.getSubject().subscribe((updateMenu) => {
      if (updateMenu) {
        this.fetchProductTypes("Home", this.categoryLimit);
        this.currentRoute = "Home";
        this.currentInstructionStep = 2;
      }
    });

    this.currentRoute = this.productCategoryRouterLinksService.rebuildCurrentRoute(this.router.url.split("/"));
    if (this.currentRoute != "Home") {
      const parentRoute = localStorage.getItem("parentRoute") ?? "";
      this.productService.fetchSubCategoriesObjects(parentRoute).subscribe((categories) => {
        this.currentType = categories.find(type => type.name == this.currentRoute);
        this.parentCategory = this.currentType?.parentType ? this.currentType.parentType.name : "Home";
        this.parentRoute = this.routes[this.parentCategory];
      });
    }

    this.cdRef.detectChanges();
  }

  setCurrentRoute(route: string) {
    this.currentRoute = route;
    this.fetchProductTypes(route, this.categoryLimit);
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

  updateInstructions(currentRoute: string) {
    if (this.targetRoutes.indexOf(currentRoute) != -1) {
      this.currentInstructionStep = 1;
      if (this.currentInstructionStep > 1) {
        this.currentInstructionStep = 2;
      }
      ;
    }
  }

  fetchProductTypes(currentRoute: string, categoryLimit: number) {
    this.productService.fetchSubCategoriesObjects(currentRoute).subscribe((categories) => {
      this.productCategories = categories;
      this.cutProductCategoryList();
      if (this.currentRoute == "Lebensmittel"){
        this.categoryLinks.filter(type => type == "lebensmittel");
        this.productCategories = [];
      }
      this.categoryLinks = this.productCategoryRouterLinksService.buildValueKeyPairForCategoryLinks(this.productCategories);
    });
  }

  cutProductCategoryList() {
    this.productCategories = this.productCategories.filter((c, index) => {
      return index < this.categoryLimit || c.name == "Lebensmittel";
    });
  }

  finishExperiment(productNumberInBasket: number) {
    if (productNumberInBasket >= 3) {
      // finish experiment
    }
  }

  private fetchExperimentTest(experimentId: number) {
    this.experimentService.getExperimentTest(experimentId).subscribe((experiment) => {
      this.targetInstruction = experiment.goalInstruction;
      this.productLimit = Number(JSON.parse(experiment.configuration)['productLimit']);
      this.categoryLimit = Number(JSON.parse(experiment.configuration)['categoryLimit']);
      this.fetchProductTypes(this.currentRoute, this.categoryLimit);
      this.cdRef.detectChanges();
    });

  }

  filterProduct($event: string) {
    this.filterService.dispatchFilterText($event);
  }
}
