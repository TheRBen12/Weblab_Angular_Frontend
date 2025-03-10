import {Component, Input} from '@angular/core';
import {Email} from '../../../../models/email';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-email-detail',
  imports: [
  ],
  templateUrl: './email-detail.component.html',
  standalone: true,
  styleUrl: './email-detail.component.css'
})
export class EmailDetailComponent {
  @Input() email: Email|null = null;
}
