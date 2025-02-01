import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {LoginService} from '../services/login.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  if (loginService.currentUser() || loginService.getCurrentUser()){
    return true;
  }
  router.navigateByUrl("/login");
  return false;

};
