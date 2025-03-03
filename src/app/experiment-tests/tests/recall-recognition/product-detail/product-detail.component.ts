import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {switchMap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
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
  private router: Router = inject(Router);
  service = inject(RecallRecognitionExperimentTestService);
  productService = inject(ProductService);
  product: any
  specifications: any[] = [];
  experimentService = inject(ExperimentService);
  targetProperties: {[key: string]: any } = {};



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
  defineTargetProperties(){
    const l = this.router.url.split("/").length;
    const experimentName = this.router.url.split("/")[l-2];
    const experimentId =  this.router.url.split("/")[l-1];
    const route = experimentName + "/"+experimentId;
    switch (route) {
      case "recall-recognition/0":
        this.targetProperties["numberProducts"] = 1;

    }

  }

}
