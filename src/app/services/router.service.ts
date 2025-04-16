import {inject, Injectable} from '@angular/core';
import {ProductType} from '../models/product-category';
import {routerLinks} from '../experiment-tests/tests/routes';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {routes} from '../app.routes';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  productCategoryLinks = routerLinks
  private lastKnownRoute: string = '../'; // Standard-Fallback
  private currentRoute: string= "";
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.router.url.includes("/tests/detail")){
          //localStorage.setItem("numberNavigationClicks", String(0));
        }
      }
      if (event instanceof NavigationEnd){
        console.log(event.url);
        this.currentRoute = this.router.url;
      }
    });
  }

  clearNumberNavigationClicks(){
    localStorage.setItem("numberNavigationClicks", String(-1));
  }

  getLastKnownRoute(): string {
    return this.lastKnownRoute;
  }

  getCurrentRoute(): string {
    return this.currentRoute;
  }


  buildBreadcrumbs(links: string[], currentRoute: string) {
    if (links.indexOf(currentRoute) != -1) {
      const offset = links.indexOf(currentRoute);
      links = links.slice(0, offset+1);
    } else if (currentRoute == "Home") {
      links = [];
    } else {
      if (links.indexOf(currentRoute) == -1){
        links.push(currentRoute);
      }
    }
    return links;

  }

  getExperimentTestIdByUrl(url: string, experimentName: string){
    const urlSegments = url.split("/");
    const index = urlSegments.indexOf(experimentName);
    return Number(urlSegments[index + 1]);

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

  buildCurrentType(categories: ProductType[], route: string, currentType?: ProductType){
    if (currentType?.parentType?.name == route) {
      currentType = currentType?.parentType;
    } else {
      currentType = categories.find(type => type.name == route);
    }
    return currentType;
  }

  rebuildParentRoute(route: string, categories: ProductType[], currentType?: ProductType){
    let parentRoute = "";
    let parentCategory = "";
    if (currentType?.parentType){
      parentCategory = currentType?.parentType?.name ?? "Home";
      parentRoute = this.productCategoryLinks[parentCategory];
      localStorage.setItem('parentRoute', parentCategory);
    }else{
      const currentType = categories.find((category) => category.name == route)
      parentCategory = currentType?.parentType?.name ?? "Home";
      parentRoute = this.productCategoryLinks[parentCategory];
      localStorage.setItem('parentRoute', parentCategory);
    }
    return {parentCategory: parentCategory, parentRoute: parentRoute}

  }

  rebuildCurrentNavigationRoute(url: string) {
    if (url == "/settings"){
      return "Einstellungen";
    }else if (url == "/help"){
      return "Hilfe";
    }else if (url=="/profile"){
      return "Profil";
    }
    else if (url == "/"){
      return "Experimente";
    }
    else{
      return "";
    }
  }
}
