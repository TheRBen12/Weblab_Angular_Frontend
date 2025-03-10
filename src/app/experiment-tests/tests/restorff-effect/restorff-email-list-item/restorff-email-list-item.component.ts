import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Email} from '../../../../models/email';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-restorff-email-list-item',
  imports: [
    MatFabButton,
    MatIcon,
    NgIf
  ],
  templateUrl: './restorff-email-list-item.component.html',
  standalone: true,
  styleUrl: './restorff-email-list-item.component.css'
})
export class RestorffEmailListItemComponent implements OnInit{

  @Input() email: Email|undefined
  @Output() deleteEmailEventEmitter: EventEmitter<Email> = new EventEmitter<Email>();
  capitalLetter = "";
  @Input() isDeleted!: boolean;
  @Input() coloredDeleteButton: boolean = false;


  ngOnInit(): void {
    console.log(this.coloredDeleteButton);
    this.capitalLetter = this.email?.sender[0] ?? "";
  }
  delete(){
    this.deleteEmailEventEmitter.emit(this.email);
  }

}
