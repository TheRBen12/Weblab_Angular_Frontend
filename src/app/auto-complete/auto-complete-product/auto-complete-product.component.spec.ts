import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCompleteProductComponent } from './auto-complete-product.component';

describe('AutoCompleteProductComponent', () => {
  let component: AutoCompleteProductComponent;
  let fixture: ComponentFixture<AutoCompleteProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoCompleteProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoCompleteProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
