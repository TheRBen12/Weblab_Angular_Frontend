import {Component, inject, OnInit} from '@angular/core';
import {AutoCompleteComponent} from '../../../auto-complete/auto-complete.component';
import {BasketComponent} from '../../../basket/basket.component';
import {
  ExperimentTestInstructionComponent
} from '../../experiment-test-instruction/experiment-test-instruction.component';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {NgIf} from '@angular/common';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {SideMenuComponent} from '../side-menu/side-menu.component';
import {ProductOffCanvasMenuComponent} from '../../../product-off-canvas-menu/product-off-canvas-menu.component';
import {RouterService} from '../../../services/router.service';
import {ProductService} from '../../../services/product.service';
import {ExperimentService} from '../../../services/experiment.service';
import {FilterService} from '../../../services/filter.service';
import {TimeService} from '../../../services/time.service';
import {LoginService} from '../../../services/login.service';
import {ProductType} from '../../../models/product-category';
import {ExperimentTest} from '../../../models/experiment-test';
import {ToastrService} from 'ngx-toastr';
import {filter} from 'rxjs';
import {routerLinks} from '../routes';


@Component({
  selector: 'app-mental-model-left-side-navigation-off-canvas',
  imports: [
    AutoCompleteComponent,
    BasketComponent,
    ExperimentTestInstructionComponent,
    MatCard,
    MatCardContent,
    MatFabButton,
    MatIcon,
    MatProgressSpinner,
    NgIf,
    RouterOutlet,
    SideMenuComponent,
    ProductOffCanvasMenuComponent
  ],
  templateUrl: './mental-model-left-side-navigation-off-canvas.component.html',
  standalone: true,
  styleUrl: './mental-model-left-side-navigation-off-canvas.component.css'
})
export class MentalModelLeftSideNavigationOffCanvasComponent implements OnInit{

  router: Router = inject(Router);

  routerService: RouterService = inject(RouterService);
  productService: ProductService = inject(ProductService);
  experimentService: ExperimentService = inject(ExperimentService);
  filterService: FilterService = inject(FilterService);
  timeService: TimeService = inject(TimeService);
  private loginService: LoginService = inject(LoginService);

  basket: any[] = [];
  links: string[] = [];
  targetRoutes = ["IT und Multimedia", "Smartphone und Tablets", "Smartphone"];
  helpInstructions = ["Sie befinden sich in der falschen Produktkategorie. Finden Sie die passende Kategorie."]

  instructions: string[] = ["Es ist Ihnen überlassen, wie Sie das Produkt finden. (Mögliche Vorgehensweise: Finden Sie die korrekte Kategorie)"];
  currentInstructionStep: number = 0;
  productCategories: ProductType[] = [];
  currentRoute: string = "Home";
  currentType?: ProductType;
  categoryLinks: string[] = [];
  showBasket: boolean = false;
  experimentTest!: ExperimentTest
  product!: any
  clickedRoutes: { [key: string]: string } = {};
  firstClick: string | null = null;
  protected readonly routerLinks = routerLinks;
  parentRoute: string = "./";
  parentCategory?: string;
  filters: string[] = [];
  loading: boolean = false;
  experimentFinished: boolean = false;
  startTime: number = 0;

  execution: {
    [key: string]: any
  } = {
    'experimentTestExecutionId': null,
    'failedClicks': 0,
    'numberClicks': 0,
    'clickedRoutes': "",
    'filters': "",
    'usedFilter': false,
    'finishedExecutionAt': null,
    'numberUsedSearchBar': 0,
    'timeToClickFirstCategory': null,
    'clickedOnSearchBar': false,
    'firstClick': "",
    "usedBreadcrumbs": false,
    "timeToClickShoppingCart": null,
    "numberToggledMenu": 0,
    "timeToFirstClick": 0,
    "searchParameters": "",
    "timeToClickSearchBar": 0,
    "clicks": ""
  };
  products: any[] = [];
  showHelpInstructions: boolean = false;
  private clicks: string[] = [];

  constructor(private readonly toasterService: ToastrService) {
  }

  canDeactivate() {
    if (!this.experimentFinished) {
      return confirm("Achtung Sie sind, dabei das Experiment zu verlassen. All Ihre Änderungen werden nicht gespeichert. Wollen Sie fortfahren.")
    } else {
      return true;
    }
  }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((products) => {
      this.products = products;
    });
    this.timeService.startTimer();
    this.fetchExperimentTest();

    this.currentRoute = this.routerService.rebuildCurrentRoute(this.router.url.split("/"));

    this.router.events
      .pipe(filter(event => (event instanceof NavigationEnd)))
      .subscribe((sub) => {
        this.currentRoute = this.routerService.rebuildCurrentRoute(this.router.url.split("/"));
        this.currentType = this.routerService.buildCurrentType(this.productCategories, this.currentRoute, this.currentType);
        this.buildParentRoute();
        this.buildBreadcrumbs();

        this.fetchProductCategories(this.currentRoute)
      });

    this.productService.getBasket();
    this.productService.getBasketSubscription().subscribe((basket) => {
      this.basket = basket;
      if (this.basket.length > 0) {

        this.startTime = performance.now();
        if (this.basket[0].type != "PC"){
          this.increaseFailedClicks();
        }
      }
    });
    this.productService.getFilterUsedSubscription().subscribe((filter) => {
      if (filter != "") {
        this.filters.push(filter);
        this.execution["usedFilter"] = true;
      }
    })

