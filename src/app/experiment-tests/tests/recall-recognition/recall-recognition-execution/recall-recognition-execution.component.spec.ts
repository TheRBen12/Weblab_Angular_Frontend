import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecallRecognitionExecutionComponent } from './recall-recognition-execution.component';

describe('RecallRecognitionExecutionComponent', () => {
  let component: RecallRecognitionExecutionComponent;
  let fixture: ComponentFixture<RecallRecognitionExecutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecallRecognitionExecutionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecallRecognitionExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
