import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackPartOneComponent } from './feedback-part-one.component';

describe('FeedbackPartOneComponent', () => {
  let component: FeedbackPartOneComponent;
  let fixture: ComponentFixture<FeedbackPartOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackPartOneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackPartOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
