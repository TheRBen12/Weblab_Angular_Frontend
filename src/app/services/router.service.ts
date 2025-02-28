import { Injectable } from '@angular/core';
import {ProductType} from '../models/product-category';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor() { }


  buildValueKeyPairForCategoryLinks(productCategories: ProductType[]) {
    const links = productCategories.reduce((acc, category) => {
      const slug = category.name
        .toLowerCase()
        .replace(/ü/g, 'ue') // Umlaute umwandeln
        .replace(/ /g, '-')  // Leerzeichen durch Bindestriche ersetzen
        .replace(/[^a-z-]/g, ''); // Alle nicht erlaubten Zeichen entfernen
      acc[category.name] = `${slug}`;
      return acc;
    }, {} as Record<string, string>);
    return  Object.values(links);
  }
}
