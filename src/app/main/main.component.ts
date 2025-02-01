import { Component } from '@angular/core';
import {WelcomeHelpModalComponent} from '../welcome-help-modal/welcome-help-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {NavigationComponent} from '../navigation/navigation/navigation.component';
import {RouterOutlet} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatFabButton} from '@angular/material/button';

@Component({
  selector: 'app-main',
  imports: [
    NavigationComponent,
    RouterOutlet,
    MatIcon,
    MatFabButton
  ],
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  title = 'Weblab';
  closedModal = false;

  constructor(private dialog: MatDialog) {
  }
  ngOnInit(){
    if (sessionStorage.getItem('closedModal') == '' || sessionStorage.getItem('closedModal') == null){
      this.openWelcomeHelpModal("Bevor Sie loslegen, hier einige Tipps", true)
    }
  }
  openWelcomeHelpModal(title: string, showFooter: boolean){
    const dialogRef = this.dialog.open(WelcomeHelpModalComponent, {
        disableClose: true,
        data: {title: title, showFooter: showFooter}
      }
    );
    dialogRef.afterClosed().subscribe(() => {
      sessionStorage.setItem('closedModal', 'closed');
    });
  }
}
