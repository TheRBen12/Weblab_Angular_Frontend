import { Component } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatAccordion} from '@angular/material/expansion';
import {MatTree, MatTreeNode, MatTreeNodeToggle} from '@angular/material/tree';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';


@Component({
  selector: 'app-email-menu',
  imports: [MatButtonModule, MatMenuModule, MatAccordion, MatTree, MatTreeNode, MatIcon, MatTreeNodeToggle, NgIf],
  templateUrl: './email-menu.component.html',
  standalone: true,
  styleUrl: './email-menu.component.css'
})
export class EmailMenuComponent {
  menuToggled: boolean = false;
  toggleMenu(){
    this.menuToggled = !this.menuToggled;
  }
}
