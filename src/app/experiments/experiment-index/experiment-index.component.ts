import { Component } from '@angular/core';
import {SearchBarComponent} from '../../search-bar/search-bar.component';

@Component({
  selector: 'app-experiment-index',
  imports: [SearchBarComponent],
  standalone: true,
  templateUrl: './experiment-index.component.html',
  styleUrl: './experiment-index.component.css'
})
export class ExperimentIndexComponent {
  title = "Experimente";
}
