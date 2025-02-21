import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecallRecognitionPartOneComponent } from './recall-recognition-part-one.component';

describe('RecallRecognitionPartOneComponent', () => {
  let component: RecallRecognitionPartOneComponent;
  let fixture: ComponentFixture<RecallRecognitionPartOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecallRecognitionPartOneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecallRecognitionPartOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
