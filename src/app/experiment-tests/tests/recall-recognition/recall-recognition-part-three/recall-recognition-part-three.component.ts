import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {AutoCompleteComponent} from '../../../../auto-complete/auto-complete.component';
import {
  ExperimentTestInstructionComponent
} from "../../../experiment-test-instruction/experiment-test-instruction.component";
import {MatIcon} from "@angular/material/icon";
import {Router, RouterOutlet} from "@angular/router";
import {SearchBarComponent} from "../../../../search-bar/search-bar.component";
import {SideMenuComponent} from "../../side-menu/side-menu.component";
import {ProductType} from '../../../../models/product-category';
import {ProductService} from '../../../../services/product.service';
import {FilterService} from '../../../../services/filter.service';
import {Observable, Subscription} from 'rxjs';
import {SideMenuService} from '../../../../services/side-menu.service';
import {FormControl} from '@angular/forms';
import {BasketComponent} from '../../../../basket/basket.component';

@Component({
  selector: 'app-recall-recognition-part-three',
  imports: [
    AutoCompleteComponent,
    ExperimentTestInstructionComponent,
    MatIcon,
    RouterOutlet,
    SideMenuComponent,
    BasketComponent
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
  productService = inject(ProductService);
  router = inject(Router);
  basketIsHidden: boolean = true;
  basket: any[] = [];

  constructor() {
    this.instructions = ["Benutzen Sie das Suchfeld, um Tastaturen mit Ihrem gewünschten Tastaturlayout " +
    "und Ihrer bevorzugten peripheren Verbindungsart zu suchen."];

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
    this.fetchAllProducts();
    this.fetchProductTypes("Home");
  }

  fetchProductTypes(currentRoute: string) {
    this.productService.fetchSubCategoriesObjects(currentRoute).subscribe((categories) => {
      this.productCategories = categories;
      const route = this.router.url;
      this.categoryLinks = new Array(this.productCategories.length).fill("/test/execute/recall-recognition/3");
    });
  }

  finishExperiment($event: number) {
    
  }
}
