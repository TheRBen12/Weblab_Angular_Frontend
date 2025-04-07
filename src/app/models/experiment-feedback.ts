export interface ExperimentFeedback {
  [key: string]: string|number;
  mentalModel: number;
  cognitiveStress: number;
  consistency: number;
  structure: number;
  learnability: number;
  text: string;
  userId: number;
  experimentTestId: number;

}
