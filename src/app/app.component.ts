import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavigationComponent} from './navigation/navigation/navigation.component';
import {WelcomeHelpModalComponent} from './welcome-help-modal/welcome-help-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatFabButton} from '@angular/material/button';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {LoginService} from './services/login.service';
import {User} from './models/user';
import {ToastrModule} from 'ngx-toastr';
import {filter, switchMap} from 'rxjs';
import {SettingService} from './services/setting.service';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavigationComponent,
    WelcomeHelpModalComponent,
    MatIconModule, MatFabButton,
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




