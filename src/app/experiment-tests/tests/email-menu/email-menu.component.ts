import {Component, EventEmitter, Output} from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NgClass, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'app-email-menu',
  imports: [MatButtonModule, MatMenuModule, MatIcon, NgIf, RouterLink, NgClass],
  templateUrl: './email-menu.component.html',
  standalone: true,
  styleUrl: './email-menu.component.css'
})
export class EmailMenuComponent {
  menuToggled: boolean = false;
  @Output() onMenuItemSelected = new EventEmitter<string>();
  currentItems: string = "mails";
  toggleMenu(){
    this.menuToggled = !this.menuToggled;
  }

  emitOnDeletedItemsSelected(value: string){
    this.currentItems = value;
    this.onMenuItemSelected.emit(value);
  }

}
