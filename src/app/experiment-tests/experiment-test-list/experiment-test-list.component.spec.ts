import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentTestListComponent } from './experiment-test-list.component';

describe('ExperimentTestListComponent', () => {
  let component: ExperimentTestListComponent;
  let fixture: ComponentFixture<ExperimentTestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperimentTestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentTestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
