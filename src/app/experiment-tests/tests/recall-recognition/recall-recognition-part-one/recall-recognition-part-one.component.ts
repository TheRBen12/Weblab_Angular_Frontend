import {AfterContentInit, ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {SearchBarComponent} from '../../../../search-bar/search-bar.component';
import {MatIcon} from '@angular/material/icon';
import {
  ExperimentTestInstructionComponent
} from "../../../experiment-test-instruction/experiment-test-instruction.component";
import {SideMenuComponent} from '../side-menu/side-menu.component';
import {ProductService} from '../../../../services/product.service';
import {ProductType} from '../../../../models/product-category';
import {routerLinks} from './routes';
import {Subscription} from 'rxjs';
import {RecallRecognitionExperimentTestService} from '../../../../services/recall-recognition-experiment-test.service';
import {RouterService} from '../../../../services/router.service';

@Component({
  selector: 'app-recall-recognition-part-one',
  imports: [
    SearchBarComponent,
    MatIcon,
    RouterOutlet,
    ExperimentTestInstructionComponent,
    SideMenuComponent,
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
  dailyOfferProduct: any;
  specifications: any[] = [];
  parentCategory: string | null = null;
  parentRoute: string | null = null;
  currentType: ProductType | undefined;
  currentInstructionStep: number = 0;
  routerLinks = routerLinks;
  targetRoutes = ["IT und Multimedia", "PC und Notebooks", "Notebook"]
  recallRecognitionService = inject(RecallRecognitionExperimentTestService);
  productCategoryRouterLinksService = inject(RouterService);
  updateMenuSubscription: Subscription = new Subscription();

  constructor(private cdRef: ChangeDetectorRef) {
    this.instructions = ["Finden Sie die Produktkategorie IT und Multimedia",
      "Finden Sie die Produktkategorie PC und Notebooks",
      "Finden Sie die Produktkategorie Notebooks",
      "Wählen Sie ein Notebook aus",
      "Fügen Sie das Notebook dem Warenkorb hinzu"]
  }

  ngOnInit(): void {
    this.updateMenuSubscription = this.recallRecognitionService.getSubject().subscribe((updateMenu) => {
      if (updateMenu) {
        this.fetchProductTypes("Home");
        this.currentRoute = "Home";
        this.currentInstructionStep++;
        this.cdRef.detectChanges();
      }
    });
    const l = this.router.url.split("/").length;
    const link = this.router.url.split("/")[l-1];
    const category = Object.keys(routerLinks).find(key => routerLinks[key] === link);
    this.currentRoute = category? category: "Home";
    if (category != "Home" && category != undefined){
      this.productService.fetchSubCategoriesObjects("Home").subscribe((categories) => {
        this.currentType = categories.find(type => type.name == category);
        this.parentCategory = this.currentType?.parentType ? this.currentType.parentType.name : "Home";
        this.parentRoute = this.routerLinks[this.parentCategory];
      });
    }

      this.fetchDailyOffer();
      this.fetchProductTypes(this.currentRoute);

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

  fetchDailyOffer() {
    this.productService.getDailyOfferProduct().subscribe((result) => {
      this.dailyOfferProduct = result;
      this.specifications = this.dailyOfferProduct.specifications;
    });
  }

  fetchProductTypes(currentRoute: string) {
      this.productService.fetchSubCategoriesObjects(currentRoute).subscribe((categories) => {
        this.productCategories = categories;
        this.categoryLinks = this.productCategoryRouterLinksService.buildValueKeyPairForCategoryLinks(this.productCategories);
      });
  }

  ngOnDestroy(): void {
    this.updateMenuSubscription.unsubscribe();
  }
}
