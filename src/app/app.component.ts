import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {LoginService} from './services/login.service';
import {User} from './models/user';
import {ToastrModule} from 'ngx-toastr';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatIconModule,
    TooltipModule,
    ToastrModule
  ],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  loginService = inject(LoginService);
  constructor() {
  }

  ngOnInit(): void {
    const currentUserString = localStorage.getItem('user');
    if (currentUserString){
      const user: User = JSON.parse(currentUserString);
      this.loginService.refreshUser(user.email);
    }

  }

}




