import {Component, inject, OnInit} from '@angular/core';
import {WelcomeHelpModalComponent} from '../welcome-help-modal/welcome-help-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {NavigationComponent} from '../navigation/navigation/navigation.component';
import {RouterOutlet} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatFabButton} from '@angular/material/button';
import {filter, switchMap} from 'rxjs';
import {LoginService} from '../services/login.service';
import {SettingService} from '../services/setting.service';
import {TimeService} from '../services/time.service';

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
export class MainComponent implements OnInit {
  closedModal = false;
  timeService = inject(TimeService);

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    this.timeService.startWelcomeModalTimer()
    if (sessionStorage.getItem('closedModal') == '' || sessionStorage.getItem('closedModal') == null) {
      this.openWelcomeHelpModal("Bevor Sie loslegen, hier einige Tipps", true)
    }
  }

  openWelcomeHelpModal(title: string, showFooter: boolean) {
    const dialogRef = this.dialog.open(WelcomeHelpModalComponent, {
        disableClose: true,
        data: {title: title, showFooter: showFooter}
      }
    );
    dialogRef.afterClosed().subscribe(() => {
      this.timeService.stopWelcomeModalTimer();
      sessionStorage.setItem('closedModal', 'closed');
    });
  }
}
