import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentalModelLeftSideNavigationOffCanvasComponent } from './mental-model-left-side-navigation-off-canvas.component';

describe('MentalModelLeftSideNavigationOffCanvasComponent', () => {
  let component: MentalModelLeftSideNavigationOffCanvasComponent;
  let fixture: ComponentFixture<MentalModelLeftSideNavigationOffCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentalModelLeftSideNavigationOffCanvasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentalModelLeftSideNavigationOffCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
