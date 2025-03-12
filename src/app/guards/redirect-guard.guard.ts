import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {RouterService} from '../services/router.service';
export const redirectGuardGuard: CanActivateFn = (route, state) => {
  debugger;
  const routerService = inject(RouterService)
  const lastRoute = routerService.getLastKnownRoute();
  const router = inject(Router);
  router.navigateByUrl(lastRoute).then(r => false);
  return false;
};
