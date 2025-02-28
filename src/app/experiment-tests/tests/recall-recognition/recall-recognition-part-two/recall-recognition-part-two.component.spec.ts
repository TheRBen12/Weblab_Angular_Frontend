import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecallRecognitionPartTwoComponent } from './recall-recognition-part-two.component';

describe('RecallRecognitionPartTwoComponent', () => {
  let component: RecallRecognitionPartTwoComponent;
  let fixture: ComponentFixture<RecallRecognitionPartTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecallRecognitionPartTwoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecallRecognitionPartTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
