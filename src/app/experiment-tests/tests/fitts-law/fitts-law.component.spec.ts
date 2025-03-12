import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FittsLawComponent } from './fitts-law.component';

describe('FittsLawComponent', () => {
  let component: FittsLawComponent;
  let fixture: ComponentFixture<FittsLawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FittsLawComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FittsLawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
