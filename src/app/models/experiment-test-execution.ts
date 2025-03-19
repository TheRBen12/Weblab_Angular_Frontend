export interface ExperimentTestExecution {

  id?: number;
  userId?: number;
  experimentTestId: number;
  startedExecutionAt: Date;
  finishedExecutionAt?: Date,
  executionTime?: number;
  state: string;

}
