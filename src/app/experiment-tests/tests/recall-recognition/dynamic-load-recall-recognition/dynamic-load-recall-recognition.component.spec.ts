import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicLoadRecallRecognitionComponent } from './dynamic-load-recall-recognition.component';

describe('DynamicLoadRecallRecognitionComponent', () => {
  let component: DynamicLoadRecallRecognitionComponent;
  let fixture: ComponentFixture<DynamicLoadRecallRecognitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicLoadRecallRecognitionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicLoadRecallRecognitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
