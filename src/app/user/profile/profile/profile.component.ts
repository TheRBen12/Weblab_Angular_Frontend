import {Component, inject, Input, OnInit, signal} from '@angular/core';
import {User} from '../../../models/user';
import {LoginService} from '../../../services/login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [],
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  @Input() user: User | null = null;
  router = inject(Router);
  accountService = inject(LoginService);
  capitalLetter = "";



  ngOnInit(): void {
    this.accountService.user$.subscribe((user) => {
      this.user = user;
      this.capitalLetter = this.user?.prename[0] ?? "";
    })
  }
  logout(): void{
    this.accountService.logout();
    this.router.navigateByUrl("/login");
  }

}
