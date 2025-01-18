import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeHelpModalComponent } from './welcome-help-modal.component';

describe('WelcomeHelpModalComponent', () => {
  let component: WelcomeHelpModalComponent;
  let fixture: ComponentFixture<WelcomeHelpModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeHelpModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeHelpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
