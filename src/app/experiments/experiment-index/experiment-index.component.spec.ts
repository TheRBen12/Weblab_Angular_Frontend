import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentIndexComponent } from './experiment-index.component';

describe('ExperimentIndexComponent', () => {
  let component: ExperimentIndexComponent;
  let fixture: ComponentFixture<ExperimentIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperimentIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
