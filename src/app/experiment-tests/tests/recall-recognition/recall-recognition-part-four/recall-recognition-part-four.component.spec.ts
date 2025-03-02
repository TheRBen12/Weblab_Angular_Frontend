import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecallRecognitionPartFourComponent } from './recall-recognition-part-four.component';

describe('RecallRecognitionPartFourComponent', () => {
  let component: RecallRecognitionPartFourComponent;
  let fixture: ComponentFixture<RecallRecognitionPartFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecallRecognitionPartFourComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecallRecognitionPartFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
