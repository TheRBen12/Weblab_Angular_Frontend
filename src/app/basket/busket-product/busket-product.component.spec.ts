import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusketProductComponent } from './busket-product.component';

describe('BusketProductComponent', () => {
  let component: BusketProductComponent;
  let fixture: ComponentFixture<BusketProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusketProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusketProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
