import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MegaDropDownMenuComponent } from './mega-drop-down-menu.component';

describe('MegaDropDownMenuComponent', () => {
  let component: MegaDropDownMenuComponent;
  let fixture: ComponentFixture<MegaDropDownMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MegaDropDownMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MegaDropDownMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
