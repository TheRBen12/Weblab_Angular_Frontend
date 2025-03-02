import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecallRecognitionPartThreeComponent } from './recall-recognition-part-three.component';

describe('RecallRecognitionPartThreeComponent', () => {
  let component: RecallRecognitionPartThreeComponent;
  let fixture: ComponentFixture<RecallRecognitionPartThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecallRecognitionPartThreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecallRecognitionPartThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
