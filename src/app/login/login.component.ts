import {Component, inject} from '@angular/core';
import {LoginService} from '../services/login.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgClass, NgIf} from '@angular/common';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    MatError,
    MatFormField,
    MatInput,
    NgClass
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
    });
  }
  get email() {
    return this.loginForm.get('email');
  }

}
