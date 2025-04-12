import { Component } from '@angular/core';
import {MatDialogClose} from '@angular/material/dialog';

@Component({
  selector: 'app-setting-hint-dialog',
  imports: [
    MatDialogClose
  ],
  templateUrl: './setting-hint-dialog.component.html',
  standalone: true,
  styleUrl: './setting-hint-dialog.component.css'
})
export class SettingHintDialogComponent {

  closeModal() {
    localStorage.setItem("closedSettingHint", "closed")
  }
}
