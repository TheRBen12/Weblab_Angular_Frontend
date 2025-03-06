import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HicksLawComponent } from './hicks-law.component';

describe('HicksLawComponent', () => {
  let component: HicksLawComponent;
  let fixture: ComponentFixture<HicksLawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HicksLawComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HicksLawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
