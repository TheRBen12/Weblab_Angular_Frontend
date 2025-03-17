import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {SearchBarComponent} from '../../../../search-bar/search-bar.component';
import {MatIcon} from '@angular/material/icon';
import {
  ExperimentTestInstructionComponent
} from "../../../experiment-test-instruction/experiment-test-instruction.component";
import {SideMenuComponent} from '../../side-menu/side-menu.component';
import {ProductService} from '../../../../services/product.service';
import {ProductType} from '../../../../models/product-category';
import {routerLinks} from '../../routes';
import {Subscription} from 'rxjs';
import {SideMenuService} from '../../../../services/side-menu.service';
import {RouterService} from '../../../../services/router.service';
import {BasketComponent} from '../../../../basket/basket.component';
import {MatFabButton} from '@angular/material/button';

@Component({
  selector: 'app-recall-recognition-part-one',
  imports: [
    SearchBarComponent,
    MatIcon,
    RouterOutlet,
    ExperimentTestInstructionComponent,
    SideMenuComponent,
    BasketComponent,
    MatFabButton,
  ],
  templateUrl: './recall-recognition-part-one.component.html',
  standalone: true,
  styleUrl: './recall-recognition-part-one.component.css'
})
export class RecallRecognitionPartOneComponent implements OnInit, OnDestroy {
  instructions: string[];
  productCategories: ProductType[] = [];
  categoryLinks: string[] = [];
  currentRoute: string = "Home";
  router = inject(Router);
  productService = inject(ProductService);
  productCategoryRouterLinksService = inject(RouterService);

  basket: any[] = [];
  specifications: any[] = [];
  parentCategory: string | null = null;
  parentRoute: string | null = null;
  currentType: ProductType | undefined;
  currentInstructionStep: number = 0;
  routerLinks = routerLinks;
  targetRoutes = ["IT und Multimedia", "PC und Notebooks", "Notebook"]
  menuService = inject(SideMenuService);
  updateMenuSubscription: Subscription = new Subscription();
  basketIsHidden = true;
  experimentTestId: number = -1;

  constructor(private cdRef: ChangeDetectorRef, private route: ActivatedRoute) {
    this.instructions = ["Finden Sie die Produktkategorie IT und Multimedia",
      "Finden Sie die Produktkategorie PC und Notebooks",
      "Finden Sie die Produktkategorie Notebooks",
      "Wählen Sie ein Notebook aus",
      "Fügen Sie das Notebook dem Warenkorb hinzu", "Gehen Sie zur Kasse"];
  }

  ngOnInit(): void {
    this.experimentTestId = Number(this.router.url.split("/")[this.router.url.split("/").indexOf("recall-recognition") + 1])
    console.log(this.experimentTestId);

    this.productService.getBasket();
    this.productService.getBasketSubscription().subscribe((basket) => {
      this.basket = basket;
      if (this.basket.length > 0){
        this.currentInstructionStep = this.instructions.length - 1;
      }else{
        this.currentInstructionStep = this.currentInstructionStep <= 0 ? 0: this.currentInstructionStep-1;
      }
    });
    this.updateMenuSubscription = this.menuService.getSubject().subscribe((updateMenu) => {
      if (updateMenu) {
        this.fetchProductTypes("Home");
        this.currentRoute = "Home";
        this.currentInstructionStep++;
        this.cdRef.detectChanges();
      }
    });
    this.currentRoute = this.productCategoryRouterLinksService.rebuildCurrentRoute(this.router.url.split("/"));
    if (this.currentRoute != "Home"){
      const parentRoute = localStorage.getItem("parentRoute")?? "";
      this.productService.fetchSubCategoriesObjects(parentRoute).subscribe((categories) => {
        this.currentType = categories.find(type => type.name == this.currentRoute);
        this.parentCategory = this.currentType?.parentType ? this.currentType.parentType.name : "Home";
        this.parentRoute = this.routerLinks[this.parentCategory];
      });
    }
      this.fetchProductTypes(this.currentRoute);
  }
  openBasket(){
    this.basketIsHidden = !this.basketIsHidden;
  }

  setCurrentRoute($event: string) {
    this.currentRoute = $event;
    this.updateInstructions($event);
    this.fetchProductTypes(this.currentRoute);
    if (this.currentType?.parentType?.name == $event) {
      this.currentType = this.currentType.parentType;
    } else {
      this.currentType = this.productCategories.find(type => type.name == $event);
    }
    if (this.currentType?.parentType) {
      this.parentCategory = this.currentType.parentType.name;
    } else {
      this.parentCategory = "Home";
    }
    this.parentRoute = this.routerLinks[this.parentCategory];
    localStorage.setItem("parentRoute", this.parentCategory);
  }

  updateInstructions(targetRoute: string) {
    if (this.currentRoute == "Home") {
      this.currentInstructionStep = 0;
    } else if (this.currentType?.parentType && targetRoute == this.currentType?.parentType?.name &&
      this.targetRoutes.indexOf(targetRoute) != -1) {
      this.currentInstructionStep = this.currentInstructionStep - 1;
    } else {
      if (this.targetRoutes.indexOf(targetRoute) != -1) {
        this.currentInstructionStep = this.targetRoutes.indexOf(targetRoute) + 1;
      }
    }
  }


  fetchProductTypes(currentRoute: string) {
      this.productService.fetchSubCategoriesObjects(currentRoute).subscribe((categories) => {
        this.productCategories = categories;
        this.categoryLinks = this.productCategoryRouterLinksService.buildValueKeyPairForCategoryLinks(this.productCategories);
      });
  }

  ngOnDestroy(): void {
    this.updateMenuSubscription.unsubscribe();
    localStorage.removeItem("parentRoute")
  }

  finishExperiment() {
    this.router.navigateByUrl("/",{state: {toExperimentId: this.experimentTestId}})
  }
}
