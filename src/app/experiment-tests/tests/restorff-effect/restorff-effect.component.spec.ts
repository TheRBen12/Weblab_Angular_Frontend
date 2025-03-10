import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestorffEffectComponent } from './restorff-effect.component';

describe('RestorffEffectComponent', () => {
  let component: RestorffEffectComponent;
  let fixture: ComponentFixture<RestorffEffectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestorffEffectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestorffEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
