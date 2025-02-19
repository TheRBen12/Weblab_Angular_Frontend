import {Experiment} from './experiment';

export interface ExperimentTest {
  name: string,
  position: number;
  description: string;
  estimatedExecutionTime: number;
  state: string;
  experiment: Experiment|null;
}
