export interface User {
  email: string,
  id: number,
  group: string,
  currentExperimentPos: number
  name: string,
  prename: string
  clickedOnHelp: boolean;
  numberClickedOnHelp: number;
  numberClickedOnSettings: number;
  startedUserExperienceAt: Date;
  finishedUserExperienceAt: Date;
  clickedOnSettings: boolean;

}
