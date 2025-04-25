import {Component, inject, OnInit} from '@angular/core';
import {
  ExperimentTestInstructionComponent
} from '../../experiment-test-instruction/experiment-test-instruction.component';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
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
import {SettingService} from '../../../services/setting.service';
import {FilterSelectDropdownComponent} from '../../../filter-select-dropdown/filter-select-dropdown.component';
import {LoginService} from '../../../services/login.service';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MentalModelShopConfiguration} from '../../../models/mental-model-shop-configuration';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-mental-model-create-interface',
  imports: [
    ExperimentTestInstructionComponent,
    MatFabButton,
    MatIcon,
    NgForOf,
    RouterOutlet,
    SearchBarComponent,
    NgClass,
    SideMenuComponent,
    AutoCompleteComponent,
    NgIf,
    FilterSelectDropdownComponent,
    MatCard,
    MatCardContent,
    MatProgressSpinner,
    MatTooltip,
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
  settingsService: SettingService = inject(SettingService);
  loginService: LoginService = inject(LoginService);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  currentInstructionStep: number = 0;
  instructions: string[] = [];
  basket: any[] = [];
  categoryLinks: string[] = [];
  products: any[] = [];
  productCategories: ProductType[] = [];
  parentProductCategories: string[] = ["IT und Multimedia", "Haushalt", "Audio"];
  currentRoute: string = "Home";
  parentRoute: string | null = null;
  parentCategory: string | null = null;
  routes = routerLinks
  dummyCategories: string[] = ["PC", "Notebook", "Smartphone", "Keypad"]
  experimentTest?: ExperimentTest;
  loading: boolean = false;
  product: any;
  latestUserNavigationConfig?: MentalModelShopConfiguration

  selectedInterFace: MentalModelShopConfiguration = {
    autoCompleteBottom: false,
    autoCompleteTop: false,
    filter: false,
    megaDropDown: false,
    navBarBottom: false,
    navBarTop: false,
    searchBarBottom: false,
    searchBarTop: false,
    shoppingCartBottomLeft: false,
    shoppingCartBottomRight: false,
    shoppingCartTopLeft: false,
    sideMenuLeft: false,
    sideMenuRight: false,
    userId: undefined,
    shoppingCartTopRight: false,
    breadcrumbs: false,
    createdAt: new Date(),
    experimentTestId: 0,
    menuToggleIcon: false,
    menuTitle: false,
    offCanvasMenu: false,
  };



  selectElement(element: string, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    event.stopImmediatePropagation();

    if (this.selectedInterFace[element]) {
      this.selectedInterFace[element] = false;
      return;
    }
    if (element.includes('shoppingCartBottom') && (this.selectedInterFace.shoppingCartTopLeft || this.selectedInterFace.shoppingCartTopRight)) {
      return;
    } else if (element.includes('shoppingCartTop') && (this.selectedInterFace.shoppingCartBottomRight || this.selectedInterFace.shoppingCartBottomLeft)) {
      return;
    } else if (element.includes('searchBarTop') && (this.selectedInterFace.autoCompleteTop || this.selectedInterFace.autoCompleteBottom)) {
      return;
    } else if (element.includes('autoComplete') && (this.selectedInterFace.searchBarTop || this.selectedInterFace.searchBarBottom)) {
      return;
    } else if (element.includes('sideMenuRight') && this.selectedInterFace.sideMenuLeft) {
      return;
    } else if (element.includes('sideMenuLeft') && this.selectedInterFace.sideMenuRight) {
      return;
    } else if (element.includes("megaDropDown") && (this.selectedInterFace.sideMenuLeft || this.selectedInterFace.sideMenuRight)) {
      return;
    }
    else if ((element.includes("menuTitle") || element.includes("menuToggleIcon")) && (this.selectedInterFace.sideMenuRight)){
      return;
    }
    else if (element.includes("sideMenuRight") && (this.selectedInterFace.menuTitle || this.selectedInterFace.menuToggleIcon)){
      return;
    }
    else if (element.includes('sideMenuRight') && (this.selectedInterFace.menuToggleIcon || this.selectedInterFace.menuTitle)){
      this.selectedInterFace.menuTitle = false;
      this.selectedInterFace.menuToggleIcon = false;
    }
    else if (element.includes("offCanvas") && this.selectedInterFace.sideMenuRight){
      return;
    }
    else if (element.includes("sideMenu") && this.selectedInterFace.megaDropDown) {
      return;
    } else {
      this.selectedInterFace[element] = true;
    }
    this.selectedInterFace["offCanvasMenu"] = this.selectedInterFace["menuToggleIcon"] && this.selectedInterFace["sideMenuLeft"];

  }

  isSelected(elementName: string): boolean {
    return <boolean>this.selectedInterFace[elementName];
  }

  setCurrentRoute($event: string) {

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

  saveUserNavigationSelection() {
    this.loading = true;
    if (this.selectedInterFace["id"]){
      this.updateUserNavigationConfig();
      return;
    }
    this.selectedInterFace["userId"] = this.loginService.currentUser()?.id;
    this.selectedInterFace["createdAt"] = new Date();
    this.selectedInterFace["experimentTestId"] = this.experimentTest?.id??0;
    this.settingsService.saveShopNavigationConfiguration(this.selectedInterFace).subscribe((config) => {
      if (config) {
        this.displayProgressBar();
      }
    });
  }


  displayProgressBar(){
    setTimeout(() => {
      const parentRoute = this.route.parent?.parent?.parent;
      this.loading = false;
      this.router.navigateByUrl("test/execute/mental-model/" + this.experimentTest?.id + "/user-shop/" + this.loginService.currentUser()?.id);
    }, 2000);
  }

  private fetchExperimentTest() {
    const experimentTestId = this.routerService.getExperimentTestIdByUrl(this.router.url, "adaptability")
    this.experimentService.getExperimentTest(experimentTestId).subscribe((test) => {
      this.experimentTest = test;
      this.product = JSON.parse(this.experimentTest.configuration);
      this.fetchLatestUserNavigationConfiguration();

    });

  }
  updateUserNavigationConfig(){
    this.settingsService.updateUserShopNavigationConfiguration(this.selectedInterFace).subscribe((config) => {
      this.selectedInterFace = config;
      this.displayProgressBar();
    });
  }


  private fetchLatestUserNavigationConfiguration() {
    const userId = this.loginService.currentUser()?.id;
    if (userId && this.experimentTest?.id) {
      this.settingsService.getShopNavigationConfig(userId, this.experimentTest.id).subscribe((config) => {
        this.latestUserNavigationConfig = config;
        if (this.latestUserNavigationConfig){
          this.selectedInterFace = this.latestUserNavigationConfig;
        }
      });
    }
  }
}
