import {Component, Input} from '@angular/core';
import {Experiment} from '../../models/experiment';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-experiment',
  imports: [
    NgIf
  ],
  standalone: true,
  templateUrl: './experiment.component.html',
  styleUrl: './experiment.component.css'
})
export class ExperimentComponent {
  @Input() experiment: Experiment = {title: "", state: ""};
}
