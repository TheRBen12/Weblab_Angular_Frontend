import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {SearchBarComponent} from '../../../../search-bar/search-bar.component';
import {MatIcon} from '@angular/material/icon';
import {
  ExperimentTestInstructionComponent
} from "../../../experiment-test-instruction/experiment-test-instruction.component";
import {ProductService} from '../../../../services/product.service';
import {ProductType} from '../../../../models/product-category';
import {Subscription} from 'rxjs';
import {SideMenuService} from '../../../../services/side-menu.service';
import {SideMenuComponent} from '../../side-menu/side-menu.component';
import {FilterService} from '../../../../services/filter.service';
import {BasketComponent} from "../../../../basket/basket.component";
import {NgIf} from "@angular/common";
import {MatFabButton} from '@angular/material/button';
import {RecallRecognitionExperimentExecution} from '../../../../models/recall-recognition-experiment-execution';
import {LoginService} from '../../../../services/login.service';
import {ExperimentService} from '../../../../services/experiment.service';
import {ExperimentTestExecution} from '../../../../models/experiment-test-execution';
import {ToastrService} from 'ngx-toastr';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {TimeService} from '../../../../services/time.service';

@Component({
  selector: 'app-recall-recognition-part-one',
  imports: [
    SearchBarComponent,
    MatIcon,
    ExperimentTestInstructionComponent,
    SideMenuComponent,
    RouterOutlet,
    BasketComponent,
    NgIf,
    MatFabButton,
    MatCard,
    MatCardContent,
    MatProgressSpinner,
  ],
  templateUrl: './recall-recognition-part-two.component.html',
  standalone: true,
  styleUrl: './recall-recognition-part-two.component.css'
})
export class RecallRecognitionPartTwoComponent implements OnInit, OnDestroy {
  instructions: string[];
  productCategories: ProductType[] = [];
  categoryLinks: string[] = [];
  currentRoute: string = "Home";
  router = inject(Router);
  productService = inject(ProductService);
  timeService: TimeService = inject(TimeService);
  filterService = inject(FilterService);
  userService: LoginService = inject(LoginService);
  experimentService: ExperimentService = inject(ExperimentService);
  dailyOfferProduct: any;
  specifications: any[] = [];
  parentCategory: string | null = null;
  parentRoute: string | null = null;
  currentInstructionStep: number = 0;
  updateMenuSubscription: Subscription = new Subscription();
  recallRecognitionService = inject(SideMenuService);
  products: any[] = [];
  filteredProducts: any[] = [];
  basket: any[] = [];
  showBasket: boolean = false;
  private numberUsedSearchBar: number = 0;
  private clickedOnSearchBar: boolean = false;
  loading: boolean = false;
  private currentExecution: ExperimentTestExecution|null = null;
  private experimentTestId: number = 0;
  private clickedRoutes: { [key: string]: string } = {};
  private failedClicks: number = 0;
  private numberClicks: number = 0;
  private timeToClickSearchBar: number = 0;




  constructor(private cdRef: ChangeDetectorRef, private toasterService: ToastrService) {
    this.instructions = ["Benutzen Sie das Suchfeld, um ein Smartphone Ihrer Lieblingsmarke zu suchen.",
      "Wählen Sie ein Smartphone aus.", "Legen Sie das Smartphone in den Warenkorb.", "Gehen Sie zur Kasse"];
  }

  ngOnInit(): void {
    this.timeService.startTimer();

    this.experimentTestId = Number(this.router.url.split("/")[this.router.url.split("/").indexOf("recall-recognition") + 1])
    this.productService.getBasketSubscription().subscribe((basket) => {
      if (basket.length < this.basket.length) {
        this.currentInstructionStep--;
      }
      this.basket = basket;
      if (this.basket.length > 0) {
        this.currentInstructionStep = this.instructions.length - 1;
      }
    });
    this.updateMenuSubscription = this.recallRecognitionService.getSubject().subscribe((updateMenu) => {
      if (updateMenu) {
        this.fetchProductTypes("Home");
        this.currentRoute = "Home";
        this.currentInstructionStep++;
        this.cdRef.detectChanges();
      }
    });
    this.fetchDailyOffer();
    this.fetchAllProducts();
    this.fetchProductTypes(this.currentRoute);

    const numberUsedSearchBar = Number(localStorage.getItem('numberUsedSearchBar'));
    if (numberUsedSearchBar){
      this.numberUsedSearchBar = numberUsedSearchBar;
    }

    const failedClicks = Number(localStorage.getItem('failedClicks'));
    if (failedClicks){
      this.failedClicks = failedClicks;
    }


  }

  fetchAllProducts() {
    this.productService.getAllProducts().subscribe((products) => {
      this.products = products
    });
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
      this.categoryLinks = new Array(this.productCategories.length).fill("/test/execute/recall-recognition/2");
    });

  }

  ngOnDestroy(): void {
    this.updateMenuSubscription.unsubscribe();
    localStorage.removeItem('failedClicks');
    localStorage.removeItem('numberSearchDestroy');
    localStorage.removeItem('clicks');

  }

  filterProduct($event: string) {
    this.numberUsedSearchBar++;
    localStorage.setItem('numberUsedSearchBar', String(this.numberUsedSearchBar));
    this.filteredProducts = this.filterService.filterProducts($event, this.products);
    const foundKeyPad = this.filteredProducts.some((product) => product.type == "Smartphone");
    if (foundKeyPad) {
      this.currentInstructionStep++;
    } else {
      this.currentInstructionStep = 0;
    }
    this.filterService.dispatchFilterText($event)

  }

  finishExperiment($event: number) {
    const id = this.userService.currentUser()?.id
    this.experimentService.setLastFinishedExperimentTest(this.experimentTestId);
    if (id) {
      this.loading = true;
      this.fetchExecutionInProcess(id, this.experimentTestId).subscribe((exec) => {
        this.currentExecution = exec;
        console.log(exec);
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
          numberUsedSearchBar: this.numberUsedSearchBar,
          timeToClickSearchBar: this.timeToClickSearchBar,
        };

        this.experimentService.saveRecallRecognitionExecution(recallRecognitionExecution).subscribe((exec) => {
          setTimeout(() => {
            this.loading = false;
            this.router.navigateByUrl("/")
            this.toasterService.success("Sie haben das Experiment erfolgreich abgeschlossen");
          }, 2000);

        });
      });
    }
  }

  private fetchExecutionInProcess(userId: number, testId: number) {
    return this.experimentService.getExperimentExecutionByStateAndTest(userId, testId, "INPROCESS");
  }


  updateInstructions() {
    if (this.basket.length < 1) {
      this.currentInstructionStep = 0;
    }
  }

  increaseClicks() {
    this.numberClicks++;
    localStorage.setItem('clicks', String(this.numberClicks));
  }

  setSearchBarUsedToTrue() {
    this.clickedOnSearchBar = true;
    this.timeService.stopTimer();
    this.timeToClickSearchBar = this.timeService.getCurrentTime();
  }

  toggleBasket() {
    this.showBasket = !this.showBasket;
  }

  increaseFailedClicks() {
    this.failedClicks ++;
    localStorage.setItem('failedClicks', String(this.failedClicks));
  }
}
