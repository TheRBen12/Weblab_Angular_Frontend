import {Component, inject, OnInit, signal} from '@angular/core';
import {AutoCompleteComponent} from '../../../../auto-complete/auto-complete.component';
import {
  ExperimentTestInstructionComponent
} from "../../../experiment-test-instruction/experiment-test-instruction.component";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {SideMenuComponent} from "../../side-menu/side-menu.component";
import {ProductType} from '../../../../models/product-category';
import {ProductService} from '../../../../services/product.service';
import {FilterService} from '../../../../services/filter.service';

import {BasketComponent} from '../../../../basket/basket.component';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {NgIf} from '@angular/common';
import {RecallRecognitionExperimentExecution} from '../../../../models/recall-recognition-experiment-execution';
import {LoginService} from '../../../../services/login.service';
import {ExperimentService} from '../../../../services/experiment.service';
import {ExperimentTestExecution} from '../../../../models/experiment-test-execution';
import {ToastrService} from 'ngx-toastr';
import {ExperimentTest} from '../../../../models/experiment-test';
import {TimeService} from '../../../../services/time.service';

@Component({
  selector: 'app-recall-recognition-part-three',
  imports: [
    AutoCompleteComponent,
    ExperimentTestInstructionComponent,
    MatIcon,
    RouterOutlet,
    SideMenuComponent,
    BasketComponent,
    MatCard,
    MatCardContent,
    MatProgressSpinner,
    NgIf
  ],
  templateUrl: './recall-recognition-part-three.component.html',
  standalone: true,
  styleUrl: './recall-recognition-part-three.component.css'
})
export class RecallRecognitionPartThreeComponent implements OnInit {
  instructions: string[];
  productCategories: ProductType[] = [];
  categoryLinks: string[] = [];
  currentRoute: string = "Home";
  parentCategory: string | null = null;
  parentRoute: string | null = null;
  currentInstructionStep: number = 0;
  products: any[] = [];
  filterService = inject(FilterService);
  timeService: TimeService = inject(TimeService);
  productService = inject(ProductService);
  router = inject(Router);
  userService: LoginService = inject(LoginService);
  experimentService: ExperimentService = inject(ExperimentService);
  basketIsHidden: boolean = true;
  basket: any[] = [];
  loading: boolean = false;
  experimentTestId: number = 0;
  currentExecution: ExperimentTestExecution | null = null;
  failedClicks: number = 0;
  numberClicks: number = 0;
  clickedOnSearchBar: boolean = false;
  numberUsedSearchBar: number = 0;
  targetInstruction: string = "";
  experimentTest?: ExperimentTest
  private timeToClickSearchBar?: number;

  constructor(private toasterService: ToastrService, private activatedRoute: ActivatedRoute) {
    this.instructions = ["Benutzen Sie das Suchfeld, um die gewünschte Tastatur zu finden."];

  }

  filterProducts(text: string) {
    this.filterService.dispatchFilterText(text);
  }

  fetchAllProducts() {
    this.productService.getAllProducts().subscribe((products) => {
      this.products = products
    });
  }

  ngOnInit(): void {
    this.timeService.startTimer();
    this.productService.getBasket();
    this.productService.getBasketSubscription().subscribe((basket) => {
      if (basket.length == 1){
        this.failedClicks --;
      }
      this.basket = basket
    });

    this.fetchAllProducts();
    this.fetchProductTypes("Home");
    const urlSegments = this.router.url.split("/");
    const index = urlSegments.indexOf("recall-recognition") + 1;
    this.experimentTestId = Number(urlSegments[index]);
    this.fetchExperimentTest(this.experimentTestId);

  }

  fetchProductTypes(currentRoute: string) {
    this.productService.fetchSubCategoriesObjects(currentRoute).subscribe((categories) => {
      this.productCategories = categories;
      const route = this.router.url;
      this.categoryLinks = new Array(this.productCategories.length).fill("/test/execute/recall-recognition/3");
    });
  }

  finishExperiment($event: number) {
    const id = this.userService.currentUser()?.id
    if (id) {
      this.experimentService.setLastFinishedExperimentTest(this.experimentTestId);
      this.loading = true;
      this.fetchExecutionInProcess(id, this.experimentTestId).subscribe((exec) => {
        this.currentExecution = exec;
        const recallRecognitionExecution: RecallRecognitionExperimentExecution = {
          categoryLinkClickDates: JSON.stringify({}),
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
            this.router.navigateByUrl("/tests/"+this.experimentTest?.experiment?.id)
            this.toasterService.success("Vielen Dank! Sie haben das Experiment erfolgreich abgeschlossen");
          }, 2000);

        });
      });
    }
  }


  private fetchExecutionInProcess(userId: number, testId: number) {
    return this.experimentService.getExperimentExecutionByStateAndTest(userId, testId, "INPROCESS");
  }

  showProduct($event: number) {
    const childRoute = this.activatedRoute.firstChild;
    this.numberUsedSearchBar++;
    this.router.navigate(['./show/product/' + $event], {relativeTo: childRoute});

  }

  increaseNumberClicks() {
    this.numberClicks++;
  }

  increaseFailedClicks(event: Event){
    console.log(event.currentTarget?.toString());
    this.failedClicks++;
  }

  increaseNumberUsedSearchBar() {
    this.numberUsedSearchBar++;
  }

  private fetchExperimentTest(experimentTestId: number) {
    this.experimentService.getExperimentTest(experimentTestId).subscribe((test) => {
      this.experimentTest = test;
    });

  }

  updateTimeToClickSearchBar() {
    this.timeService.stopTimer();
    this.timeToClickSearchBar = this.timeService.getCurrentTime();
  }
}
