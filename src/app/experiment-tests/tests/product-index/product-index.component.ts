import {ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../services/product.service';
import {ProductComponent} from '../product/product.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Subscription} from 'rxjs';
import {FilterService} from '../../../services/filter.service';
import {FilterSelectDropdownComponent} from '../../../filter-select-dropdown/filter-select-dropdown.component';
import {ExperimentService} from '../../../services/experiment.service';
import {MatCard} from '@angular/material/card';

@Component({
  selector: 'app-product-index',
  imports: [
    ProductComponent,
    NgForOf,
    NgIf,
    FilterSelectDropdownComponent,
    MatCard,
    NgClass,
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
  specifications: string[] = [];
  productLimit: number | null = null;
  productProperties = ["Marke", "Kategorie"];

  filterSubscription: Subscription = new Subscription();
  @Input() category: string = "";
  filterDisabled: boolean = false;

  constructor(private route: ActivatedRoute, private cdRf: ChangeDetectorRef) {
    this.title = this.route.snapshot.title;
  }

  ngOnInit(): void {
    this.fetchAllProducts().subscribe((products) => {
      this.products = products;
    });

    const urlSegments = this.router.url.split("/");
    const index = urlSegments.indexOf("hicks-law")

    const expId = Number(urlSegments[index + 1]);
    if (expId) {
      this.fetchExperimentTest(expId);
    }

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
      this.filteredProducts = products.slice(0, this.productLimit ?? products.length + 1);
      this.createSpecificationValueList();
      this.cdRf.detectChanges();
    }, error => {
      this.products = [];
    });
  }

  ngOnDestroy(): void {
    this.filterSubscription.unsubscribe();
  }

  private createSpecificationValueList() {
    this.specifications = this.filteredProducts.flatMap(product =>
      product.specifications.map((spec: any) =>
        spec.propertyName));

    this.specifications = Array.from(new Set(this.specifications));


  }

  getPropertyValues(property: string) {
    const values: any[] = [];
    this.filteredProducts.forEach((product: any) => {
      const enProperty = property == "Marke" ? "trademark" : 'type';
      const value = product[enProperty];
      if (value && values.indexOf(value) == -1) {
        values.push(value);
      }
    });

    return values;
  }

  getSpecificationValues(specification: string) {
    const values: string[] = []
    if (specification) {
      this.filteredProducts.forEach((product: any) => {
        let specifications = product.specifications;
        const currentSpecification = specifications.find((spec: any) => {
          return spec.propertyName == specification
        });
        if (currentSpecification && values.indexOf(currentSpecification.value) == -1) {
          values.push(currentSpecification.value);
        }
      });

    }
    return values;
  }

  filterProductsByProperty(propertyName: string, value: string) {
    if (propertyName == "Marke" || propertyName == "Kategorie") {
      this.filteredProducts = this.filteredProducts.filter(product => product.trademark == value || product.type == value);
    }

  }

  filterProductsBySpecifications(propertyName: string, value: string) {
    this.filteredProducts = this.filteredProducts.filter((product) => {
      const specification = product.specifications.find((spec: any) => spec.propertyName == propertyName);
      if (specification) {
        return specification.value == value;
      }
      return false;
    });


  }


  filterByPrice(min: number, max: number) {
    this.filteredProducts = this.filteredProducts.filter(product => (product.price >= min && product.price <= max));
  }

  private fetchExperimentTest(expId: number) {
    this.experimentService.getExperimentTest(expId).subscribe((test) => {
      this.filterDisabled = !Boolean(JSON.parse(test.configuration)['filterDisabled']);
    });
  }
}
