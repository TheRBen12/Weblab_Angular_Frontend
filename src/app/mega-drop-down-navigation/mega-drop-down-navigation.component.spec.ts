import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MegaDropDownNavigationComponent } from './mega-drop-down-navigation.component';

describe('MegaDropDownNavigationComponent', () => {
  let component: MegaDropDownNavigationComponent;
  let fixture: ComponentFixture<MegaDropDownNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MegaDropDownNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MegaDropDownNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
