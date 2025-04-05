import { CanDeactivateFn } from '@angular/router';

export const experimentRouteGuard: CanDeactivateFn<unknown> = (component: any, currentRoute, currentState, nextState) => {
  if (typeof component.canDeactivate === 'function') {
    return component.canDeactivate();
  }
  return true;
};
