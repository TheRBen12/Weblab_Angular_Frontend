import { Component } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'app-email-menu',
  imports: [MatButtonModule, MatMenuModule, MatIcon, NgIf, RouterLink],
  templateUrl: './email-menu.component.html',
  standalone: true,
  styleUrl: './email-menu.component.css'
})
export class EmailMenuComponent {
  menuToggled: boolean = false;
  toggleMenu(){
    this.menuToggled = !this.menuToggled;
  }
  navigate(){

  }
}
