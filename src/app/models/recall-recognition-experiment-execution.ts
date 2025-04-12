export interface RecallRecognitionExperimentExecution {


  id?: number;
  userId?: number|undefined;
  experimentTestId: number;
  finishedExecutionAt?: Date,
  executionTime?: number;
  state: string;
  categoryLinkClickDates: string;
  failedClicks: number;
  experimentTestExecutionId?: number;
  numberClicks: number;
  clickedOnSearchBar? : boolean;
  numberUsedSearchBar?: number;
  timeToClickSearchBar?: number;
  timeToClickFirstCategoryLink?: number;
  usedBreadcrumbs: boolean;
  searchParameters?: string;
}
