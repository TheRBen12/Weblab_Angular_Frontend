import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedUserShopComponent } from './created-user-shop.component';

describe('CreatedUserShopComponent', () => {
  let component: CreatedUserShopComponent;
  let fixture: ComponentFixture<CreatedUserShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatedUserShopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatedUserShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
