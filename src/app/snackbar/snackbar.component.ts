import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-snackbar',
  imports: [
    NgClass
  ],
  templateUrl: './snackbar.component.html',
  standalone: true,
  styleUrl: './snackbar.component.css'
})
export class SnackbarComponent {
 @Input() largeBtn: boolean = false;
 @Output() undoEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

 emitUndo(){
   this.undoEventEmitter.emit(true)
 }

}
