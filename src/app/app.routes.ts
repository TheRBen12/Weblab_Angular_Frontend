import {Routes} from '@angular/router';
import {ExperimentIndexComponent} from './experiments/experiment-index/experiment-index.component';
import {HelpDescriptionComponent} from './help-description/help-description.component';
import {SettingsComponent} from './settings/settings.component';
import {loginGuard} from './guards/login.guard';
import {LoginComponent} from './login/login.component';
import {MainComponent} from './main/main.component';
import {ProfileComponent} from './user/profile/profile/profile.component';
import {ExperimentTestIndexComponent} from './experiment-tests/experiment-test-index/experiment-test-index.component';

export const routes: Routes = [
  {
    path: '', component: MainComponent, canActivate: [loginGuard], children: [
      {path: '', component: ExperimentIndexComponent},
      {path: 'help', component: HelpDescriptionComponent},
      {path: 'settings', component: SettingsComponent},
      {path: 'profile', component: ProfileComponent},
      {
        path: 'tests/:expId', component: ExperimentTestIndexComponent,
      },
    ]
  },
  {
    path: "login", component: LoginComponent
  },

];
