import {Routes} from '@angular/router';
import {ExperimentIndexComponent} from './experiments/experiment-index/experiment-index.component';
import {HelpDescriptionComponent} from './help-description/help-description.component';
import {SettingsComponent} from './settings/settings.component';
import {loginGuard} from './guards/login.guard';
import {LoginComponent} from './login/login.component';
import {MainComponent} from './main/main.component';
import {ProfileComponent} from './user/profile/profile/profile.component';
import {ExperimentTestIndexComponent} from './experiment-tests/experiment-test-index/experiment-test-index.component';
import {
  ExperimentTestDetailComponent
} from './experiment-tests/experiment-test-detail/experiment-test-detail.component';
import {
  ExperimentTestExecutionComponent
} from './experiment-tests/experiment-test-execution/experiment-test-execution.component';
import {
  RecallRecognitionPartOneComponent
} from './experiment-tests/tests/recall-recognition/recall-recognition-part-one/recall-recognition-part-one.component';
import {
  RecallRecognitionPartTwoComponent
} from './experiment-tests/tests/recall-recognition/recall-recognition-part-two/recall-recognition-part-two.component';

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
      {path: 'tests/detail/:testId', component: ExperimentTestDetailComponent},
      {
        path: 'test/execute', component: ExperimentTestExecutionComponent, children: [

          {
            path: 'recall-recognition/0', component: RecallRecognitionPartOneComponent, children: [
              {
                path: '',
                loadChildren: () => import('./experiment-tests/tests/recall-recognition/products-module/products.module').then(m => m.ProductsModule)
              }
            ]
          },
          {
            path: 'recall-recognition/1', component: RecallRecognitionPartTwoComponent, children: [
              {
                path: '',
                loadChildren: () => import('./experiment-tests/tests/recall-recognition/products-module/products.module').then(m => m.ProductsModule)
              }
            ]
          }

        ]

      }
    ]
  },
  {
    path: "login", component: LoginComponent
  },

];
