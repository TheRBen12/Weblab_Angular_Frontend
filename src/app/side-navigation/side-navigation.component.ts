import {
  AfterViewChecked, AfterViewInit,
  Component,
  ElementRef,
  Input, OnChanges,
  OnInit,
  QueryList, SimpleChanges, ViewChild,
  ViewChildren,

} from '@angular/core';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatFabButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatFormField} from '@angular/material/form-field';

@Component({
  selector: 'app-side-navigation',
  imports: [
    MatDrawerContainer,
    MatFormField,
    MatIcon,
    MatFormField,
    MatButton,
    MatDrawer,
    MatFabButton,
    NgIf,
    RouterLink
  ],
  templateUrl: './side-navigation.component.html',
  standalone: true,
  styleUrl: './side-navigation.component.css'
})
export class SideNavigationComponent implements OnInit, AfterViewInit{
  @Input() showLogoutAndProfile: boolean = true;
  @Input() showMenuContent: boolean = false;
  @ViewChildren('drawer') menu!: QueryList<ElementRef>;
  @ViewChild('drawer') drawer!: MatDrawer;

  ngAfterViewInit() {
    this.drawer.open(); // Öffnet den Drawer nach der Initialisierung
  }

  ngOnInit(): void {

  }

}
