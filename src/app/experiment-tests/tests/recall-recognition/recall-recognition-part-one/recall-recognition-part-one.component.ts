import {Component, inject, OnInit} from '@angular/core';
import {DatePipe, NgForOf} from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
import {SearchBarComponent} from '../../../../search-bar/search-bar.component';
import {MatIcon} from '@angular/material/icon';
import {
  ExperimentTestInstructionComponent
} from "../../../experiment-test-instruction/experiment-test-instruction.component";
import {SideMenuComponent} from '../side-menu/side-menu.component';
import {ProductComponent} from './product/product.component';
import {ProductService} from '../../../../services/product.service';
import {ProductType} from '../../../../models/product-category';
import {routerLinks} from './routes';

@Component({
  selector: 'app-recall-recognition-part-one',
  imports: [
    SearchBarComponent,
    MatIcon,
    RouterOutlet,
    ExperimentTestInstructionComponent,
    SideMenuComponent,
    ProductComponent,
    DatePipe,
    NgForOf
  ],
  templateUrl: './recall-recognition-part-one.component.html',
  standalone: true,
  styleUrl: './recall-recognition-part-one.component.css'
})
export class RecallRecognitionPartOneComponent implements OnInit {
  instructions: string[];
  productCategories: ProductType[] = [];
  categoryLinks: string[] = [];
  currentRoute: string = "Home";
  currentDate = Date.now();
  router = inject(Router);
  productService = inject(ProductService);
  dailyOfferProduct: any;
  specifications: any[] = [];
  parentCategory: string | null = null;
  parentRoute: string | null = null;
  currentType: ProductType | undefined;
  targetRoutes = ["IT und Multimedia", "PC und Notebooks", "Notebook"]
  favoriteCategories : string[] = ["Smartphone und Tablets", "Küche"];
  routerLinks = routerLinks;


  constructor() {
    this.instructions = ["Finden Sie die Produktkategorie IT und Multimedia"]
  }

  ngOnInit(): void {
    this.fetchDailyOffer();
    this.fetchProductTypes()
  }

  buildValueKeyPairForCategoryLinks() {
    const links = this.productCategories.reduce((acc, category) => {
      const slug = category.name
        .toLowerCase()
        .replace(/ü/g, 'ue') // Umlaute umwandeln
        .replace(/ /g, '-')  // Leerzeichen durch Bindestriche ersetzen
        .replace(/[^a-z-]/g, ''); // Alle nicht erlaubten Zeichen entfernen
      acc[category.name] = `${slug}`;
      return acc;
    }, {} as Record<string, string>);
    this.categoryLinks = Object.values(links);
  }

  setCurrentRoute($event: string) {
    if (this.currentType?.parentType?.name == $event) {
      this.currentType = this.currentType.parentType;
    } else {
      this.currentType = this.productCategories.find(type => type.name == $event);
    }
    this.currentRoute = $event;
    this.fetchProductTypes();
    if (this.currentType?.parentType) {
      this.parentCategory = this.currentType.parentType.name;
    } else {
      this.parentCategory = "Home";
    }
    this.parentRoute = this.routerLinks[this.parentCategory];
    console.log(this.parentRoute);
    if (this.targetRoutes.indexOf($event) != -1) {
      this.updateInstructions($event);
    }

  }

  updateInstructions(targetRoute: string) {
    if (targetRoute == this.currentType?.parentType?.name) {
      this.instructions.pop();
    } else {
      switch (targetRoute) {
        case "IT und Multimedia":
          this.instructions = this.instructions.concat("Finden Sie die Produktkategorie PC und Notebooks");
          break;
        case "PC und Notebooks":
          this.instructions = this.instructions.concat("Finden Sie die Produktkategorie Notebooks");
          break;
        case "Notebook":
          this.instructions = this.instructions.concat("Wählen Sie ein Notebook aus, danach können Sie es in den Warenkorb legen." +
            "Danach ist das Experiment beendet");
          break;
        default:
          return;
      }
    }

  }
  fetchDailyOffer() {
    this.productService.getDailyOfferProduct().subscribe((result) => {
      this.dailyOfferProduct = result;
      this.specifications = this.dailyOfferProduct.specifications;
    })
  }

  fetchProductTypes() {
    this.productService.fetchSubCategoriesObjects(this.currentRoute).subscribe((categories) => {
      this.productCategories = categories;
      console.log("categories: ",this.productCategories);
      this.buildValueKeyPairForCategoryLinks()
    });
  }


}
