import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavigationComponent} from './navigation/navigation/navigation.component';
import {WelcomeHelpModalComponent} from './welcome-help-modal/welcome-help-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatFabButton} from '@angular/material/button';
import {HttpClient} from '@angular/common/http';
import {TooltipModule} from 'ngx-bootstrap/tooltip';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavigationComponent,
    WelcomeHelpModalComponent,
    MatIconModule, MatFabButton,
    TooltipModule
  ],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Weblab';
  closedModal = false;
  http = inject(HttpClient)
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




