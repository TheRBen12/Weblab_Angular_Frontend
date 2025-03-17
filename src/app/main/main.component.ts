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
import {UserBehaviour} from '../models/user-behaviour';

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
  loginService: LoginService = inject(LoginService);
  userBehaviour: UserBehaviour | null = null;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    if (this.loginService.currentUser()?.id) {
      this.loginService.getUserBehaviour(this.loginService.currentUser()?.id).subscribe((userBehaviour) => {
        this.userBehaviour = userBehaviour;
      });
    }

    if (sessionStorage.getItem('closedModal') == '' || sessionStorage.getItem('closedModal') == null) {
      this.openWelcomeHelpModal("Bevor Sie loslegen, hier einige Tipps", true)
      this.timeService.startWelcomeModalTimer()
    }
  }

  openWelcomeHelpModal(title: string, showFooter: boolean) {
    const dialogRef = this.dialog.open(WelcomeHelpModalComponent, {
        disableClose: true,
        data: {
          title: title,
          showFooter: showFooter,
          userGroup: this.loginService.currentUser()?.group,
          currentTipIndex: 0
        }
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      this.timeService.stopWelcomeModalTimer();
      sessionStorage.setItem('closedModal', 'closed');
      const userBehaviour: UserBehaviour = {
        timeReadingWelcomeModal: this.timeService.getTimeToReadWelcomeModal(),
        welcomeModalTipIndex: dialogRef.componentInstance.data.currentTipIndex,
        user: this.loginService.currentUser()?.id,
        clickedOnHint: false,
        numberClickedOnHelp: 0,
        numberClickedOnSettings: 0
      };
      debugger;
      this.loginService.createUserBehaviour(userBehaviour).subscribe((userBehaviour) => {
        this.userBehaviour = userBehaviour;
        this.loginService.emitUserBehaviour(userBehaviour);
      });
    });
  }
}
