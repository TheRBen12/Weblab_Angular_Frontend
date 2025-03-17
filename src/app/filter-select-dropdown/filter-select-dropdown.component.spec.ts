import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSelectDropdownComponent } from './filter-select-dropdown.component';

describe('FilterSelectDropdownComponent', () => {
  let component: FilterSelectDropdownComponent;
  let fixture: ComponentFixture<FilterSelectDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterSelectDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterSelectDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
