import {ChangeDetectorRef, Component, inject, OnInit, signal} from '@angular/core';
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
import {LoginService} from '../../../services/login.service';
import {HicksLawExperimentExecution} from '../../../models/hicks-law-experiment-execution';
import {ToastrService} from 'ngx-toastr';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-hicks-law',
  imports: [
    ExperimentTestInstructionComponent,
    SideMenuComponent,
    SearchBarComponent,
    MatIcon,
    RouterOutlet,
    BasketComponent,
    NgIf,
    MatCard,
    MatCardContent,
    MatProgressSpinner
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
  userService: LoginService = inject(LoginService);
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
  clickedRoutes: { [key: string]: string } = {};
  numberClickedSearchBar: number = 0;
  clickedOnFilters: boolean = false;
  selectedProducts: {[key: number]: Date} = {}
  protected loading: boolean = false;
  private failedClicks: number = 0;
  private numberClicks: number = 0;
  private firstClick: string|null = null;


  constructor(private cdRef: ChangeDetectorRef, private toasterService: ToastrService) {
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
        this.selectedProducts[products.length-1] = new Date();
        localStorage.setItem('selctedPrducts', JSON.stringify(this.selectedProducts));
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
        this.fetchProductTypes("Home");
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
    const selections = localStorage.getItem('selectedProducts');
     if (selections){
       this.selectedProducts = JSON.parse(selections);
     }

    this.cdRef.detectChanges();
  }

  setCurrentRoute(route: string) {
    if (this.clickedRoutes[route]){
      this.clickedRoutes[route] += " " + new Date().toISOString();
    }else{
      this.clickedRoutes[route] = new Date().toISOString();
    }

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

  updateInstructions(currentRoute: string) {
    if (this.targetRoutes.indexOf(currentRoute) != -1) {
      this.currentInstructionStep = 1;
      if (this.currentInstructionStep > 1) {
        this.currentInstructionStep = 2;
      }
      ;
    }
  }

  fetchProductTypes(currentRoute: string) {
    this.productService.fetchSubCategoriesObjects(currentRoute).subscribe((categories) => {
      this.productCategories = categories;
      this.cutProductCategoryList();
      if (this.currentRoute == "Lebensmittel") {
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
    const id = this.userService.currentUser()?.id
    if (productNumberInBasket >= 3 && id) {
      this.loading = true;
      this.fetchExecutionInProcess(id, this.experimentId).subscribe((exec) => {
        const hicksLawExecution: HicksLawExperimentExecution = {
          productLimit: this.productLimit,
          categoryLimit: this.categoryLimit,
          categoryLinkClickDates: JSON.stringify(this.clickedRoutes),
          numberClickedSearchBar: this.numberClickedSearchBar,
          clickedOnFilters: false,
          firstChoiceAt: this.selectedProducts[0],
          secondChoiceAt: this.selectedProducts[1],
          thirdChoiceAt: this.selectedProducts[2],
          experimentTestExecutionId: exec.id,
          finishedExecutionAt: new Date(),
          failedClicks: this.failedClicks,
          numberClicks: this.numberClicks,
          firstClick: this.firstClick
        }

        this.experimentService.saveHicksLawExperimentExecution(hicksLawExecution).subscribe((exec) => {
          setTimeout(() => {
            this.loading = false;
            this.router.navigateByUrl("/")
            this.toasterService.success("Vielen Dank. Sie haben das Experiment erfolgreich abgeschlossen");
          }, 2000);
        });

      });
    }

  }

  private fetchExperimentTest(experimentId: number) {
    this.experimentService.getExperimentTest(experimentId).subscribe((experiment) => {
      this.targetInstruction = experiment.goalInstruction;
      this.productLimit = Number(JSON.parse(experiment.configuration)['productLimit']);
      this.productService.updateProductLimit(this.productLimit);
      this.categoryLimit = Number(JSON.parse(experiment.configuration)['categoryLimit']);
      this.fetchProductTypes(this.currentRoute);
      this.cdRef.detectChanges();
    });

  }

  filterProduct($event: string) {
    this.filterService.dispatchFilterText($event);
  }

  updateSearchBarClickBehaviour() {
    this.failedClicks++;
    this.numberClickedSearchBar++;
  }

  private fetchExecutionInProcess(id: number, experimentTestId: any) {
    return this.experimentService.getExperimentExecutionByStateAndTest(id, experimentTestId, "INPROCESS");
  }

  increaseNumberClicks(event: MouseEvent) {
    if (!this.firstClick){
      this.firstClick = (event.target as HTMLElement).innerHTML;
    }
    this.numberClicks++;
  }
}
