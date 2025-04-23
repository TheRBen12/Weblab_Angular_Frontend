import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-tooltip',
  imports: [],
  templateUrl: './tooltip.component.html',
  standalone: true,
  styleUrl: './tooltip.component.css'
})
export class TooltipComponent {
  @Input() message: string = "";


}
