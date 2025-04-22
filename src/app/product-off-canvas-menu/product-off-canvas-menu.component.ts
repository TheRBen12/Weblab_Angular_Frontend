import {Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NgForOf, NgIf} from '@angular/common';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {ProductType} from '../models/product-category';
import {filter} from 'rxjs';


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
  ],
  templateUrl: './product-off-canvas-menu.component.html',
  standalone: true,
  styleUrl: './product-off-canvas-menu.component.css'
})
export class ProductOffCanvasMenuComponent implements OnInit {
  router: Router = inject(Router);
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


  toggle() {
    this.drawer.toggle();
    this.toggleEvent.emit(this.numberToggled);
    this.numberToggled++;
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => (event instanceof NavigationEnd)))
      .subscribe((sub) => {
        if (this.router.url.includes("/show/product")) {
          this.drawer.close().then();
        }
      });
  }
}
