import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {LoginService} from '../../services/login.service';
import {User} from '../../models/user';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-navigation',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './navigation.component.html',
  standalone: true,
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  loginService = inject(LoginService);
  currentUser: User | null

  constructor() {
    this.currentUser = this.loginService.getCurrentUser();

  }

}
