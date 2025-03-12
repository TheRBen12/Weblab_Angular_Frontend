import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentalModelLeftSideNavigationComponent } from './mental-model-left-side-navigation.component';

describe('MentalModelLeftSideNavigationComponent', () => {
  let component: MentalModelLeftSideNavigationComponent;
  let fixture: ComponentFixture<MentalModelLeftSideNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentalModelLeftSideNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentalModelLeftSideNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
