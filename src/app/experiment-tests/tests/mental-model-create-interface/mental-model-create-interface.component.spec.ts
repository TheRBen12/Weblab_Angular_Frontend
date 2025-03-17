import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentalModelCreateInterfaceComponent } from './mental-model-create-interface.component';

describe('MentalModelCreateInterfaceComponent', () => {
  let component: MentalModelCreateInterfaceComponent;
  let fixture: ComponentFixture<MentalModelCreateInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentalModelCreateInterfaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentalModelCreateInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
