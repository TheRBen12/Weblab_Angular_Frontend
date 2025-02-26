import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ProductType} from '../../../../models/product-category';

@Component({
  selector: 'app-side-menu',
  imports: [
    NgForOf,
    RouterLink,
    NgClass,
    NgIf,
  ],
  templateUrl: './side-menu.component.html',
  standalone: true,
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {
  @Input() currentRoute: string = "";
  @Input() parentRoute: string|null = null;
  @Input() parentCategory: string|null = null;

  @Input() productCategories: ProductType[] = [];
  @Input() categoryLinks: string[] = [];
  @Output() routeEvent: EventEmitter<string> = new EventEmitter<string>();
  emitCurrentRoute(category: string){
    this.routeEvent.emit(category)
  }
}
