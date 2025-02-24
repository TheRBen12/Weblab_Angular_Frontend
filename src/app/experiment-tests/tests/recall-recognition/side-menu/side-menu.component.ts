import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-side-menu',
  imports: [
    NgForOf,
    RouterLink,
    NgClass
  ],
  templateUrl: './side-menu.component.html',
  standalone: true,
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {
  @Input() currentRoute: string = "";
  @Input() productCategories: string[] = [];
  @Input() categoryLinks: string[] = [];
  @Output() routeEvent: EventEmitter<string> = new EventEmitter<string>();
  emitCurrentRoute(category: string){
    this.routeEvent.emit(category)
  }
}
