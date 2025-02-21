import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentTestExecutionComponent } from './experiment-test-execution.component';

describe('ExperimentTestExecutionComponent', () => {
  let component: ExperimentTestExecutionComponent;
  let fixture: ComponentFixture<ExperimentTestExecutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperimentTestExecutionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentTestExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
