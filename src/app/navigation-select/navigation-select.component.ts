import { Component } from '@angular/core';
import {SideNavigationComponent} from '../side-navigation/side-navigation.component';
import {SearchBarComponent} from '../search-bar/search-bar.component';
import {NgClass, NgIf} from '@angular/common';
import {NavigationComponent} from '../navigation/navigation/navigation.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {RouterLink} from '@angular/router';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {FormsModule} from '@angular/forms';

@Component({

  animations: [
    trigger('selectedState', [
      state('open', style({'opacity': 1})),
      state('closed', style({'opacity': 0} )),
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
    RouterLink,
    MatRadioButton,
    MatRadioGroup,
    FormsModule,
    NgClass
  ],
  templateUrl: './navigation-select.component.html',
  standalone: true,
  styleUrl: './navigation-select.component.css'
})
export class NavigationSelectComponent {
  navigationSelectionIndex: number = 0;

  saveNavigationSelection() {

  }
}
