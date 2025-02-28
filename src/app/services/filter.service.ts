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


  filterProducts(text: string, products: any[]): any[] {
    if (!text || text == "") {
      return [];
    }
    const textInputs = text.split(" ");

    let filteredProductsByProductAttributes = products.filter((product) => {
      const productPropertyValues = Object.values(product);
      const productPropertyKeyNames = Object.keys(product);

      return textInputs.some(text => {
        return productPropertyValues.some((value, index) => {
          if (productPropertyKeyNames[index] != "specifications") {
            return String(value).replaceAll(" ", "").toLowerCase().includes(text.replaceAll(" ", "").toLowerCase());
          }
          return false;
        });
      })
    });


    let filteredProductByAttributeAndSpec = filteredProductsByProductAttributes.filter((product) => {
      const productSpecifications = product.specifications;
      return textInputs.some(text => {
        return productSpecifications.some((specification: any) =>
          String(specification.value)
            .replaceAll(" ", "")
            .toLowerCase()
            .includes(text.replaceAll(" ", "").toLowerCase())
        );
      })
    })

    let filteredProductsBySpecifications = products.filter(element => {
      const productSpecifications = element.specifications;
      return textInputs.every(text => {
        return productSpecifications.some((specification: any) =>
          String(specification.value)
            .replaceAll(" ", "")
            .toLowerCase()
            .includes(text.replaceAll(" ", "").toLowerCase())
        );
      });
    });

    if (filteredProductByAttributeAndSpec.length > 0 && filteredProductsBySpecifications.length == 0) {
      return filteredProductByAttributeAndSpec;
    } else if (filteredProductByAttributeAndSpec.length == 0 && filteredProductsBySpecifications.length == 0) {
      return filteredProductsByProductAttributes;
    } else {
      return filteredProductsBySpecifications
    }

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
}
