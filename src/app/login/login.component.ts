import {Component, inject} from '@angular/core';
import {LoginService} from '../services/login.service';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  router = inject(Router);
  loginForm = new FormGroup({
    email: new FormControl(""),
  });
  loginService = inject(LoginService);

  loginRequest() {
    const email = this.loginForm.value.email ? this.loginForm.value.email : "";
    this.loginService.login(email).subscribe((user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.loginService.setUser(user);
        this.router.navigateByUrl("/");
      }
    })
  }

}
