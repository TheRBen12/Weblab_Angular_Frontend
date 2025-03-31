import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {NavigationEnd, NavigationStart, Router, RouterOutlet} from '@angular/router';
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
import {TimeService} from '../../../services/time.service';
import {ExperimentService} from '../../../services/experiment.service';
import {LoginService} from '../../../services/login.service';
import {ExperimentTest} from '../../../models/experiment-test';
import {filter} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {NgIf} from '@angular/common';


@Component({
  selector: 'app-mental-model-left-side-navigation',
  imports: [
    MatIcon,
    RouterOutlet,
    SideMenuComponent,
    BasketComponent,
    MatFabButton,
    ExperimentTestInstructionComponent,
    AutoCompleteComponent,
    MatCard,
    MatCardContent,
    MatProgressSpinner,
    NgIf
  ],
  templateUrl: './mental-model-left-side-navigation.component.html',
  standalone: true,
  styleUrl: './mental-model-left-side-navigation.component.css'
})
export class MentalModelLeftSideNavigationComponent implements OnInit, OnDestroy{
  filterService = inject(FilterService);
  productService = inject(ProductService);
  routerService = inject(RouterService);
  timeService: TimeService = inject(TimeService);
  experimentService: ExperimentService = inject(ExperimentService);
  loginService =inject(LoginService);
  instructions = ["Suchen Sie das unten spezifizierte Produkt", "Legen Sie es in den Warenkorb", "Gehen Sie zur Kasse"];
  helpInstructions = ["Sie befinden sich in der falschen Produktkategorie. Finden Sie die passende Kategorie."]
  showHelpInstructions = false;
  targetRoutes = ["IT und Multimedia", "PC und Notebooks", "Notebooks"]
  categoryLinks: string[] = [];
  productCategories: ProductType[] = [];
  currentRoute: string = "Home";
  parentRoute: string | null = null;
  parentCategory: string | null = null;
  router: Router = inject(Router);
  showBasket: boolean = false;
  basket: any[] = [];
  currentInstructionStep: number = 0;
  execution: { [key: string]: any } = {};
  private firstClick: any|null = null;
  private clickedRoutes: { [key: string]: string } = {};
  private usedFilters : string[] = [];
  private experimentTest?: ExperimentTest;
  loading: boolean = false;
  products: any[] = [];

  constructor(private readonly toasterService: ToastrService) {
    this.instructions = ["Finden Sie die passende Produktkategorie des unten spezifizierten Produktes"]
  }


  filterProducts(filterText: string) {
    this.filterService.dispatchFilterText(filterText)

  }
  increaseFailedClicks(){
      this.execution['failedClicks'] =  this.execution['failedClicks'] + 1;
      localStorage.setItem("failedClicks", this.execution['failedClicks']);
  }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((products) => {
      this.products = products;
    })

    this.fetchExperimentTest();
    this.timeService.startTimer();
    this.execution['usedFilter'] = false;
    this.execution['numberClicks'] = 0;

    this.productService.getFilterUsedSubscription().subscribe((filter) => {
      if (filter != "" && filter != undefined){
        this.execution["usedFilter"] = true;
        this.usedFilters.push(filter);
        localStorage.setItem("usedFilters", JSON.stringify(this.usedFilters));
      }
    })

    this.execution["numberClicks"] = localStorage.getItem('numberClicks')??0;
    this.execution["failedClicks"] = localStorage.getItem('failedClicks') ?? 0;
    this.execution["numberUsedSearchBar"] = Number(localStorage.getItem('numberUsedSearchBar'))??0
    const clickedRoutes = localStorage.getItem("clickedRoutes");
    if (clickedRoutes){
      this.execution["clickedRoutes"] = clickedRoutes;
      this.clickedRoutes = JSON.parse(clickedRoutes);
    }

    const filters = localStorage.getItem("usedFilters");
    if (filters){
      this.usedFilters = JSON.parse(filters);
      this.execution["usedFilters"] = filters;
    }



    this.productService.getBasket();
    this.productService.getBasketSubscription().subscribe((basket) => {
      this.basket = basket;
      if (this.basket.length > 0){
        this.showBasket = true;
        this.currentInstructionStep = 2;
      }
    })


    this.currentRoute = this.routerService.rebuildCurrentRoute(this.router.url.split("/"));
    if (this.currentRoute != "Home") {
      const parentRoute = localStorage.getItem('parentRoute');
      this.fetchProductCategories(parentRoute ?? "Home").subscribe((categories) => {
        this.productCategories = categories;
        this.buildParentRoute();
        this.fetchProductCategories(this.currentRoute).subscribe((categories) => {
          this.productCategories = categories;
          this.categoryLinks = this.routerService.buildValueKeyPairForCategoryLinks(this.productCategories);
        });
      });
    } else {
      this.fetchProductCategories(this.currentRoute).subscribe((categories) => {
        this.productCategories = categories;
        this.categoryLinks = this.routerService.buildValueKeyPairForCategoryLinks(this.productCategories);
      })
    }


