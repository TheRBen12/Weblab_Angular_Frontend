import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestorffEmailListItemComponent } from './restorff-email-list-item.component';

describe('RestorffEmailListItemComponent', () => {
  let component: RestorffEmailListItemComponent;
  let fixture: ComponentFixture<RestorffEmailListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestorffEmailListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestorffEmailListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