    this.fetchProductCategories(this.currentRoute);
  }


  private fetchProductCategories(route: string) {
    this.productService.fetchSubCategoriesObjects(route).subscribe((categories) => {
      this.productCategories = categories
      this.categoryLinks = this.routerService.buildValueKeyPairForCategoryLinks(this.productCategories);
    });
  }

  private buildParentRoute() {
    const parentRouteData = this.routerService.rebuildParentRoute(this.currentRoute, this.productCategories, this.currentType);
    this.parentCategory = parentRouteData.parentCategory;
    this.parentRoute = parentRouteData.parentRoute;
    console.log(this.parentRoute, this.parentCategory);
  }


  toggleBasket() {
    const endTime = performance.now();
    this.execution["timeToClickShoppingCart"] = Math.round(endTime - this.startTime);
    this.showBasket = !this.showBasket;
  }


  setCurrentRoute($event: string) {
    if (Object.values(this.clickedRoutes).length == 0) {
      this.execution["timeToClickFirstCategory"] = this.timeService.getCurrentTime();
    }
    this.clickedRoutes[$event] = new Date().toISOString();
    if (this.targetRoutes.indexOf($event) == -1) {
      this.increaseFailedClicks();
    }
    if (this.clickedRoutes[$event]) {
      this.increaseFailedClicks();
    }
  }

  checkToFinishExperiment($event: number) {
    if (this.basket.length == 1) {
      this.finishExperiment();
    }
  }

  finishExperiment() {
    this.execution["clickedRoutes"] = JSON.stringify(this.clickedRoutes);
    this.execution["usedFilters"] = JSON.stringify(this.filters);
    this.execution["clicks"] = JSON.stringify(this.clicks);

    this.routerService.clearNumberNavigationClicks();
    const userId = this.loginService.currentUser()?.id;
    if (userId && this.experimentTest) {
      this.experimentFinished = true;
      this.timeService.stopTimer();
      this.execution["finishedExecutionAt"] = new Date();
      this.experimentService.setLastFinishedExperimentTest(this.experimentTest.id);
      this.experimentService.getExperimentExecutionByStateAndTest(userId, this.experimentTest.id, 'INPROCESS').subscribe((exec) => {
        this.execution["experimentTestExecutionId"] = exec.id;
        this.loading = true;
        this.experimentService.saveMentalModelExperimentExecution(this.execution).subscribe(() => {
          setTimeout(() => {
            this.loading = false;
            this.router.navigateByUrl("/test/" + this.experimentTest?.id + "/feedback")
            this.toasterService.success("Vielen Dank. Sie haben das Experiment erfolgreich abgeschlossen.")
          }, 2000);
        })
      });
    }
  }

  updateBreadcrumbsBehaviour() {
    this.execution["usedBreadcrumbs"] = true;
  }

  private fetchExperimentTest() {
    const experimentTestId = this.routerService.getExperimentTestIdByUrl(this.router.url, "mental-model");
    this.experimentService.getExperimentTest(experimentTestId).subscribe((test) => {
      this.experimentTest = test;
      this.product = JSON.parse(this.experimentTest.configuration);

    })
  }

  increaseNumberSearchBarUsed() {
    this.execution["numberUsedSearchBar"] = this.execution["numberUsedSearchBar"] + 1
    if (this.execution["numberUsedSearchBar"] >= 1) {
      this.increaseFailedClicks();
    }

  }

  increaseNumberClicks($event: MouseEvent) {
    if (!this.firstClick) {
      this.execution["timeToFirstClick"] = this.timeService.getCurrentTime();
      this.execution["firstClick"] = ($event.target as HTMLElement).innerHTML;
      this.firstClick = ($event.target as HTMLElement).innerHTML;
    }
    this.clicks.push(($event.target as HTMLElement).innerHTML);
    this.execution['numberClicks'] = this.execution['numberClicks'] + 1;
  }

  increaseFailedClicks() {
    this.execution['failedClicks'] = this.execution['failedClicks'] + 1;
  }

  increaseNumberUsedSearchBar(){
    this.execution["numberUsedSearchBar"] =  this.execution["numberUsedSearchBar"] + 1;
    const n = this.execution["numberUsedSearchBar"];
    if (n >=1){
      this.increaseFailedClicks();
    }
  }
  setClickedOnSearchBar() {
    this.execution["clickedOnSearchBar"] = true;
    this.execution["timeToClickSearchBar"] = this.timeService.getCurrentTime();
  }


  findProducts(filterText: string) {
    if (filterText.split(" ").length > 1){
      this.execution["searchParameters"] += " ";
    }
    this.execution["searchParameters"] += filterText;
    this.filterService.dispatchFilterText(filterText)
  }

  private buildBreadcrumbs() {
    this.links = this.routerService.buildBreadcrumbs(this.links, this.currentRoute);
  }

  increaseToggledMenu($event: number) {
    this.execution["numberToggledMenu"] = this.execution["numberToggledMenu"] + 1;
    if ($event > 1) {
      this.increaseFailedClicks();
    }
  }

  updateErrorClickBehaviour($event: MouseEvent ) {
    const click =  ($event.target as HTMLElement).innerHTML;
    if (!routerLinks[click]){
      this.increaseFailedClicks();
    }
  }

}
