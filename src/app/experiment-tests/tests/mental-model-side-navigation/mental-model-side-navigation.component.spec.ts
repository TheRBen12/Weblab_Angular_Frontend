import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentalModelSideNavigationComponent } from './mental-model-side-navigation.component';

describe('MentalModelSideNavigationComponent', () => {
  let component: MentalModelSideNavigationComponent;
  let fixture: ComponentFixture<MentalModelSideNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentalModelSideNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentalModelSideNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
