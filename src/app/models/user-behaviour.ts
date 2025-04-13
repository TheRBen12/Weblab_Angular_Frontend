export interface UserBehaviour {
  clickedOnSettingsAt?: Date|null;
  id?: number;
  clickedOnHelp?: boolean;
  numberClickedOnHelp: number;
  numberClickedOnSettings: number;
  startedUserExperienceAt?: Date;
  clickedOnSettings?: boolean;
  user?: number;
  timeReadingWelcomeModal?: number
  welcomeModalTipIndex?: number;
  clickedOnHint?: boolean;
  numberClickedOnHint: number;
  lastUpdatedAt: Date,
  clickedOnSettingsAfterHintDisplayed: boolean

}
