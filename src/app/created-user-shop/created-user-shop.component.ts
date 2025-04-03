import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {SettingService} from '../services/setting.service';
import {config, filter, switchMap} from 'rxjs';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterLink, RouterOutlet} from '@angular/router';
import {MentalModelShopConfiguration} from '../models/mental-model-shop-configuration';
import {
  ExperimentTestInstructionComponent
} from '../experiment-tests/experiment-test-instruction/experiment-test-instruction.component';
import {BasketComponent} from '../basket/basket.component';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {SearchBarComponent} from '../search-bar/search-bar.component';
import {SideMenuComponent} from '../experiment-tests/tests/side-menu/side-menu.component';
import {AutoCompleteComponent} from '../auto-complete/auto-complete.component';
import {MegaDropDownMenuComponent} from '../mega-drop-down-menu/mega-drop-down-menu.component';
import {ProductType} from '../models/product-category';
import {ProductService} from '../services/product.service';
import {RouterService} from '../services/router.service';
import {FilterService} from '../services/filter.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {TimeService} from '../services/time.service';
import {ExperimentTest} from '../models/experiment-test';
import {ExperimentService} from '../services/experiment.service';
import {LoginService} from '../services/login.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  animations: [
    trigger('hoverState', [
      state('open', style({'opacity': 1,})),
      state('closed', style({'opacity': 0})),
      transition('open => closed', [animate('500ms ease-out')]),
      transition('closed => open', [animate('500ms ease-in')]),

    ])
  ],
  selector: 'app-created-user-shop',
  imports: [
    ExperimentTestInstructionComponent,
    BasketComponent,
    MatCard,
    MatCardContent,
    MatFabButton,
    MatIcon,
    MatProgressSpinner,
    NgIf,
    RouterOutlet,
    SearchBarComponent,
    SideMenuComponent,
    AutoCompleteComponent,
    MegaDropDownMenuComponent,
    NgForOf,
    RouterLink,
    NgClass
  ],
  templateUrl: './created-user-shop.component.html',
  standalone: true,
  styleUrl: './created-user-shop.component.css'
})
export class CreatedUserShopComponent implements OnInit, OnDestroy {
  settingService: SettingService = inject(SettingService);
  loginService: LoginService = inject(LoginService);

