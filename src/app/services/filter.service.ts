import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Experiment} from '../models/experiment';
import {ExperimentTest} from '../models/experiment-test';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  filterSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor() {
  }

  getSubject() {
    return this.filterSubject.asObservable();
  }

  filterByName(products: any[], textInputs: string[]) {
    return products.filter((product) => {
      const name = product.name;
      return textInputs.every(text => name.replaceAll(" ", "").toLowerCase().includes(text.toLowerCase()));
    });
  }


  filterBySpecification(products: any[], textInputs: string[]) {
    return products.filter((product) => {
      const productSpecifications = product.specifications;
      return textInputs.some(text => {
        return productSpecifications.some((specification: any) =>
          String(specification.value)
            .replaceAll(" ", "")
            .toLowerCase()
            .includes(text.replaceAll(" ", "").toLowerCase())
        );
      });
    });
  }


  filterByAllSpecification(products: any[], textInputs: string[]) {
    return products.filter((product) => {
      const productSpecifications = product.specifications;
      return textInputs.every(text => {
        return productSpecifications.some((specification: any) =>
          String(specification.value)
            .replaceAll(" ", "")
            .toLowerCase()
            .includes(text.replaceAll(" ", "").toLowerCase())
        );
      });
    });
  }


  filterByAllProperty(products: any[], textInputs: string[]) {
    return products.filter((product) => {
      const productPropertyValues = Object.values(product);
      const productPropertyKeyNames = Object.keys(product);

      const specifications = product.specifications;
      specifications.forEach((spec: any) => {
        spec = spec.value.replaceAll(" ", "").toLowerCase();
        textInputs = textInputs.map((text) => {
          return text.replaceAll(" ", "").toLowerCase();
        } )
        if (textInputs.indexOf(spec) != -1){
          textInputs = textInputs.filter(text => text != spec);
        }
      });

      return textInputs.every(text => {
        return productPropertyValues.some((value, index) => {
          if (productPropertyKeyNames[index] != "specifications") {
            return String(value).replaceAll(" ", "").toLowerCase().includes(text.replaceAll(" ", "").toLowerCase());
          }
          return false;
        });
      })
    });
  }

  filterBySomeProperty(products: any[], textInputs: string[]) {
    const layouts = ["CH", "DE", "EN", "US"];
    return products.filter((product) => {
      const productPropertyValues = Object.values(product);
      const productPropertyKeyNames = Object.keys(product);

      return textInputs.some(text => {
        return productPropertyValues.some((value, index) => {
          if (productPropertyKeyNames[index] != "specifications" && layouts.indexOf(text) == -1) {
            return String(value).replaceAll(" ", "").toLowerCase().includes(text.replaceAll(" ", "").toLowerCase());
          }
          return false;
        });
      })
    });
  }

  filterProducts(text: string, products: any[]): any[] {
    let filteredProducts: any[] = [];
    if (!text || text == "") {
      return filteredProducts;
    }
    const textInputs = text.split(" ");
    const nameProperties: string[] = [];

    let filteredProductsByProperties = this.filterByAllProperty(products, textInputs);
    if (filteredProductsByProperties.length > 0){
      filteredProducts = this.filterByAllSpecification(filteredProductsByProperties, textInputs);
      if (filteredProducts.length > 0){
        return filteredProducts;
      }else{
        filteredProducts = this.filterBySpecification(filteredProductsByProperties, textInputs);
        if (filteredProducts.length > 0){
          return filteredProducts
        }
      }
    }

    if (filteredProductsByProperties.length == 0){
      filteredProductsByProperties = this.filterBySomeProperty(products, textInputs);

    }

    products.forEach((product) => {
      const productPropertyValues = Object.values(product);
      const productPropertyKeyNames = Object.keys(product);

      textInputs.forEach((text) => {
        productPropertyValues.filter((value, index) => {
          if (productPropertyKeyNames[index] != "specifications") {
            const toAdd = String(value).replaceAll(" ", "").toLowerCase().includes(text.replaceAll(" ", "").toLowerCase());
            if (productPropertyKeyNames[index] == "name" && toAdd && text.length > 1){
              nameProperties.push(text)
            }
            return toAdd;
          }
          return false;
        });
      })
    });


    if (nameProperties.length > 0){
      let filteredProductsByName = this.filterByName(filteredProductsByProperties, nameProperties);
      if (filteredProductsByName.length > 0){
        filteredProducts = filteredProductsByName;
         if (this.filterBySpecification(filteredProductsByName, textInputs).length > 0){
           filteredProducts = this.filterBySpecification(filteredProductsByName, textInputs);
           return filteredProducts;
        }else{
           return filteredProductsByName;
         }
      }
    }

    let filteredProductsBySpecification = this.filterByAllSpecification(filteredProductsByProperties, textInputs);

    if (filteredProductsBySpecification.length > 0){
      filteredProducts = filteredProductsBySpecification;
    }else{
      filteredProductsBySpecification = this.filterByAllSpecification(products, textInputs);
      if (filteredProductsBySpecification.length > 0){
        filteredProducts = filteredProductsBySpecification;
      }else{
        filteredProductsBySpecification = this.filterBySpecification(filteredProductsByProperties, textInputs);
        if (filteredProductsBySpecification.length > 0){
          filteredProducts = filteredProductsBySpecification;
        }else{
          filteredProductsBySpecification = this.filterBySpecification(products, textInputs);
          if (filteredProductsBySpecification.length > 0){
            filteredProducts = filteredProductsBySpecification;
          }else{
            filteredProducts = filteredProductsByProperties;
          }
        }
      }
    }

    return filteredProducts;

  }

  filterExperiments(text: string, experiments: Experiment[]) {
    if (!text) {
      return experiments;
    }
    return experiments.filter(
      element => {
        return element?.name.toLowerCase().includes(text.toLowerCase()) ||
          element.state?.toLowerCase().includes(text.toLowerCase());
      });
  }

  filterExperimentTests(text: string, tests: ExperimentTest[]) {
    if (!text) {
      return tests;
    }
    return tests.filter(
      element => {
        return element?.name.toLowerCase().includes(text.toLowerCase()) ||
          element.description?.toLowerCase().includes(text.toLowerCase()) ||
          element.state?.toLowerCase().includes(text.toLowerCase()) || String(element.estimatedExecutionTime).toLowerCase().includes(text.toLowerCase());
      });
  }

  dispatchFilterText($event: string) {
    this.filterSubject.next($event)
  }

  markFilterText(){

  }

}
