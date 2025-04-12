import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingHintDialogComponent } from './setting-hint-dialog.component';

describe('SettingHintDialogComponent', () => {
  let component: SettingHintDialogComponent;
  let fixture: ComponentFixture<SettingHintDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingHintDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingHintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
