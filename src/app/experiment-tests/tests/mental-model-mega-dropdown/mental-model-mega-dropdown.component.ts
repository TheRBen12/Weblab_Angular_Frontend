import {Component, inject, OnInit} from '@angular/core';
import {BasketComponent} from '../../../basket/basket.component';
import {
  ExperimentTestInstructionComponent
} from '../../experiment-test-instruction/experiment-test-instruction.component';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {ProductService} from '../../../services/product.service';
import {RouterService} from '../../../services/router.service';
import {FilterService} from '../../../services/filter.service';
import {ProductType} from '../../../models/product-category';
import {routerLinks} from '../routes';

import {SearchBarComponent} from '../../../search-bar/search-bar.component';
import {CommonModule} from '@angular/common';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MegaDropDownMenuComponent} from '../../../mega-drop-down-menu/mega-drop-down-menu.component';
import {ExperimentService} from '../../../services/experiment.service';
import {ExperimentTest} from '../../../models/experiment-test';
import {LoginService} from '../../../services/login.service';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {ToastrService} from 'ngx-toastr';
import {TimeService} from '../../../services/time.service';

@Component({

  animations: [
    trigger('hoverState', [
      state('open', style({'opacity': 1,})),
      state('closed', style({'opacity': 0})),
      transition('open => closed', [animate('500ms ease-out')]),
      transition('closed => open', [animate('500ms ease-in')]),

    ])
  ],
  selector: 'app-mental-model-mega-dropdown',
  imports: [
    CommonModule,
    BasketComponent,
    ExperimentTestInstructionComponent,
    MatFabButton,
    MatIcon,
    RouterOutlet,
    SearchBarComponent,
    RouterLink,
    MegaDropDownMenuComponent,
    MatCard,
    MatCardContent,
    MatProgressSpinner,
  ],
  templateUrl: './mental-model-mega-dropdown.component.html',
  standalone: true,
  styleUrl: './mental-model-mega-dropdown.component.css'
})
export class MentalModelMegaDropdownComponent implements OnInit {