  productService: ProductService = inject(ProductService);
  routerService = inject(RouterService);
  filterService: FilterService = inject(FilterService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  timeService: TimeService = inject(TimeService);
  experimentService: ExperimentService = inject(ExperimentService);
  experimentTest!: ExperimentTest

  private clickedRoutes: { [key: string]: string } = {};
  firstClick: string | null = null;
  usedFilters: string[] = [];
  navigationConfig!: MentalModelShopConfiguration;
  categoryLinks: string[] = [];
  productCategories: ProductType[] = [];
  currentRoute: string = "Home";
  parentRoute: string | null = null;
  parentCategory: string | null = null;
  parentTypes: ProductType[] = [];
  products: any[] = [];
  loading: boolean = false;
  basket: any[] = [];
  showBasket: boolean = false;
  currentInstructionStep: number = 0;
  targetRoutes = ["Haushalt", "Kaffeemaschine"];
  targetInstruction: string = "Vorher haben Sie Ihre eigene Schnittstelle zusammengestellt. Nun müssen Sie diese verwenden " +
    "um ein Produkt zu finden, welche die unten spezifizierten Eigenschaften erfüllt.";
  instructions = ["Finden Sie ein Produkt, welches die folgenden Eigenschaften aufweist."];
  helpInstructions = ["Sie suchen in der falschen Kategorie, finden Sie die korrekte Produktkategorie"];
  showHelpInstructions: boolean = false;

  execution: {
    [key: string]: any
  } = {
    'experimentTestExecutionId': null,
    'failedClicks': 0,
    'numberClicks': 0,
    'clickedRoutes': "",
    'usedFilters': "",
    'usedFilter': false,
    'finishedExecutionAt': null,
    'numberUsedSearchBar': 0,
    'timeToClickFirstCategory': null,
    'clickedOnSearchBar': false,
    'firstClick': "",
    'timeToClickSearchBar': null
  };
  showSubNavMenu: boolean = false;
  parentCategoryLinks: string[] = [];
  constructor(private readonly toasterService: ToastrService) {
  }

  ngOnInit(): void {
    this.fetchExperimentTest();
    this.timeService.startTimer();

    this.productService.getFilterUsedSubscription().subscribe((filter) => {
      if (filter != "") {
        if (this.usedFilters.indexOf(filter) != -1){
          this.increaseFailedClicks();
        }
        this.usedFilters.push(filter);
        this.execution["usedFilter"] = true;
        this.execution["usedFilters"] = JSON.stringify(this.usedFilters);
      }
    })
    this.fetchProducts();
    this.route.paramMap.pipe(
      switchMap(params => {
        const userId = Number(params.get('userId'));
        return this.getUserNavigationConfig(userId);
      })
    ).subscribe((config) => {
      this.navigationConfig = config;
      this.productService.updateFilterConfiguredByUser(config);
    });


    this.productService.getBasket();
    this.productService.getBasketSubscription().subscribe((basket) => {
      this.basket = basket;
      if (this.basket.length > 0) {
        this.showBasket = true;
        this.currentInstructionStep = 2;
      }
    });

    this.fetchProductCategories("Home").subscribe((categories) => {
      this.parentTypes = categories;
      this.parentCategoryLinks = this.routerService.buildValueKeyPairForCategoryLinks(this.parentTypes);

    });

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

  buildParentRoute() {
    const parentRouteData = this.routerService.rebuildParentRoute(this.currentRoute, this.productCategories)
    this.parentCategory = parentRouteData.parentCategory;
    this.parentRoute = parentRouteData.parentRoute;
  }

  getUserNavigationConfig(userId: number) {
    return this.settingService.getShopNavigationConfig(userId);
  }

  showSubMenu(link: string) {
    if (this.navigationConfig.megaDropDown){
      this.currentRoute = link
      this.showSubNavMenu = true;
    }

  }

  setCurrentRoute($event: string) {
    this.clickedRoutes[$event] = new Date().toISOString();
    if (this.targetRoutes.indexOf($event) == -1 || this.clickedRoutes[$event] != undefined) {
      this.increaseFailedClicks();
      this.showHelpInstructions = true;
    }
    this.showHelpInstructions = false;
    if (!this.execution["timeToClickFirstCategory"]){
      this.execution["timeToClickFirstCategory"] = this.timeService.getCurrentTime();
    }

  }

  private fetchProducts() {
    this.productService.getAllProducts().subscribe((products) => {
      this.products = products;
    })
  }

  private fetchProductCategories(currentRoute: string) {
    return this.productService.fetchSubCategoriesObjects(currentRoute);
  }

  toggleBasket() {
    this.showBasket = !this.showBasket;
  }

  filterProducts(filterText: string) {
    this.filterService.dispatchFilterText(filterText)
    this.execution["numberUsedSearchBar"] = this.execution["numberUsedSearchBar"] + 1;
  }

  hideSubMenu() {
    this.showSubNavMenu = false;
  }

  finishExperiment() {
    this.execution['finishedExecutionAt'] = new Date();
    this.execution["clickedRoutes"] = JSON.stringify(this.clickedRoutes);
    const userId = this.loginService.currentUser()?.id;
    if (userId){
      this.experimentService.getExperimentExecutionByStateAndTest(userId, this.experimentTest.id, "INPROCESS").subscribe((exec) => {
        this.execution["experimentTestExecutionId"] = exec.id;
        this.loading = true;
        this.experimentService.saveMentalModelExperimentExecution(this.execution).subscribe(() => {
          setTimeout(() => {
            this.loading = false;
            this.router.navigateByUrl("tests/"+this.experimentTest?.experiment?.id);
            this.timeService.stopTimer();
            this.toasterService.success("Vielen Dank. Sie haben das Experiment erfolgreich abgeschlossen");
          }, 2000)

        });

      });
    }
  }

  updateClickBehaviour(event: MouseEvent) {
    if (!this.firstClick) {
      this.firstClick = (event.target as HTMLElement).innerHTML;
    }
    this.execution["numberClicks"] = this.execution["numberClicks"] + 1;
  }

  increaseUsedSearchBar() {
    this.execution["numberUsedSearchBar"] = this.execution["numberUsedSearchBar"] + 1;

  }

  private increaseFailedClicks() {
    this.execution["failedClicks"] = this.execution["failedClicks"] + 1;

  }

  updateTimeToClickSearchBar() {
    this.execution["usedSearchBar"] = true;
    if (!this.execution["timeToClickSearchBar"]){
      this.execution["timeToClickSearchBar"] = this.timeService.getCurrentTime();
    }

  }

  ngOnDestroy(): void {
    this.timeService.stopTimer();
  }

  private fetchExperimentTest() {
    const expTestId = this.routerService.getExperimentTestIdByUrl(this.router.url, "mental-model")
    this.experimentService.getExperimentTest(expTestId).subscribe((test) => {
      this.experimentTest = test;
    })
  }

  checkToFinishExperiment() {
    if (this.basket.length > 0){
      this.finishExperiment();
    }
  }
}
