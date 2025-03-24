import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackPartTwoComponent } from './feedback-part-two.component';

describe('FeedbackPartTwoComponent', () => {
  let component: FeedbackPartTwoComponent;
  let fixture: ComponentFixture<FeedbackPartTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackPartTwoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackPartTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
