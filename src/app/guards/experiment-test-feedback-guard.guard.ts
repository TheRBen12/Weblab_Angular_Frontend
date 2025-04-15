import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {RouterService} from '../services/router.service';

export const experimentTestFeedbackGuardGuard: CanActivateFn = (route, state) => {
  const  router: Router = inject(Router);
  const lastUrl = router.url;      // z. B. '/tests/index'
  const targetUrl = state.url;
  if (lastUrl.includes("/tests/") && targetUrl.includes("feedback")){
    confirm("Sie sind dabei zurück zum Formular zu navigieren. Bitte benutzen Sie das Navigationsmenu, um zurück zur Experimentauswahl zu gelangen");
    return false;
  }
  return true;
};
