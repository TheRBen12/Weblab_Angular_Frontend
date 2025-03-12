import {Component, inject, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {LoginService} from '../../services/login.service';
import {User} from '../../models/user';
import {NgClass, NgIf} from '@angular/common';

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
export class NavigationComponent {
  loginService = inject(LoginService);
  router = inject(Router);
  currentUser: User | null
  currentLink: string = "Experimente"

  constructor() {
    this.currentUser = this.loginService.getCurrentUser();
  }
  logout(){
    this.loginService.logout();
  }

  setCurrentLink(link: string) {
    this.currentLink = link;
  }
}
