import {
  AfterViewInit,
  Component, effect,
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
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {LoginService} from '../services/login.service';
import {User} from '../models/user';
import {UserBehaviour} from '../models/user-behaviour';
import {RouterService} from '../services/router.service';
import {filter} from 'rxjs';

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
  router: Router = inject(Router);
  routerService: RouterService = inject(RouterService);
  currentRoute = "Experimente";
  userBehaviour!: UserBehaviour

  constructor() {
    effect(() => {
      const userId = this.loginService.currentUser()?.id;
      if (userId) {
        this.loginService.getUserBehaviour(userId).subscribe((userBehaviour) => {
          this.userBehaviour = userBehaviour;
        })
      }
    });
  }

  ngAfterViewInit() {
    //this.drawer.open(); // Öffnet den Drawer nach der Initialisierung
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => (event instanceof NavigationEnd)))
      .subscribe((sub) => {
        if (this.router.url == "/"){
          this.currentRoute = "Experimente";
        }
      });

    this.currentRoute = this.routerService.rebuildCurrentNavigationRoute(this.router.url);
    this.loginService.getUserBehaviourSubscription().subscribe((userBehaviour) => {
      if (userBehaviour) {
        this.userBehaviour = userBehaviour;
      }
    });
    this.currentUser = this.loginService.currentUser();
  }

  logout() {
    this.loginService.logout();
  }

  setCurrentRoute(route: string) {
    this.currentRoute = route;
    if (route == "Einstellungen"){
      this.userBehaviour = this.loginService.increaseNumberClickedSettings(this.userBehaviour);
      this.updateUserBehaviour(this.userBehaviour);
    }
    else if (route == "Hilfe"){
      this.userBehaviour.clickedOnHelp = true;
      this.userBehaviour.numberClickedOnHelp = this.userBehaviour.numberClickedOnHelp + 1;
      this.updateUserBehaviour(this.userBehaviour);
    }
  }


  updateUserBehaviour(userBehaviour: UserBehaviour) {
    this.loginService.updateUserBehaviour(userBehaviour).subscribe((user) => {
      this.userBehaviour = userBehaviour;
    });
  }

}
