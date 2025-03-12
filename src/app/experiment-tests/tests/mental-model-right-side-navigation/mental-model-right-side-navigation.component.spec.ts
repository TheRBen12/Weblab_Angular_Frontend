import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentalModelRightSideNavigationComponent } from './mental-model-right-side-navigation.component';

describe('MentalModelRightSideNavigationComponent', () => {
  let component: MentalModelRightSideNavigationComponent;
  let fixture: ComponentFixture<MentalModelRightSideNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentalModelRightSideNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentalModelRightSideNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