    let oldRoute;
    this.router.events
      .pipe(filter(event => (event instanceof NavigationStart)))
      .subscribe((event) => {
        oldRoute = this.routerService.rebuildCurrentRoute(this.router.url.split("/"));
      });

    this.router.events
      .pipe(filter(event => (event instanceof NavigationEnd)))
      .subscribe((sub) => {
        this.currentRoute = this.routerService.rebuildCurrentRoute(this.router.url.split("/"));
        this.buildParentRoute();
        this.fetchProductCategories(this.currentRoute).subscribe((categories) => {
          this.productCategories = categories
          this.categoryLinks = this.routerService.buildValueKeyPairForCategoryLinks(this.productCategories);
        });
      });
  }

  buildParentRoute(){
    const parentRouteData = this.routerService.rebuildParentRoute(this.currentRoute, this.productCategories)
    this.parentCategory = parentRouteData.parentCategory;
    this.parentRoute = parentRouteData.parentRoute;
  }

  private fetchProductCategories(parentRoute: string) {
    return this.productService.fetchSubCategoriesObjects(parentRoute);
  }

  updateInstructions(route: string) {
    if (this.targetRoutes.indexOf(route) == -1) {
      this.showHelpInstructions = true;
      this.execution['failedClicks'] = this.execution['failedClicks'] +1;
      localStorage.setItem('failedClicks', this.execution['failedClicks']);
    }
    else{
      this.showHelpInstructions = false;
    }
    if (this.clickedRoutes[route] != undefined && this.targetRoutes.indexOf(route) != -1) {
      this.execution['failedClicks'] = this.execution['failedClicks'] + 1;
      localStorage.setItem('failedClicks', this.execution['failedClicks']);
    }
    this.clickedRoutes[route] = new Date().toISOString();
    localStorage.setItem("clickedRoutes", JSON.stringify(this.clickedRoutes));
    if (!this.firstClick){
      this.firstClick = route;
      this.timeService.stopTimer();
      this.execution['timeToClickFirstCategory'] = this.timeService.getCurrentTime();
    }
    this.showHelpInstructions = this.targetRoutes.indexOf(route) == -1 && this.currentRoute != "Home";
  }

  checkToFinishExperiment() {
    if (this.basket.length == 1 && this.basket[0].type == "Notebook"){
      this.finishExperiment();
    }
  }

  private finishExperiment() {
    this.loading = true;
    this.execution["clickedRoutes"] = JSON.stringify(this.clickedRoutes);
    this.execution["usedFilters"] = JSON.stringify(this.usedFilters);
    this.execution["finishedExecutionAt"] = new Date();
    const userId = this.loginService.currentUser()?.id;
    if (userId && this.experimentTest){
      this.experimentService.getExperimentExecutionByStateAndTest(userId, this.experimentTest.id, "INPROCESS").subscribe((exec) => {
        this.execution['experimentTestExecutionId'] = exec.id;
        this.experimentService.saveMentalModelExperimentExecution(this.execution).subscribe(() => {

          setTimeout(() => {
            this.loading = false;
            this.router.navigateByUrl("tests/"+this.experimentTest?.experiment?.id);
            this.toasterService.success("Sie haben das Experiment erfolgreich abgeschlossen");

          }, 2000)
        });

      });
    }
  }

  updateClickBehaviour(event: MouseEvent){
    if (!this.firstClick){
      this.firstClick = (event.target as HTMLElement).innerHTML;
    }
    let number =  this.execution['numberClicks'];
    if (number){
      number = number + 1;
      this.execution['numberClicks'] = number;
    }else{
      this.execution['numberClicks'] = 1;
    }
    localStorage.setItem('numberClicks', this.execution['numberClicks']);
  }
  updateSearchBarBehaviour() {
    this.execution['clickedOnSearchBar'] = true;

    this.execution["numberUsedSearchBar"] = this.execution["numberUsedSearchBar"] + 1
    localStorage.setItem("numberUsedSearchBar", this.execution["numberUsedSearchBar"]);
    const n = this.execution["numberUsedSearchBar"];
    if (n >=1){
      this.increaseFailedClicks();
    }

  }

  private fetchExperimentTest() {
    const experimentId = this.routerService.getExperimentTestIdByUrl(this.router.url, 'mental-model');
    this.experimentService.getExperimentTest(experimentId).subscribe((test) => {
      this.experimentTest = test;
    })
  }

  ngOnDestroy(): void {
    localStorage.removeItem("parentRoute")
    localStorage.removeItem('clickedRoutes');
    localStorage.removeItem('numberClicks');
    localStorage.removeItem('failedClicks');
    localStorage.removeItem('numberUsedSearchBar');
  }

  toggleBasket() {
    this.showBasket = !this.showBasket;
  }
}
