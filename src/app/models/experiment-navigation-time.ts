import {Experiment} from './experiment';
import {UserSetting} from './user-setting';

export interface ExperimentNavigationTime {

  fromExperimentId? : number|null
  toExperimentId: number
  endedNavigation: Date;
  startedNavigation: Date|null;
  userSetting: UserSetting|null
}
