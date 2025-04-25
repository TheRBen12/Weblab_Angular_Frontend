import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {
  ExperimentTestInstructionComponent
} from '../../experiment-test-instruction/experiment-test-instruction.component';
import {SearchBarComponent} from '../../../search-bar/search-bar.component';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NavigationEnd, NavigationStart, Router, RouterOutlet} from '@angular/router';
import {BasketComponent} from '../../../basket/basket.component';
import {SideMenuComponent} from '../side-menu/side-menu.component';
import {FilterService} from '../../../services/filter.service';
import {ProductType} from '../../../models/product-category';
import {ProductService} from '../../../services/product.service';
import {filter} from 'rxjs';
import {RouterService} from '../../../services/router.service';
import {TimeService} from '../../../services/time.service';
import {ExperimentService} from '../../../services/experiment.service';
import {LoginService} from '../../../services/login.service';
import {ExperimentTest} from '../../../models/experiment-test';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {NgIf} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {routerLinks} from '../routes';

@Component({
  selector: 'app-mental-model-right-side-navigation',
  imports: [
    ExperimentTestInstructionComponent,
    SearchBarComponent,
    MatFabButton,
    MatIcon,
    RouterOutlet,
    BasketComponent,
    SideMenuComponent,
    MatCard,
    MatCardContent,
    MatProgressSpinner,
    NgIf
  ],
  templateUrl: './mental-model-right-side-navigation.component.html',
  standalone: true,
  styleUrl: './mental-model-right-side-navigation.component.css'
})
export class MentalModelRightSideNavigationComponent implements OnInit, OnDestroy {
  filterService = inject(FilterService);
  productService = inject(ProductService);
  routerService = inject(RouterService);
  timeService: TimeService = inject(TimeService);
  experimentService: ExperimentService = inject(ExperimentService);
  loginService = inject(LoginService);
  instructions = ["Suchen Sie das unten spezifizierte Produkt", "Legen Sie es in den Warenkorb", "Gehen Sie zur Kasse"];
  helpInstructions = ["Sie befinden sich in der falschen Produktkategorie. Finden Sie die passende Kategorie."]
  showHelpInstructions = false;
  targetRoutes = ["IT und Multimedia", "PC und Notebooks", "Notebook"];
  categoryLinks: string[] = [];
  productCategories: ProductType[] = [];
  currentRoute: string = "Home";
  parentRoute: string | null = null;
  parentCategory: string | null = null;
  router: Router = inject(Router);
  showBasket: boolean = false;
  basket: any[] = [];
  currentInstructionStep: number = 0;
  firstClick: any | null = null;
  clickedRoutes: { [key: string]: string } = {};
  usedFilters: string[] = [];
  experimentTest?: ExperimentTest;
  loading: boolean = false;
  currentType?: ProductType;
  experimentFinished: boolean = false;
  clicks: string[] = [];

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
    "timeToClickSearchBar": 0,
    "clicks": "",
    "searchParameters": ""
  };


  constructor(private readonly toasterService: ToastrService) {
  }

  canDeactivate() {
    if (!this.experimentFinished) {
      return confirm("Achtung Sie sind, dabei das Experiment zu verlassen. All Ihre Änderungen werden nicht gespeichert. Wollen Sie fortfahren.")
    } else {
      return true;
    }
  }


  toggleBasket() {
    if (this.showBasket){
      this.increaseFailedClicks();
    }
    if (!this.execution["timeToClickShoppingCart"]){
      this.execution["timeToClickShoppingCart"] = this.timeService.getCurrentTime();
    }
    this.showBasket = !this.showBasket;
  }

  filterProducts(filterText: string) {
    this.execution["searchParameters"] += filterText + " ";
    this.filterService.dispatchFilterText(filterText)
    this.execution["numberUsedSearchBar"] = this.execution["numberUsedSearchBar"] + 1
    localStorage.setItem("numberUsedSearchBar", this.execution["numberUsedSearchBar"]);
    const n = this.execution["numberUsedSearchBar"];
    if (n >=1){
     this.increaseFailedClicks();
    }

  }

  increaseFailedClicks(){
    this.execution['failedClicks'] =  this.execution['failedClicks'] + 1;
    localStorage.setItem("failedClicks", this.execution['failedClicks']);
  }


  ngOnInit(): void {
    this.timeService.startTimer();
    this.fetchExperimentTest();

    this.productService.getFilterUsedSubscription().subscribe((filter) => {
      if (filter != "" && filter != undefined) {
        this.execution["usedFilter"] = true;
        this.usedFilters.push(filter);
      }
    })
    this.execution["numberClicks"] = localStorage.getItem('numberClicks') ?? 0;
    this.execution["failedClicks"] = localStorage.getItem('failedClicks') ?? 0;
    this.execution["numberUsedSearchBar"] = Number(localStorage.getItem('numberUsedSearchBar')) ?? 0
    const clickedRoutes = localStorage.getItem("clickedRoutes");
    if (clickedRoutes) {
      this.execution["clickedRoutes"] = clickedRoutes;
      this.clickedRoutes = JSON.parse(clickedRoutes);
    }

    const filters = localStorage.getItem("filters");
    if (filters) {
      this.usedFilters = JSON.parse(filters);
      this.execution["usedFilters"] = filters;
    }

    this.productService.getBasket();
    this.productService.getBasketSubscription().subscribe((basket) => {
      this.basket = basket;
      if (this.basket.length > 0) {
        this.showBasket = true;
        this.currentInstructionStep = 2;
      }
    });

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
        if (this.currentType?.parentType?.name == this.currentRoute) {
          this.currentType = this.currentType.parentType;
        } else {
          this.currentType = this.productCategories.find(type => type.name == this.currentRoute);
        }
        this.buildParentRoute();
        this.fetchProductCategories(this.currentRoute).subscribe((categories) => {
          this.productCategories = categories
          this.categoryLinks = this.routerService.buildValueKeyPairForCategoryLinks(this.productCategories);
        });
      });
  }

  buildParentRoute() {
    const parentRouteData = this.routerService.rebuildParentRoute(this.currentRoute, this.productCategories, this.currentType)
    this.parentCategory = parentRouteData.parentCategory;
    this.parentRoute = parentRouteData.parentRoute;
  }

  private fetchProductCategories(parentRoute: string) {
    return this.productService.fetchSubCategoriesObjects(parentRoute);
  }

  updateInstructions(route: string) {
    if (this.targetRoutes.indexOf(route) == -1) {
      this.execution['failedClicks'] = this.execution['failedClicks'] +1;
      localStorage.setItem('failedClicks', this.execution['failedClicks']);
    }
    if (this.clickedRoutes[route] != undefined && this.targetRoutes.indexOf(route) != -1) {
      this.execution['failedClicks'] = this.execution['failedClicks'] + 1;
      localStorage.setItem('failedClicks', this.execution['failedClicks'])
    }
    this.clickedRoutes[route] = new Date().toISOString();
    localStorage.setItem("clickedRoutes", JSON.stringify(this.clickedRoutes));

    if (Object.values(this.clickedRoutes).length == 0) {
      this.execution['timeToClickFirstCategory'] = this.timeService.getCurrentTime();
    }
    this.showHelpInstructions = this.targetRoutes.indexOf(route) == -1 && this.currentRoute != "Home";
  }

  checkToFinishExperiment() {
    if (this.basket.length == 1) {
      this.finishExperiment();
    }
  }

  private finishExperiment() {
    this.loading = true;
    this.execution["clickedRoutes"] = JSON.stringify(this.clickedRoutes);
    this.execution["usedFilters"] = JSON.stringify(this.usedFilters);
    this.execution["finishedExecutionAt"] = new Date();
    this.execution["clicks"] = JSON.stringify(this.clicks);
    const userId = this.loginService.currentUser()?.id;
    this.routerService.clearNumberNavigationClicks();
    if (userId && this.experimentTest) {
      this.experimentService.setLastFinishedExperimentTest(this.experimentTest.id);
      this.timeService.stopTimer();
      this.experimentFinished = true;
      this.experimentService.getExperimentExecutionByStateAndTest(userId, this.experimentTest.id, "INPROCESS").subscribe((exec) => {
        this.execution['experimentTestExecutionId'] = exec.id;
        this.experimentService.saveMentalModelExperimentExecution(this.execution).subscribe(() => {
          setTimeout(() => {
            this.loading = false;
            this.router.navigateByUrl("test/" + this.experimentTest?.id + "/feedback");
            this.toasterService.success("Vielen Dank! Sie haben das Experiment erfolgreich abgeschlossen");
          }, 2000)
        });

      });
    }
  }

  updateClickBehaviour(event: MouseEvent) {
    if (!this.firstClick) {
      this.firstClick = (event.target as HTMLElement).innerHTML;
    }
    this.clicks.push((event.target as HTMLElement).innerHTML);
    this.execution['numberClicks'] = this.execution['numberClicks']+1;
    localStorage.setItem('numberClicks', this.execution['numberClicks']);
  }

  updateSearchBarBehaviour() {
    if (this.execution['clickedOnSearchBar'] == false){
      this.execution["timeToClickSearchBar"] = this.timeService.getCurrentTime();
    }
    this.execution['clickedOnSearchBar'] = true;

  }

  private fetchExperimentTest() {
    const experimentId = this.routerService.getExperimentTestIdByUrl(this.router.url, 'mental-model');
    this.experimentService.getExperimentTest(experimentId).subscribe((test) => {
      this.experimentTest = test;
    })
  }

  updateErrorClickBehaviour($event: MouseEvent ) {
    const click =  ($event.target as HTMLElement).innerHTML;
    if (!routerLinks[click]){
      this.increaseFailedClicks();
    }
  }

  ngOnDestroy(): void {
    localStorage.removeItem("parentRoute")
    localStorage.removeItem('clickedRoutes');
    localStorage.removeItem('numberClicks');
    localStorage.removeItem('failedClicks');
    localStorage.removeItem('numberUsedSearchBar');
  }
}
