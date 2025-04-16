import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {
  NavigationEnd,
  Router, RouterLink,
  RouterOutlet,
} from '@angular/router';
import {SearchBarComponent} from '../../../../search-bar/search-bar.component';
import {MatIcon} from '@angular/material/icon';
import {
  ExperimentTestInstructionComponent
} from "../../../experiment-test-instruction/experiment-test-instruction.component";
import {SideMenuComponent} from '../../side-menu/side-menu.component';
import {ProductService} from '../../../../services/product.service';
import {ProductType} from '../../../../models/product-category';
import {routerLinks} from '../../routes';
import {filter, Subscription} from 'rxjs';
import {SideMenuService} from '../../../../services/side-menu.service';
import {RouterService} from '../../../../services/router.service';
import {BasketComponent} from '../../../../basket/basket.component';
import {MatFabButton} from '@angular/material/button';
import {RecallRecognitionExperimentExecution} from '../../../../models/recall-recognition-experiment-execution';
import {LoginService} from '../../../../services/login.service';
import {ExperimentService} from '../../../../services/experiment.service';
import {ExperimentTestExecution} from '../../../../models/experiment-test-execution';
import {ToastrService} from 'ngx-toastr';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {NgForOf, NgIf} from '@angular/common';
import {ExperimentTest} from '../../../../models/experiment-test';
import {TimeService} from '../../../../services/time.service';

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
    NgForOf,
    RouterLink,
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
  routerService = inject(RouterService);
  timeService: TimeService = inject(TimeService);
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
  experimentTest!: ExperimentTest
  clickedRoutes: { [key: string]: string } = {};
  failedClicks: number = 0;
  currentExecution: ExperimentTestExecution | null = null;
  numberClicks: number = 0;
  loading: boolean = false;
  clickedOnSearchBar: boolean = false;
  experimentFinished: boolean = false;
  timeToClickFirstCategoryLink: number = 0;
  links: string[] = [];
  usedBreadCrumbs: boolean = false;

  constructor(private cdRef: ChangeDetectorRef, private toastrService: ToastrService) {
    this.instructions = ["Finden Sie die Produktkategorie IT und Multimedia",
      "Finden Sie die Produktkategorie PC und Notebooks",
      "Finden Sie die Produktkategorie Notebooks",
      "Wählen Sie ein Notebook aus",
      "Fügen Sie das Notebook dem Warenkorb hinzu", "Gehen Sie zur Kasse"];
  }

  canDeactivate() {
    if (!this.experimentFinished) {
      return confirm("Achtung Sie sind, dabei das Experiment zu verlassen. All Ihre Änderungen werden nicht gespeichert. Wollen Sie fortfahren.")
    } else {
      return true;
    }
  }

  ngOnInit(): void {
    this.timeService.startTimer();
    this.experimentTestId = Number(this.router.url.split("/")[this.router.url.split("/").indexOf("recall-recognition") + 1])
    this.fetchExperimentTest(this.experimentTestId);

    this.productService.getBasket();
    this.productService.getBasketSubscription().subscribe((basket) => {
      this.basket = basket;
      if (this.basket.length > 0) {
        this.basketIsHidden = false;
        this.currentInstructionStep = this.instructions.length - 1;
      } else {
        this.currentInstructionStep = this.currentInstructionStep <= 0 ? 0 : this.currentInstructionStep - 1;
      }
    });
    this.updateMenuSubscription = this.menuService.getSubject().subscribe((updateMenu) => {
      if (updateMenu) {
        this.fetchProductTypes("Home");
        this.currentRoute = "Home";
        this.currentInstructionStep = 4;
        this.cdRef.detectChanges();
      }
    });

    let oldRoute = this.routerService.rebuildCurrentRoute(this.router.url.split("/"));
    this.rebuildRoute(oldRoute);

    this.router.events
      .pipe(filter(event => (event instanceof NavigationEnd)))
      .subscribe((sub) => {
        this.currentRoute = this.routerService.rebuildCurrentRoute(this.router.url.split("/"));
        this.updateInstructions(this.currentRoute);
        if (this.currentType?.parentType?.name == this.currentRoute) {
          this.currentType = this.currentType.parentType;
        } else {
          this.currentType = this.productCategories.find(type => type.name == this.currentRoute);
        }
        this.buildParentRoute();
        this.buildHeaderLinks();
        this.fetchProductTypes(this.currentRoute);
      });

    this.fetchProductTypes(this.currentRoute);
    const clickedRoutes = localStorage.getItem('clickedRoutes')
    if (clickedRoutes) {
      this.clickedRoutes = JSON.parse(clickedRoutes);
    }
    const clicks = Number(localStorage.getItem('numberClicks'));
    if (clicks) {
      this.numberClicks = clicks;
    }
  }

  buildParentRoute() {
    const parentRouteData = this.routerService.rebuildParentRoute(this.currentRoute, this.productCategories, this.currentType)
    this.parentCategory = parentRouteData.parentCategory;
    this.parentRoute = parentRouteData.parentRoute;
  }

  buildHeaderLinks() {
    this.links = this.routerService.buildBreadcrumbs(this.links, this.currentRoute);

  }

  rebuildRoute(oldRoute: string,) {
    if (oldRoute != "Home") {
      this.failedClicks++;
      const parentRoute = localStorage.getItem('parentRoute') ?? "Home";
      this.productService.fetchSubCategoriesObjects(parentRoute).subscribe((categories) => {
        this.productCategories = categories;
        this.currentType = categories.find(type => type.name == oldRoute)
        this.parentCategory = this.currentType?.parentType ? this.currentType.parentType.name : "Home";
        this.currentRoute = this.currentType?.name ?? 'Home';
        this.fetchProductTypes(this.currentRoute);
        this.parentRoute = this.routerLinks[this.parentCategory]
        this.updateInstructions(this.currentRoute);
      });
    }
  }

  openBasket() {
    this.basketIsHidden = !this.basketIsHidden;
  }

  setCurrentRoute($event: string) {
    if (Object.values(this.clickedRoutes).length == 0) {
      this.timeToClickFirstCategoryLink = this.timeService.getCurrentTime();
      this.timeService.stopTimer();
    }
    if (this.targetRoutes.indexOf($event) == -1) {
      this.failedClicks++;
    }
    this.clickedRoutes[$event] = new Date().toISOString();
    localStorage.setItem('clickedRoutes', JSON.stringify(this.clickedRoutes));
    this.currentRoute = $event;
    this.updateInstructions($event);

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
      this.categoryLinks = this.routerService.buildValueKeyPairForCategoryLinks(this.productCategories);
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
    this.routerService.clearNumberNavigationClicks();
    if (id) {
      this.timeService.stopTimer();
      this.experimentFinished = true;
      this.loading = true;
      this.experimentService.setLastFinishedExperimentTest(this.experimentTestId);
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
          timeToClickFirstCategoryLink: this.timeToClickFirstCategoryLink,
          usedBreadcrumbs: this.usedBreadCrumbs,
        };
        this.experimentService.saveRecallRecognitionExecution(recallRecognitionExecution).subscribe((exec) => {
          setTimeout(() => {
            this.loading = false;
            this.router.navigateByUrl("/test/"+this.experimentTestId+"/feedback")
            this.toastrService.success("Sie haben das Experiment erfolgreich abgeschlossen");
          }, 2000);

        });
      });
    }
  }

  private fetchExecutionInProcess(userId: number, testId: number) {
    return this.experimentService.getExperimentExecutionByStateAndTest(userId, testId, "INPROCESS");
  }

  setClickedOnSearchBar() {
    this.failedClicks++;
    this.clickedOnSearchBar = true;

  }

  increaseClicks() {
    this.numberClicks++;

    localStorage.setItem('numberClicks', String(this.numberClicks));
  }

  private fetchExperimentTest(experimentTestId: number) {
    this.experimentService.getExperimentTest(experimentTestId).subscribe((test) => {
      this.experimentTest = test;
    });
  }

  updateBreadcrumbsBehaviour() {
    this.usedBreadCrumbs = true;
    this.failedClicks++;
  }
}
