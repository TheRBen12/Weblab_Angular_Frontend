import { TestBed } from '@angular/core/testing';

import { RouterService } from './router.service';

describe('ProductCategoryRouterLinksService', () => {
  let service: RouterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
