import {Component, Input} from '@angular/core';
import {MatFormField} from '@angular/material/select';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatFabButton} from '@angular/material/button';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-side-navigation',
  imports: [
    MatDrawerContainer,
    MatFormField,
    MatIcon,
    MatFormField,
    MatButton,
    MatDrawer,
    MatFabButton,
    NgIf
  ],
  templateUrl: './side-navigation.component.html',
  standalone: true,
  styleUrl: './side-navigation.component.css'
})
export class SideNavigationComponent {
  showFiller = false;
  @Input() showLogoutAndProfile: boolean = true;

}
