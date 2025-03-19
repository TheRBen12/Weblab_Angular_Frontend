import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ProductType} from '../../../models/product-category';
import {concatAll} from 'rxjs';

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
export class SideMenuComponent implements OnInit{
  @Input() currentRoute: string|null = "";
  @Input() parentRoute: string|null = null;
  @Input() parentCategory: string|null = null;
  @Input() showCurrentLink: boolean = true;

  @Input() productCategories: ProductType[] = [];
  @Input() categoryLinks: string[] = [];
  @Output() routeEvent: EventEmitter<string> = new EventEmitter<string>();
  emitCurrentRoute(category: string){
    this.routeEvent.emit(category)
  }

  ngOnInit(): void {

    console.log(this.currentRoute);
  }
}
