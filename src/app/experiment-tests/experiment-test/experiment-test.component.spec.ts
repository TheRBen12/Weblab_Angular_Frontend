import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentTestComponent } from './experiment-test.component';

describe('ExperimentTestComponent', () => {
  let component: ExperimentTestComponent;
  let fixture: ComponentFixture<ExperimentTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperimentTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
