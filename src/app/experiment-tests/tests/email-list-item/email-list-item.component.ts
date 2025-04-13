import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {Email} from '../../../models/email';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-email-list-item',
  imports: [
    MatFabButton,
    MatIcon,
    NgIf,
    NgClass
  ],
  templateUrl: './email-list-item.component.html',
  standalone: true,
  styleUrl: './email-list-item.component.css'
})
export class EmailListItemComponent implements OnInit, OnChanges{
  @Input() email: Email|undefined
  @Output() deleteEmailEventEmitter: EventEmitter<Email> = new EventEmitter<Email>();
  @Output() emailSelectEmitter: EventEmitter<number> = new EventEmitter<number>();

  capitalLetter = "";
  @Input() isDeleted!: boolean;
  @Input() coloredMark: boolean = false;
  @Input() deletedMailId!: number;
  @Input() clickedInDeletedItems!: boolean | undefined;
  @Input() selectedEmailId?: number;

  ngOnInit(): void {
    this.capitalLetter = this.email?.sender[0] ?? "";
    console.log(this.coloredMark);
  }
  delete(){
    this.deleteEmailEventEmitter.emit(this.email);
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  selectEmail() {
    this.emailSelectEmitter.emit(this.email?.id);
  }
}
