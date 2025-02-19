import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentTestIndexComponent } from './experiment-test-index.component';

describe('ExperimentTestIndexComponent', () => {
  let component: ExperimentTestIndexComponent;
  let fixture: ComponentFixture<ExperimentTestIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperimentTestIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentTestIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
