import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentalModelAccordionNavigationComponent } from './mental-model-accordion-navigation.component';

describe('MentalModelAccordionNavigationComponent', () => {
  let component: MentalModelAccordionNavigationComponent;
  let fixture: ComponentFixture<MentalModelAccordionNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentalModelAccordionNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentalModelAccordionNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
