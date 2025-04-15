import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { experimentTestFeedbackGuardGuard } from './experiment-test-feedback-guard.guard';

describe('experimentTestFeedbackGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => experimentTestFeedbackGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
