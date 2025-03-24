import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationSelectComponent } from './navigation-select.component';

describe('NavigationSelectComponent', () => {
  let component: NavigationSelectComponent;
  let fixture: ComponentFixture<NavigationSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
