import {Component, inject, OnInit} from '@angular/core';
import {DatePipe, NgComponentOutlet, NgIf} from '@angular/common';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {SearchBarComponent} from '../../../../search-bar/search-bar.component';
import {MatIcon} from '@angular/material/icon';
import {
    ExperimentTestInstructionComponent
} from "../../../experiment-test-instruction/experiment-test-instruction.component";
import {SideMenuComponent} from '../side-menu/side-menu.component';
import {ProductComponent} from './product/product.component';
import {ProductService} from '../../../../services/product.service';

@Component({
  selector: 'app-recall-recognition-part-one',
  imports: [
    NgIf,
    RouterLink,
    SearchBarComponent,
    MatIcon,
    RouterOutlet,
    ExperimentTestInstructionComponent,
    NgComponentOutlet,
    SideMenuComponent,
    ProductComponent,
    DatePipe
  ],
  templateUrl: './recall-recognition-part-one.component.html',
  standalone: true,
  styleUrl: './recall-recognition-part-one.component.css'
})
export class RecallRecognitionPartOneComponent implements OnInit{
  public instructions: string[];
  public productCategories: string[] = ["Home", "Gaming", "IT und Multimedia", "Haushalt", "Garten", "Bücher", "Büro", "Wohnen"];
  categoryLinks: string[] = [];
  currentRoute: string = "";
  currentDate = Date.now();
  router = inject(Router);
  productService = inject(ProductService);
  dailyOfferProduct: any;
  constructor() {
    this.instructions = ["Finden Sie die Produktkategorie IT und Multimedia"]

  }

  ngOnInit(): void {
      const links = this.productCategories.reduce((acc, category) => {
        const slug = category
          .toLowerCase()
          .replace(/ü/g, 'ue') // Umlaute umwandeln
          .replace(/ /g, '-')  // Leerzeichen durch Bindestriche ersetzen
          .replace(/[^a-z-]/g, ''); // Alle nicht erlaubten Zeichen entfernen
        acc[category] = `${slug}`;
        return acc;
      }, {} as Record<string, string>);
      this.currentRoute = this.productCategories[0];
      this.categoryLinks = Object.values(links);
      this.fetchDailyOffer();
  }

  setCurrentRoute($event: string) {
    this.currentRoute = $event;
  }
  fetchDailyOffer(){
    this.productService.getDailyOfferProduct().subscribe((result) => {
      this.dailyOfferProduct = result;
    })
  }
}
