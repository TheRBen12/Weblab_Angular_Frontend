import {Component, effect, inject, Input, numberAttribute, OnInit, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {LoginService} from '../../services/login.service';
import {User} from '../../models/user';
import {NgClass, NgIf} from '@angular/common';
import {UserBehaviour} from '../../models/user-behaviour';
import {RouterService} from '../../services/router.service';
import {TimeService} from '../../services/time.service';

@Component({
  selector: 'app-navigation',
  imports: [
    RouterLink,
    NgIf,
    NgClass
  ],
  templateUrl: './navigation.component.html',
  standalone: true,
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit {
  loginService = inject(LoginService);
  router = inject(Router);
  currentUser: User | null
  currentLink: string = "Experimente"
  userBehaviour!: UserBehaviour | null;
  routerService: RouterService = inject(RouterService);
  timeService: TimeService = inject(TimeService);

  constructor() {
    this.currentUser = this.loginService.getCurrentUser();

    effect(() => {
      const userId = this.loginService.currentUser()?.id;
      if (userId) {
        this.loginService.getUserBehaviour(userId).subscribe((userBehaviour) => {
          this.userBehaviour = userBehaviour;
        })
      }
    });
  }

  logout() {
    this.loginService.logout();
    this.timeService.stopTimer();
  }

  setCurrentLink(link: string) {
    this.currentLink = link;
  }

  updateUserHelpBehaviour() {
    this.currentLink = 'Hilfe';
    if (this.userBehaviour) {
      this.userBehaviour.clickedOnHelp = true;
      this.userBehaviour.numberClickedOnHelp = this.userBehaviour.numberClickedOnHelp + 1
      this.updateUserBehaviour(this.userBehaviour);
    } else {
      const userBehaviour: UserBehaviour = {
        clickedOnHelp: true,
        numberClickedOnHelp: 1,
        user: this.currentUser?.id,
        welcomeModalTipIndex: 0,
        numberClickedOnSettings: 0,
        numberClickedOnHint: 0,
        lastUpdatedAt: new Date(),
      };
      this.loginService.createUserBehaviour(userBehaviour).subscribe((userBehaviour) => {
        this.userBehaviour = userBehaviour;
      });
    }
  }

  updateUserSettingBehaviour() {
    this.currentLink = 'Einstellungen';
    if (this.userBehaviour) {
      this.userBehaviour.clickedOnSettings = true;
      this.userBehaviour.numberClickedOnSettings = this.userBehaviour.numberClickedOnSettings + 1;
      this.updateUserBehaviour(this.userBehaviour);
    } else {
      const userBehaviour: UserBehaviour = {
        clickedOnSettings: true,
        numberClickedOnSettings: 1,
        user: this.currentUser?.id,
        welcomeModalTipIndex: 0,
        numberClickedOnHelp: 0,
        numberClickedOnHint: 0,
        lastUpdatedAt: new Date(),
      };
      this.loginService.createUserBehaviour(userBehaviour);
    }
  }

  updateUserBehaviour(userBehaviour: UserBehaviour) {
    this.loginService.updateUserBehaviour(userBehaviour).subscribe((user) => {
      this.userBehaviour = userBehaviour;
    });
  }

  ngOnInit(): void {
    this.currentLink = this.routerService.rebuildCurrentNavigationRoute(this.router.url);
    this.router.url;
    this.loginService.getUserBehaviourSubscription().subscribe((userBehaviour) => {
      if (userBehaviour) {
        this.userBehaviour = userBehaviour;
      }
    });

  }

}
