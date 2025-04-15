import {Experiment} from './experiment';
import {UserSetting} from './user-setting';

export interface UserNavigationTime {

  fromExperimentId? : number|null
  toExperimentId: number
  finishedNavigation: Date;
  startedNavigation: Date;
  userSettingId: number
  userId: number;
  numberClicks: number;
  usedRoutes?: string
}
