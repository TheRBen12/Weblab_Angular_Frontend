import {Injectable} from '@angular/core';
import {ProductType} from '../models/product-category';
import {routerLinks} from '../experiment-tests/tests/routes';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  productCategoryLinks = routerLinks
  private lastKnownRoute: string = '../'; // Standard-Fallback


  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const index = event.url.lastIndexOf("/");
        this.lastKnownRoute = event.url.slice(0, index);
      }
    });
  }

  getLastKnownRoute(): string {
    return this.lastKnownRoute;
  }


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
  rebuildCurrentRoute(urlSegments: string[]){
    const link = urlSegments[urlSegments.length-1];
    let category = Object.keys(routerLinks).find(key => routerLinks[key] === link);
    return category ? category : "Home";
  }



}
