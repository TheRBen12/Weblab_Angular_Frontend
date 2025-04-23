import {Component, effect, inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {ExperimentService} from '../services/experiment.service';
import {Experiment} from '../models/experiment';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ExperimentTest} from '../models/experiment-test';
import {LoginService} from '../services/login.service';
import {UserBehaviour} from '../models/user-behaviour';
import {RouterService} from '../services/router.service';
import {filter} from 'rxjs';

@Component({

  animations: [
    trigger('hoverState', [
      state('closed', style({transform: 'translateY(-10px)', 'height': '0px'})),
      state('open', style({opacity: 1, transform: 'translateY(0)', 'min-height': '100px',})),
      transition('closed => open', animate('0.5s ease-out')),
      transition('open => closed', animate('0.5s ease-in'))
    ]),

  ],
  selector: 'app-mega-drop-down-navigation',
  imports: [
    RouterLink,
    NgForOf,
    NgClass
  ],
  templateUrl: './mega-drop-down-navigation.component.html',
  standalone: true,
  styleUrl: './mega-drop-down-navigation.component.css'
})
export class MegaDropDownNavigationComponent implements OnInit, OnChanges {
  experimentService: ExperimentService = inject(ExperimentService);
  loginService: LoginService = inject(LoginService);
  routerService: RouterService = inject(RouterService);
  router: Router = inject(Router);
  experiments: Experiment[] = [];
  showExperimentMenu: boolean = false;
  showExperimentTestMenu: boolean = false;
  currentSelectedExperiment: Experiment | null = null;
  experimentTests: ExperimentTest[] = [];
  pointerInExperimentMenu: boolean = false;
  pointerInExperimentTestMenu: boolean = false;
  pointerInHeaderMenu: boolean = false;
  @Input() noPointerEvents: boolean = true;
  @Input() showMenu!: boolean;
  currentRoute: string = "Experimente";
  userBehaviour!: UserBehaviour


  constructor() {

    effect(() => {
      const userId = this.loginService.currentUser()?.id;
      if (userId) {
        this.loginService.getUserBehaviour(userId).subscribe((userBehaviour) => {
          this.userBehaviour = userBehaviour;
        })
      }
    });
  }


  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => (event instanceof NavigationEnd)))
      .subscribe((sub) => {
        if (this.router.url.includes("/tests/")) {
          this.currentRoute = "";
        }
      });
    this.currentRoute = this.routerService.rebuildCurrentNavigationRoute(this.router.url);

    this.loginService.getUserBehaviourSubscription().subscribe((userBehaviour) => {
      if (userBehaviour) {
        this.userBehaviour = userBehaviour;
      }
    });
    this.experimentService.getExperiments().subscribe((experiments) => {
      this.experiments = experiments;
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.currentSelectedExperiment) {
      this.experimentService.getExperimentTestsByExperiment(this.currentSelectedExperiment.id).subscribe((tests) => {
        this.experimentTests = this.sortExperimentTestsByPosition(tests);
      });
    }
  }


  displayExperimentTestContainer(experiment: Experiment) {
    this.currentSelectedExperiment = experiment;
    this.experimentService.getExperimentTestsByExperiment(this.currentSelectedExperiment.id).subscribe((tests) => {
      this.experimentTests = tests;
      this.showExperimentTestMenu = true;
    });
  }

  sortExperimentTestsByPosition(experiments: ExperimentTest[]) {
    experiments = experiments.sort((exp1, exp2) => {
      return Number(exp1.position) - Number(exp2.position);
    });
    return experiments;
  }


  displayExperimentMenu() {
    this.experimentService.getExperiments().subscribe((experiments) => {
      this.experiments = experiments;
      this.showExperimentMenu = true;
      this.pointerInHeaderMenu = true;
    });

  }

  hideExperimentTestMenu() {
    this.showExperimentTestMenu = false;
  }

  hideExperimentMenu() {
    this.experiments = [];
    this.showExperimentMenu = false;
    if (!this.pointerInExperimentTestMenu) {
      this.hideExperimentTestMenu();
    }
  }

  checkToHideExperimentMenu() {
    if (!this.pointerInHeaderMenu) {
      setTimeout(() => {
        if (!this.pointerInExperimentTestMenu && !this.pointerInExperimentMenu) {
          this.hideExperimentMenu();
        }
      }, 1800);
    }

  }

  checkIfDisplayExperimentTestMenu(experiment: Experiment) {
    if (this.showExperimentMenu) {
      this.displayExperimentTestContainer(experiment);
    }
  }

  checkToHideExperimentTestMenu() {
    setTimeout(() => {
      if (!this.pointerInExperimentMenu) {
        this.hideExperimentTestMenu();
      }
      if (!this.pointerInExperimentMenu) {
        this.hideExperimentMenu();
      }
    }, 1800)
  }

  logout() {
    this.loginService.logout();
    this.router.navigateByUrl("/login");
  }

  enterExperimentTestMenu() {
    this.pointerInExperimentMenu = false;
    this.pointerInExperimentTestMenu = true;
  }

  enterExperimentMenu() {
    this.pointerInExperimentMenu = true;
    this.pointerInExperimentTestMenu = false;
  }

  leaveHeaderMenu() {
    this.pointerInHeaderMenu = false;
    this.checkToHideExperimentMenu()
  }

  leaveExperimentMenu() {
    this.pointerInExperimentMenu = false;
    this.checkToHideExperimentMenu();
  }

  setCurrentRoute(route: string) {
    this.currentRoute = route;
    if (route == "Einstellungen") {
      this.userBehaviour = this.loginService.increaseNumberClickedSettings(this.userBehaviour);
      this.updateUserBehaviour(this.userBehaviour);
    } else if (route == "Hilfe") {
      if (!this.userBehaviour.clickedOnSettingsAt){
        this.userBehaviour.clickedOnSettingsAt = new Date();
      }
      this.userBehaviour = this.loginService.increaseNumberClickedHelp(this.userBehaviour);
      this.updateUserBehaviour(this.userBehaviour);
    }
  }

  updateUserBehaviour(userBehaviour: UserBehaviour) {
    this.loginService.updateUserBehaviour(userBehaviour).subscribe((behaviour) => {
      this.userBehaviour = behaviour;
    });
  }
}
