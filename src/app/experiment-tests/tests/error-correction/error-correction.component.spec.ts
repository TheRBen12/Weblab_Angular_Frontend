import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorCorrectionComponent } from './error-correction.component';

describe('ErrorCorrectionComponent', () => {
  let component: ErrorCorrectionComponent;
  let fixture: ComponentFixture<ErrorCorrectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorCorrectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
