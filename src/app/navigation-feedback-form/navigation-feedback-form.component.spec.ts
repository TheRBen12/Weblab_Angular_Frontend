import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationFeedbackFormComponent } from './navigation-feedback-form.component';

describe('NavigationFeedbackFormComponent', () => {
  let component: NavigationFeedbackFormComponent;
  let fixture: ComponentFixture<NavigationFeedbackFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationFeedbackFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationFeedbackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
