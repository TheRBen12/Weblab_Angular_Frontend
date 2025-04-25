import {Component, inject, OnInit} from '@angular/core';
import {SideNavigationComponent} from '../side-navigation/side-navigation.component';
import {SearchBarComponent} from '../search-bar/search-bar.component';
import {NgClass, NgIf} from '@angular/common';
import {NavigationComponent} from '../navigation/navigation/navigation.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Router} from '@angular/router';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {FormsModule} from '@angular/forms';
import {NavigationSetting} from '../models/navigation-setting';
import {SettingService} from '../services/setting.service';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MegaDropDownNavigationComponent} from '../mega-drop-down-navigation/mega-drop-down-navigation.component';

@Component({

  animations: [
    trigger('selectedState', [
      state('open', style({'opacity': 1})),
      state('closed', style({'opacity': 0})),
      transition('open => closed', [animate('500ms ease-out')]),
      transition('closed => open', [animate('500ms ease-in')]),

    ])
  ],

  selector: 'app-navigation-select',
  imports: [
    SideNavigationComponent,
    SearchBarComponent,
    NgIf,
    NavigationComponent,
    MatRadioButton,
    MatRadioGroup,
    FormsModule,
    NgClass,
    MatCard,
    MatCardContent,
    MatProgressSpinner,
    MegaDropDownNavigationComponent
  ],
  templateUrl: './navigation-select.component.html',
  standalone: true,
  styleUrl: './navigation-select.component.css'
})
export class NavigationSelectComponent implements OnInit {
  navigationSelectionIndex: number = 2;
  settingService: SettingService = inject(SettingService);
  router = inject(Router);
  loading: boolean = false;

  constructor() {
  }

  saveNavigationSelection() {
    this.loading = true;
    const navigationSetting: NavigationSetting = {
      horizontalNavigation: this.navigationSelectionIndex == 2,
      sideNavigationSearchbarBottom: this.navigationSelectionIndex == 1,
      sideNavigationSearchBarTop: this.navigationSelectionIndex == 0,
      sideNavigationUserInformationTop: this.navigationSelectionIndex == 3,
      megaDropDown: this.navigationSelectionIndex == 4,
      leftSideNavigation: this.navigationSelectionIndex == 5,
      userId: history.state.userId,
    };
    this.settingService.saveNavigationSettings(navigationSetting).subscribe((settings) => {

      setTimeout(() => {
        this.loading = false;
        this.router.navigateByUrl("/")

      }, 2000);

    })
  }

  ngOnInit(): void {
    history.state
  }
}
