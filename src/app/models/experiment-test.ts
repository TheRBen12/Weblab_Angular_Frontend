import {Experiment} from './experiment';

export interface ExperimentTest {
  id: number;
  name: string;
  position: number;
  description: string;
  estimatedExecutionTime: number;
  state: string;
  experiment: Experiment|null;
  detailDescription: string;
  headDetailDescription: string;
}
