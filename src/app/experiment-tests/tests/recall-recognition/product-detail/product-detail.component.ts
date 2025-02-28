import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {switchMap} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ProductService} from '../../../../services/product.service';
import {NgForOf, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {RecallRecognitionExperimentTestService} from '../../../../services/recall-recognition-experiment-test.service';
import {ExperimentService} from '../../../../services/experiment.service';

@Component({
  selector: 'app-product-detail',
  imports: [
    NgForOf,
    NgIf,
    MatIcon,
  ],
  templateUrl: './product-detail.component.html',
  standalone: true,
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  service = inject(RecallRecognitionExperimentTestService);
  productService = inject(ProductService);
  product: any
  specifications: any[] = [];
  experimentService = inject(ExperimentService);

  constructor(private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.cdRef.detectChanges();
    this.route.paramMap.pipe(
      switchMap(params => {
        const productId = Number(params.get('productId'));
        return this.productService.getProductById(productId);
      })
    ).subscribe(product => {
      this.product = product;
      this.specifications = product.specifications;
    });

    this.service.updateSideMenu(true);
  }

  finishExperimentTest(){
   // create a new instance of RecallRecognitionPartOneExecution
   this.experimentService.saveExperimentTestExecution();
  }

}
