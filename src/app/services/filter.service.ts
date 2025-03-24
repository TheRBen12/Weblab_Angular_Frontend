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
        if (text == "OS") {
          return this.splitAndFilterBySpecification(productSpecifications, text);
        }else{
          return productSpecifications.some((specification: any) =>
            String(specification.value)
              .replaceAll(" ", "")
              .toLowerCase()
              .includes(text.replaceAll(" ", "").toLowerCase())
          );
        }

      });
    });
  }

  splitAndFilterBySpecification(specifications: any, text: string) {
    return specifications.some((spec: any) => spec.split(" ").indexOf(text)) != -1;
  }


  filterByAllSpecification(products: any[], textInputs: string[]) {
    return products.filter((product) => {
      const productSpecifications = product.specifications;
      return textInputs.every(text => {
        if (text == "OS") {
          return this.splitAndFilterBySpecification(productSpecifications, text);
        }else {
          return productSpecifications.some((specification: any) =>
            String(specification.value)
              .replaceAll(" ", "")
              .toLowerCase()
              .includes(text.replaceAll(" ", "").toLowerCase())
          );
        }
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
        })
        if (textInputs.indexOf(spec) != -1) {
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
    let textInputs = text.split(" ");
    let nameProperties: string[] = [];

    let filteredProductsByProperties = this.filterByAllProperty(products, textInputs);
    if (filteredProductsByProperties.length > 0) {
      filteredProducts = this.filterByAllSpecification(filteredProductsByProperties, textInputs);
      if (filteredProducts.length > 0) {
        return filteredProducts;
      } else {
        filteredProducts = this.filterBySpecification(filteredProductsByProperties, textInputs);
        if (filteredProducts.length > 0) {
          return filteredProducts
        } else {
          return filteredProductsByProperties;
        }
      }
    }

    if (filteredProductsByProperties.length == 0) {
      filteredProductsByProperties = this.filterBySomeProperty(products, textInputs);

    }

    let properties: any[] = []
    products.forEach((product) => {
      const productPropertyValues = Object.values(product);
      const productPropertyKeyNames = Object.keys(product);
      textInputs.forEach((text) => {
        productPropertyValues.filter((value, index) => {
          if (productPropertyKeyNames[index] != "specifications" && productPropertyKeyNames[index] != "id") {
            const toAdd = String(value).replaceAll(" ", "").toLowerCase().includes(text.replaceAll(" ", "").toLowerCase());
            if (productPropertyKeyNames[index] == "name" && toAdd && text.length > 1) {
              nameProperties.push(text)
            }else{
              if (toAdd) {
                properties.push(text);
              }
            }

            return toAdd;
          }
          return false;
        });
      })
    });


    const idx = textInputs.indexOf("GB");
    if (idx != -1) {
      const number = parseInt(textInputs.at(idx - 1) || "");
      nameProperties = nameProperties.filter(name => name != String(number))
    }
    if (nameProperties.length > 0) {
      let filteredProductsByName = this.filterByName(filteredProductsByProperties, nameProperties);
      if (filteredProductsByName.length > 0) {
        filteredProducts = filteredProductsByName;
        if (this.filterBySpecification(filteredProductsByName, textInputs).length > 0) {
          filteredProducts = this.filterBySpecification(filteredProductsByName, textInputs);
          return filteredProducts;
        } else {
          return filteredProductsByName;
        }
      }
    }
    textInputs = textInputs.filter(text => properties.indexOf(text) == -1);

    let filteredProductsBySpecification = this.filterByAllSpecification(filteredProductsByProperties, textInputs);

    if (filteredProductsBySpecification.length > 0) {
      filteredProducts = filteredProductsBySpecification;
    } else {
      filteredProductsBySpecification = this.filterByAllSpecification(products, textInputs);
      if (filteredProductsBySpecification.length > 0) {
        filteredProducts = filteredProductsBySpecification;
      } else {
        filteredProductsBySpecification = this.filterBySpecification(filteredProductsByProperties, textInputs);
        if (filteredProductsBySpecification.length > 0) {
          filteredProducts = filteredProductsBySpecification;
        } else {
          filteredProductsBySpecification = this.filterBySpecification(products, textInputs);
          if (filteredProductsBySpecification.length > 0) {
            filteredProducts = filteredProductsBySpecification;
          } else {
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
        return (element.estimatedExecutionTime.toString() + " Minuten").toLowerCase().includes(text.toLowerCase()) || element?.name.toLowerCase().includes(text.toLowerCase()) ||
          element.description?.toLowerCase().includes(text.toLowerCase()) ||
          element.state?.toLowerCase().includes(text.toLowerCase()) || String(element.estimatedExecutionTime).toLowerCase().includes(text.toLowerCase());
      });
  }

  dispatchFilterText($event: string) {
    this.filterSubject.next($event)
  }


}
