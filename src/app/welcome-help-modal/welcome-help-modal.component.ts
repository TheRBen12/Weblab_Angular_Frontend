import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose} from '@angular/material/dialog';
import {NgIf} from '@angular/common';


@Component({
  selector: 'app-welcome-help-modal',
  imports: [
    MatDialogClose,
    NgIf
  ],
  standalone: true,
  templateUrl: './welcome-help-modal.component.html',
  styleUrl: './welcome-help-modal.component.css'
})
export class WelcomeHelpModalComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {title: string, showFooter: boolean}) {
  }
  closeModal(){
    sessionStorage.setItem('closedModal', 'closed');
  }
}
