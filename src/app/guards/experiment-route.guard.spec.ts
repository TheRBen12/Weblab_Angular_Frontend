import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { experimentRouteGuard } from './experiment-route.guard';

describe('experimentRouteGuard', () => {
  const executeGuard: CanDeactivateFn<unknown> = (...guardParameters) => 
      TestBed.runInInjectionContext(() => experimentRouteGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
