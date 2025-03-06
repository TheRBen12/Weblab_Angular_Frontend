import { TestBed } from '@angular/core/testing';

import { SideMenuService } from './side-menu.service';

describe('RecallRecognitionPartOneService', () => {
  let service: SideMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SideMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
