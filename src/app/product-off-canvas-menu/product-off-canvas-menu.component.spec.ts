import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOffCanvasMenuComponent } from './product-off-canvas-menu.component';

describe('ProductOffCanvasMenuComponent', () => {
  let component: ProductOffCanvasMenuComponent;
  let fixture: ComponentFixture<ProductOffCanvasMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductOffCanvasMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductOffCanvasMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
