import {
  AfterViewInit,
  Component,
  ElementRef, inject,
  Input,
  OnInit,
  QueryList, ViewChild,
  ViewChildren,

} from '@angular/core';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {MatIcon} from '@angular/material/icon';
import {MatFabButton} from '@angular/material/button';
import {NgClass, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {LoginService} from '../services/login.service';
import {User} from '../models/user';

@Component({
  selector: 'app-side-navigation',
  imports: [
    MatDrawerContainer,
    MatIcon,
    MatDrawer,
    MatFabButton,
    NgIf,
    RouterLink,
    NgClass
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
  currentUser!: User | null;
  loginService: LoginService = inject(LoginService);
  currentRoute = "Experimente";


  ngAfterViewInit() {
    this.drawer.open(); // Öffnet den Drawer nach der Initialisierung
  }

  ngOnInit(): void {
    this.currentUser = this.loginService.currentUser();

  }

  logout() {
    this.loginService.logout();
  }

  setCurrentRoute(route: string) {
    this.currentRoute = route;
  }

}
