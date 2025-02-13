import {Component, Input} from '@angular/core';
import {Experiment} from '../../models/experiment';
import {NgIf, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-experiment',
  imports: [
    NgIf,
    NgOptimizedImage
  ],
  standalone: true,
  templateUrl: './experiment.component.html',
  styleUrl: './experiment.component.css'
})
export class ExperimentComponent {
  @Input() experiment: Experiment = {name: "", state: "", position: 0};
}
