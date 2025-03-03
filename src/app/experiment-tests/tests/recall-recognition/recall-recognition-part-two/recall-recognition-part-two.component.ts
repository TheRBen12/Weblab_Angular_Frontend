import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {SearchBarComponent} from '../../../../search-bar/search-bar.component';
import {MatIcon} from '@angular/material/icon';
import {
  ExperimentTestInstructionComponent
} from "../../../experiment-test-instruction/experiment-test-instruction.component";
import {ProductService} from '../../../../services/product.service';
import {ProductType} from '../../../../models/product-category';
import {Subscription} from 'rxjs';
import {RecallRecognitionExperimentTestService} from '../../../../services/recall-recognition-experiment-test.service';
import {SideMenuComponent} from '../side-menu/side-menu.component';
import {FilterService} from '../../../../services/filter.service';

@Component({
  selector: 'app-recall-recognition-part-one',
  imports: [
    SearchBarComponent,
    MatIcon,
    ExperimentTestInstructionComponent,
    SideMenuComponent,
    RouterOutlet,
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
  filterService = inject(FilterService);
  dailyOfferProduct: any;
  specifications: any[] = [];
  parentCategory: string | null = null;
  parentRoute: string | null = null;
  currentInstructionStep: number = 0;
  updateMenuSubscription: Subscription = new Subscription();
  recallRecognitionService = inject(RecallRecognitionExperimentTestService);
  products: any[] = [];
  filteredProducts: any[] = [];

  constructor(private cdRef: ChangeDetectorRef) {
    this.instructions = ["Benutzen Sie das Suchfeld, um ein Smartphone Ihrer Lieblingsmarke zu suchen.", "Wählen Sie ein Smartphone aus.", "Legen Sie das Smartphone in den Warenkorb. Danach ist das Experiment zu Ende"];
  }

  ngOnInit(): void {
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
      const route = this.router.url;
      this.categoryLinks = new Array(this.productCategories.length).fill("/test/execute/recall-recognition/1");
    });

  }

  ngOnDestroy(): void {
    this.updateMenuSubscription.unsubscribe();
  }

  filterProduct($event: string) {
    this.filteredProducts = this.filterService.filterProducts($event, this.products);
    const foundKeyPad = this.filteredProducts.some((product) => product.type == "Smartphone");
    if (foundKeyPad){
      this.currentInstructionStep++;
    }else{
      this.currentInstructionStep = 0;
    }
    this.filterService.dispatchFilterText($event)
  }
}
