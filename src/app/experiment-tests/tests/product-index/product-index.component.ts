import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../services/product.service';
import {ProductComponent} from '../product/product.component';
import {NgForOf, NgIf} from '@angular/common';
import {Subscription} from 'rxjs';
import {FilterService} from '../../../services/filter.service';
import {FilterSelectDropdownComponent} from '../../../filter-select-dropdown/filter-select-dropdown.component';
import {ExperimentService} from '../../../services/experiment.service';

@Component({
  selector: 'app-product-index',
  imports: [
    ProductComponent,
    NgForOf,
    NgIf,
    FilterSelectDropdownComponent,
  ],
  templateUrl: './product-index.component.html',
  standalone: true,
  styleUrl: './product-index.component.css'
})
export class ProductIndexComponent implements OnInit, OnDestroy {
  title: string | undefined = "";
  productService = inject(ProductService);
  filterService = inject(FilterService);
  experimentService: ExperimentService = inject(ExperimentService);
  @Input() products: any[] = [];
  filteredProducts: any[] = [];
  router = inject(Router);
  showFilterResultTitle: boolean = false;
  productProperties: string[] = []
  specifications: string[] = [];
  productLimit: number | null = null;

  filterSubscription: Subscription = new Subscription();
  @Input() category: string = "";

  constructor(private route: ActivatedRoute) {
    this.title = this.route.snapshot.title;

  }

  ngOnInit(): void {

    this.fetchAllProducts().subscribe((products) => {
      this.products = products;
    });

    const urlSegments = this.router.url.split("/");
    let isHicksLawExperiment = false;
    if (urlSegments.indexOf("hicks-law") != -1) {
      isHicksLawExperiment = true;
    }
    this.filterService.getSubject().subscribe((filterText) => {
      if (isHicksLawExperiment && filterText == "") {
        this.filteredProducts = this.products;
      } else {
        this.filteredProducts = this.filterService.filterProducts(filterText, this.products);
        this.showFilterResultTitle = this.filteredProducts.length > 0;
      }
    });

    if (this.category != 'all') {
      this.route.url.subscribe((url) => {
        this.category = url[0].path

        if (this.category == "it-und-multimedia") {
          this.category = "IT und Multimedia"
        }
        if (this.category == "smartphones-und-tablets") {
          this.category = "Smartphones und Tablets"
        }
        if (this.category == "pc-und-notebooks") {
          this.category = "PC und Notebooks"
        }

        if (this.category.split("-").length < 2) {
          const capital = this.category.charAt(0);
          const upperCapital = capital.toUpperCase()
          this.category = this.category.replace(capital, upperCapital);
        }

        this.fetchProductsByCategory()

        this.productService.getProductLimitSubscription().subscribe((limit) => {
          if (limit) {
            this.productLimit = limit;
            this.fetchProductsByCategory();
          }
        });

      });
    } else {
      this.title = "Gesamtsortiment";
    }
  }


  fetchAllProducts() {
    return this.productService.getAllProducts();
  }

  fetchProductsByCategory() {
    this.productService.getProductsByCategory(this.category).subscribe((products) => {

        this.filteredProducts = products.slice(0, this.productLimit?? products.length + 1);

      this.productProperties = Object.keys(this.filteredProducts[0]).filter(key => key != "id" && key != "name" && key != "specifications");
      this.createSpecificationValueList();
    }, error => {
      this.products = [];
    });
  }

  ngOnDestroy(): void {
    this.filterSubscription.unsubscribe();
  }

  private createSpecificationValueList() {
    const productSpecifications = this.filteredProducts[0].specifications;
    productSpecifications.forEach((spec: any) => {
      this.specifications.push(spec.name);
    });
    this.specifications = this.specifications.concat()
  }

  getPropertyValues(property: string) {
    const values: any[] = [];
    if (property) {
      this.filteredProducts.forEach((product: any) => {
        const value = product[property];
        if (value && values.indexOf(value) == -1) {
          values.push(value);
        }
      });
    }

    return values;
  }

  private updateProductList(limit: number) {
    this.filteredProducts = this.filteredProducts.slice(0, limit + 1);
  }
}
