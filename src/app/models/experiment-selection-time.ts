import {Experiment} from './experiment';

export interface ExperimentSelectionTime {
  experimentId: number;
  time: number;
  userId: number;
  settingId?: number;
}
