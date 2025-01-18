import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-navigation',
  imports: [
    RouterLink
  ],
  templateUrl: './navigation.component.html',
  standalone: true,
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {

}