  productService = inject(ProductService);
  routerService = inject(RouterService);
  filterService = inject(FilterService);
  experimentService: ExperimentService = inject(ExperimentService);
  loginService: LoginService = inject(LoginService);
  timeService: TimeService = inject(TimeService);
  router: Router = inject(Router);
  targetRoutes = ["IT und Multimedia", "PC und Notebooks", "PC"]
  helpInstructions = ["Sie befinden sich in der falschen Produktkategorie. Finden Sie die passende Kategorie."]
  currentInstructionStep: number = 0;
  instructions: string[] = [];
  basketIsHidden: boolean = true;
  basket: any[] = [];
  categoryLinks: string[] = [];
  parentCategoryLinks: string[] = [];
  products: any[] = [];
  productCategories: ProductType[] = [];
  parentProductCategories: ProductType[] = [];
  currentRoute: string = "Home";
  parentRoute: string | null = null;
  parentCategory: string | null = null;
  currentType: ProductType | undefined = undefined;
  routes = routerLinks
  showSubNavMenu = false;
  private clickedRoutes: { [key: string]: string } = {};
  showHelpInstructions: boolean = false;
  loading: boolean = false;
  usedFilters: string[] = [];
  private experimentTest?: ExperimentTest;
  firstClick?: string;
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
  };


  constructor(private readonly toasterService: ToastrService) {
    this.instructions = ["Finden Sie die passende Produktkategorie des unten spezifizierten Produktes"]
  }


  ngOnInit(): void {
    this.productService.getFilterUsedSubscription().subscribe((filter) => {
      if (filter != ""){
        this.execution['usedFilters'] = true;
        this.usedFilters.push(filter);
        this.execution['usedFilters'] = this.execution['usedFilters'] +" " + JSON.stringify(this.usedFilters);
        this.saveExecutionTemporarily(this.execution);
      }
    })
    const exec = localStorage.getItem('exec');
    if (exec){
      this.execution = JSON.parse(exec);
    }
    this.productService.getBasket();
    this.productService.getBasketSubscription().subscribe((basket) => {
      this.basket = basket;
    })
    this.fetchParentProductTypes();
    this.fetchProducts();
    this.fetchProductTypes(this.currentRoute);
    this.fetchExperimentTest();
  }


  private fetchExperimentTest() {
    const experimentId = this.routerService.getExperimentTestIdByUrl(this.router.url, 'mental-model');
    this.experimentService.getExperimentTest(experimentId).subscribe((test) => {
      this.experimentTest = test;
    })
  }

  openBasket() {
    this.basketIsHidden = !this.basketIsHidden;
  }

  finishExperiment() {
    const userId = this.loginService.currentUser()?.id;
    if (userId && this.experimentTest){
      this.experimentService.getExperimentExecutionByStateAndTest(userId, this.experimentTest.id, 'INPROCESS').subscribe((exec) => {
        this.execution["experimentTestExecutionId"] = exec.id;
        this.loading = true;
        this.experimentService.saveMentalModelExperimentExecution(this.execution).subscribe(() => {
          setTimeout(() => {
            this.loading = false;
            this.router.navigateByUrl('/tests/'+this.experimentTest?.experiment?.id);
            this.toasterService.success("Vielen Dank. Sie haben das Experiment erfolgreich abgeschlossen.")
          }, 2000);
        })
      });
    }
  }

  setCurrentRoute(route: string) {
    if (this.targetRoutes.indexOf(route) == -1) {
      this.execution['failedClicks'] = this.execution['failedClicks'] + 1;
      this.saveExecutionTemporarily(this.execution);


    }
    this.clickedRoutes[route] = new Date().toISOString();
    this.execution['clickedRoutes'] = JSON.stringify(this.clickedRoutes);
    this.saveExecutionTemporarily(this.execution);

  }

  filterProducts(text: string) {
    const n =   this.execution['numberUsedSearchBar'];
    if (n >= 1){
      this.execution['failedClicks'] =  this.execution['failedClicks'] + 1;
    }
    this.execution['numberUsedSearchBar'] = this.execution['numberUsedSearchBar'] + 1;
    this.saveExecutionTemporarily(this.execution);
    this.filterService.dispatchFilterText(text);
  }


  fetchProducts() {
    this.productService.getAllProducts().subscribe((products) => {
      this.products = products;
    })
  }

  fetchParentProductTypes() {
    this.productService.fetchSubCategoriesObjects("Home").subscribe((categories) => {
      this.parentProductCategories = categories;
      this.parentCategoryLinks = this.routerService.buildValueKeyPairForCategoryLinks(this.parentProductCategories);
    });
  }

  fetchProductTypes(currentRoute: string) {
    this.productService.fetchSubCategoriesObjects(currentRoute).subscribe((categories) => {
      this.productCategories = categories;
      this.categoryLinks = this.routerService.buildValueKeyPairForCategoryLinks(this.productCategories);
    });
  }

  showSubMenu(link: string) {
    this.currentRoute = link
    this.showSubNavMenu = true;
  }

  hideSubMenu() {
    this.showSubNavMenu = false;
  }

  updateClickBehaviour(event: MouseEvent) {
    if (!this.firstClick){
      this.firstClick = (event.target as HTMLElement).innerHTML;
      this.execution['firstClick'] = this.firstClick;
    }
    this.execution['numberClicks'] = this.execution['numberClicks'] + 1;
    this.saveExecutionTemporarily(this.execution);
  }

  saveExecutionTemporarily(execution: any) {
    localStorage.setItem('execution', JSON.stringify(execution));
  }

  checkToFinishExperiment() {
    if (this.basket.length == 1 && this.basket[0].type == "PC") {
      this.finishExperiment();
    }
  }
}
