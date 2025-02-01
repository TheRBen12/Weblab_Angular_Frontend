import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDescriptionComponent } from './help-description.component';

describe('HelpDescriptionComponent', () => {
  let component: HelpDescriptionComponent;
  let fixture: ComponentFixture<HelpDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
