import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentTestFeedbackComponent } from './experiment-test-feedback.component';

describe('ExperimentTestFeedbackComponent', () => {
  let component: ExperimentTestFeedbackComponent;
  let fixture: ComponentFixture<ExperimentTestFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperimentTestFeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentTestFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
