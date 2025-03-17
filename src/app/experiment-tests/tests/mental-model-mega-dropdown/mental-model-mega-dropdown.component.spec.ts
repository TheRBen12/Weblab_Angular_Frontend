import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentalModelMegaDropdownComponent } from './mental-model-mega-dropdown.component';

describe('MentalModelMegaDropdownComponent', () => {
  let component: MentalModelMegaDropdownComponent;
  let fixture: ComponentFixture<MentalModelMegaDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentalModelMegaDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentalModelMegaDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
