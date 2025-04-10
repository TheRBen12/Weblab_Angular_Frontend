import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {MatButton, MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ProductType} from '../models/product-category';


@Component({
  selector: 'app-product-off-canvas-menu',
  imports: [
    MatDrawer,
    MatDrawerContainer,
    MatFabButton,
    MatIcon,
    NgIf,
    RouterLink,
    NgForOf,
    MatButton,
  ],
  templateUrl: './product-off-canvas-menu.component.html',
  standalone: true,
  styleUrl: './product-off-canvas-menu.component.css'
})
export class ProductOffCanvasMenuComponent {
  @Input() menuItems: ProductType[] = [];
  @Output() routeEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() toggleEvent: EventEmitter<number> = new EventEmitter<number>();

  @Input() links: string[] = [];
  @Input() parentCategory?: string = "";
  @Input() currentRoute: string = "";
  @Input() parentRoute: string = "";
  @ViewChild('drawer') drawer!: MatDrawer;
  @Input() toggleMenu: boolean = false;
  numberToggled: number = 0;


  emitCurrentRoute(category: string) {
    this.routeEvent.emit(category)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["toggleMenu"]) {

    }
  }

  toggle() {
    this.drawer.toggle();
    this.toggleEvent.emit(this.numberToggled);
    this.numberToggled++;
  }
}
