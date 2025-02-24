import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentTestInstructionComponent } from './experiment-test-instruction.component';

describe('ExperimentTestInstructionComponent', () => {
  let component: ExperimentTestInstructionComponent;
  let fixture: ComponentFixture<ExperimentTestInstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperimentTestInstructionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentTestInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
