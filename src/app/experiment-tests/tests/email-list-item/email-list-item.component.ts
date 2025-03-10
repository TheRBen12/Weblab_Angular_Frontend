import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Email} from '../../../models/email';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-email-list-item',
  imports: [
    MatFabButton,
    MatIcon,
    NgIf
  ],
  templateUrl: './email-list-item.component.html',
  standalone: true,
  styleUrl: './email-list-item.component.css'
})
export class EmailListItemComponent implements OnInit{
  @Input() email: Email|undefined
  @Output() deleteEmailEventEmitter: EventEmitter<Email> = new EventEmitter<Email>();
  capitalLetter = "";
  @Input() isDeleted!: boolean;

  ngOnInit(): void {
    this.capitalLetter = this.email?.sender[0] ?? "";
  }
  delete(){
    this.deleteEmailEventEmitter.emit(this.email);
  }

}
