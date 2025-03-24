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
import {D} from '@angular/cdk/keycodes';
import {RecallRecognitionExperimentExecution} from '../../../../models/recall-recognition-experiment-execution';
import {LoginService} from '../../../../services/login.service';
import {ExperimentService} from '../../../../services/experiment.service';
import {ExperimentTestExecution} from '../../../../models/experiment-test-execution';
import {ToastrService} from 'ngx-toastr';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {NgIf} from '@angular/common';

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
    MatCard,
    MatCardContent,
    MatProgressSpinner,
    NgIf,
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
  experimentService = inject(ExperimentService);
  router = inject(Router);
  userService: LoginService = inject(LoginService);
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
  experimentTestId: number = 0;
  clickedRoutes: { [key: string]: string } = {};
  failedClicks: number = 0;
  private currentExecution: ExperimentTestExecution|null = null;
  private numberClicks: number = 0;
  loading: boolean = false;
  private clickedOnSearchBar: boolean = false;

  constructor(private cdRef: ChangeDetectorRef, private toastrService: ToastrService) {
    this.instructions = ["Finden Sie die Produktkategorie IT und Multimedia",
      "Finden Sie die Produktkategorie PC und Notebooks",
      "Finden Sie die Produktkategorie Notebooks",
      "Wählen Sie ein Notebook aus",
      "Fügen Sie das Notebook dem Warenkorb hinzu", "Gehen Sie zur Kasse"];
  }

  ngOnInit(): void {
    this.experimentTestId = Number(this.router.url.split("/")[this.router.url.split("/").indexOf("recall-recognition") + 1])
    const id = this.userService.currentUser()?.id
    if (id){
      this.fetchExecutionInProcess(id, this.experimentTestId);
    }
    this.productService.getBasket();
    this.productService.getBasketSubscription().subscribe((basket) => {
      this.basket = basket;
      if (this.basket.length > 0) {
        this.currentInstructionStep = this.instructions.length - 1;
      } else {
        this.currentInstructionStep = this.currentInstructionStep <= 0 ? 0 : this.currentInstructionStep - 1;
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
    if (this.currentRoute != "Home") {
      const parentRoute = localStorage.getItem("parentRoute") ?? "";
      this.productService.fetchSubCategoriesObjects(parentRoute).subscribe((categories) => {
        this.currentType = categories.find(type => type.name == this.currentRoute);
        this.parentCategory = this.currentType?.parentType ? this.currentType.parentType.name : "Home";
        this.parentRoute = this.routerLinks[this.parentCategory];
      });
    }
    this.fetchProductTypes(this.currentRoute);

    const clickedRoutes = localStorage.getItem('clickedRoutes')
    if (clickedRoutes){
      this.clickedRoutes = JSON.parse(clickedRoutes);
    }

    const clicks = Number(localStorage.getItem('numberClicks'));
    if (clicks){
      this.numberClicks = clicks;
    }

  }

  openBasket() {
    this.basketIsHidden = !this.basketIsHidden;
  }

  setCurrentRoute($event: string) {
    if (this.targetRoutes.indexOf($event) == -1) {
      this.failedClicks++;
    }
    this.clickedRoutes[$event] = new Date().toISOString();
    localStorage.setItem('clickedRoutes', JSON.stringify(this.clickedRoutes));
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
    localStorage.removeItem('clickedRoutes');
    localStorage.removeItem('numberClicks');
  }

  finishExperiment($event: number) {
    const id = this.userService.currentUser()?.id
    if (id){
      this.loading = true;
      this.fetchExecutionInProcess(id, this.experimentTestId).subscribe((exec) => {
        this.currentExecution = exec;
        const recallRecognitionExecution: RecallRecognitionExperimentExecution = {
          categoryLinkClickDates: JSON.stringify(this.clickedRoutes),
          experimentTestId: this.experimentTestId,
          failedClicks: this.failedClicks,
          state: "FINISHED",
          userId: this.userService.currentUser()?.id,
          finishedExecutionAt: new Date(),
          experimentTestExecutionId: this.currentExecution?.id,
          numberClicks: this.numberClicks,
          clickedOnSearchBar: this.clickedOnSearchBar,
        };
        this.experimentService.saveRecallRecognitionExecution(recallRecognitionExecution).subscribe((exec) => {
          setTimeout(() => {
            this.loading = false;
            this.router.navigateByUrl("/")
            this.toastrService.success("Sie haben das Experiment erfolgreich abgeschlossen");
            }, 2000);

        } );
      });
    }
  }

  private fetchExecutionInProcess(userId: number, testId: number) {
    return this.experimentService.getExperimentExecutionByStateAndTest(userId, testId, "INPROCESS");
  }

  setClickedOnSearchBar() {
    this.clickedOnSearchBar = true;

  }

  cancelExperiment() {

  }

  increaseClicks() {
    this.numberClicks ++;
    localStorage.setItem('numberClicks', String(this.numberClicks));

  }
}
