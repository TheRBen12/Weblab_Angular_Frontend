import {Component, effect, inject, OnInit} from '@angular/core';
import {WelcomeHelpModalComponent} from '../welcome-help-modal/welcome-help-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {NavigationComponent} from '../navigation/navigation/navigation.component';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatFabButton} from '@angular/material/button';
import {LoginService} from '../services/login.service';
import {TimeService} from '../services/time.service';
import {UserBehaviour} from '../models/user-behaviour';
import {SettingService} from '../services/setting.service';
import {NavigationSetting} from '../models/navigation-setting';
import {NgClass, NgIf} from '@angular/common';
import {SideNavigationComponent} from '../side-navigation/side-navigation.component';
import {MegaDropDownNavigationComponent} from '../mega-drop-down-navigation/mega-drop-down-navigation.component';

@Component({
  selector: 'app-main',
  imports: [
    NavigationComponent,
    RouterOutlet,
    MatIcon,
    MatFabButton,
    NgIf,
    SideNavigationComponent,
    MegaDropDownNavigationComponent,
    NgClass,
    RouterLink,
  ],
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  closedModal = false;
  router: Router = inject(Router);
  timeService = inject(TimeService);
  loginService: LoginService = inject(LoginService);
  userBehaviour?: UserBehaviour | null = null;
  settingService: SettingService = inject(SettingService);
  protected navigationSetting?: NavigationSetting;
  private numberNavigationClicks: number = 0;

  constructor(private dialog: MatDialog) {

    effect(() => {
      const userId = this.loginService.currentUser()?.id;
      if (userId) {
        this.loginService.getUserBehaviour(userId).subscribe((userBehaviour) => {
          this.userBehaviour = userBehaviour;
        })
        this.settingService.fetchNavigationSetting(userId).subscribe((setting) => {
          this.navigationSetting = setting;
        }, (error) => {
          if (error) {
            console.log(error)
          }
        })

      }
    });
  }

  ngOnInit() {
    localStorage.setItem("numberNavigationClicks", "0");

    const user = this.loginService.currentUser();
    const userId = user?.id;
    if (userId) {
      this.settingService.fetchNavigationSetting(userId).subscribe((navigationSetting) => {
        this.navigationSetting = navigationSetting
      });
      this.loginService.getUserBehaviourSubscription().subscribe((userBehaviour) => {
        if (userBehaviour) {
          this.userBehaviour = userBehaviour;
        }
      });
    }


    if ((sessionStorage.getItem("closedModal") == "" || sessionStorage.getItem('closedModal') == null) && user?.group != "C") {
      this.openWelcomeHelpModal("Bevor Sie loslegen, hier einige Tipps", true)
      this.timeService.startWelcomeModalTimer();
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
      if (!this.userBehaviour) {
        const userBehaviour: UserBehaviour = {
          timeReadingWelcomeModal: this.timeService.getTimeToReadWelcomeModal(),
          welcomeModalTipIndex: dialogRef.componentInstance.data.currentTipIndex,
          user: this.loginService.currentUser()?.id,
          clickedOnHint: false,
          numberClickedOnHelp: 0,
          numberClickedOnSettings: 0,
          numberClickedOnHint: 0,
          lastUpdatedAt: new Date(),
        };
        this.loginService.createUserBehaviour(userBehaviour).subscribe((userBehaviour) => {
          this.userBehaviour = userBehaviour;
          this.loginService.emitUserBehaviour(userBehaviour);
        });
      } else {
        if (this.userBehaviour) {
          this.userBehaviour.numberClickedOnHint = this.userBehaviour.numberClickedOnHint + 1;
          this.userBehaviour.clickedOnHint = true;
        }

        this.loginService.updateUserBehaviour(this.userBehaviour).subscribe((behaviour) => {
          this.userBehaviour = behaviour;
        });
      }
    });
  }

  increaseNumberNavigationClicks() {
    const n = localStorage.getItem("numberNavigationClicks");
    if (n) {
      this.numberNavigationClicks = Number(n) + 1;
    }
    localStorage.setItem('numberNavigationClicks', String(this.numberNavigationClicks));
  }

  logout() {
    this.loginService.logout();
    this.router.navigateByUrl("/login");
  }
}
