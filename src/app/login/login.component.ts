import {Component, inject} from '@angular/core';
import {LoginService} from '../services/login.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgIf} from '@angular/common';


@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    NgIf,
  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  router = inject(Router);
  loginForm = new FormGroup({
    email: new FormControl("", [
      Validators.email,
      Validators.required
    ]),
  });
  loginService = inject(LoginService);
  userIsUnauthorized: boolean = false;
  serverError: boolean = false

  constructor(private toastr: ToastrService) {
  }

  loginRequest() {
    const email = this.loginForm.value.email ? this.loginForm.value.email : "";
    this.loginService.login(email).subscribe((user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.loginService.setUser(user);
        this.router.navigateByUrl("/");
        this.toastr.success("Anmeldung erfolgreich")
      }
    }, (error) => {
      if (error.status == 401) {
        this.userIsUnauthorized = true;
      } else {
        this.serverError = true;
      }
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

}
