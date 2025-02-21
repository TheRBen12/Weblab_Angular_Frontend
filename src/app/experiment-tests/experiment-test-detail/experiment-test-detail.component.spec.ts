import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentTestDetailComponent } from './experiment-test-detail.component';

describe('ExperimentTestDetailComponent', () => {
  let component: ExperimentTestDetailComponent;
  let fixture: ComponentFixture<ExperimentTestDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperimentTestDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentTestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
