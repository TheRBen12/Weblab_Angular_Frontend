import {ExperimentTest} from './experiment-test';

export interface ExperimentTestExecution {

  id?: number;
  userId?: number;
  experimentTestId: number;
  startedExecutionAt: Date;
  finishedExecutionAt?: Date,
  executionTime?: number;
  state: string;
  experimentTest?: ExperimentTest;
  openedDescAt: Date;
  timeReadingDescription: number;

}
