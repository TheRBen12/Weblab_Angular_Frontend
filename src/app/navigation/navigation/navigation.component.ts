import {Component, inject, numberAttribute, OnInit, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {LoginService} from '../../services/login.service';
import {User} from '../../models/user';
import {NgClass, NgIf} from '@angular/common';
import {UserBehaviour} from '../../models/user-behaviour';
import {BehaviorSubject, refCount} from 'rxjs';

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
  private userBehaviour: UserBehaviour | null = null;


  constructor() {
    this.currentUser = this.loginService.getCurrentUser();
  }

  logout() {
    this.loginService.logout();
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
        numberClickedOnSettings: 0
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
      debugger;
      this.updateUserBehaviour(this.userBehaviour);
    } else {
      const userBehaviour: UserBehaviour = {
        clickedOnSettings: true,
        numberClickedOnSettings: 1,
        user: this.currentUser?.id,
        welcomeModalTipIndex: 0,
        numberClickedOnHelp: 0
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
    this.loginService.getUserBehaviourSubscription().subscribe((userBehaviour) => {
      if (userBehaviour) {
        this.userBehaviour = userBehaviour;
      }
    })
    if (this.currentUser) {
      this.fetchUserBehaviour(this.currentUser.id)
    }

  }

  fetchUserBehaviour(userId: number) {
    this.loginService.getUserBehaviour(userId).subscribe((userBehaviour) => {
      this.userBehaviour = userBehaviour;
    });
  }


}
