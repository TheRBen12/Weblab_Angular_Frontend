import {Component, Input} from '@angular/core';
import {Experiment} from '../../models/experiment';
import {NgIf, NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-experiment',
  imports: [
    NgIf, NgClass, RouterLink
  ],
  standalone: true,
  templateUrl: './experiment.component.html',
  styleUrl: './experiment.component.css'
})
export class ExperimentComponent {
  @Input() experiment: Experiment = {name: "", state: "", position: 0, id: 0, numberExperimentTest: 0};
  @Input() currentUserPosition = 0;
  @Input() isProgressiveVisualization: boolean = true;
}
