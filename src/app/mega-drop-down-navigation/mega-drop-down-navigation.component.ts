import {Component, inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {ExperimentService} from '../services/experiment.service';
import {Experiment} from '../models/experiment';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ExperimentTest} from '../models/experiment-test';
import {LoginService} from '../services/login.service';

@Component({

  animations: [
    trigger('hoverState', [
      state('closed', style({ transform: 'translateY(-10px)', 'height': '0px'})),
      state('open', style({ opacity: 1, transform: 'translateY(0)', 'min-height': '100px', })),
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
export class MegaDropDownNavigationComponent implements OnInit, OnChanges{
  experimentService: ExperimentService = inject(ExperimentService);
  loginService: LoginService = inject(LoginService);
  router: Router = inject(Router);
  experiments: Experiment[] = [];
  showExperimentMenu: boolean = false;
  showExperimentTestMenu: boolean = false;
  currentSelectedExperiment: Experiment|null = null;
  experimentTests: ExperimentTest[] = [];
  pointerInExperimentMenu: boolean = false;
  pointerInExperimentTestMenu: boolean = false;
  pointerInHeaderMenu: boolean = false;
  @Input() noPointerEvents: boolean = true;
  @Input() showMenu!: boolean;


  constructor() {
  }
  ngOnInit(): void {
    this.experimentService.getExperiments().subscribe((experiments) => {
      this.experiments = experiments;
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    if(this.currentSelectedExperiment ){
      this.experimentService.getExperimentTestsByExperiment(this.currentSelectedExperiment.id).subscribe((tests) => {
        this.experimentTests = tests;
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
    if (!this.pointerInExperimentTestMenu){
      this.hideExperimentTestMenu();
    }
    //this.checkToHideExperimentTestMenu();
  }

  checkToHideExperimentMenu() {
    if (!this.pointerInHeaderMenu){
      setTimeout(() => {
        if (!this.pointerInExperimentTestMenu && !this.pointerInExperimentMenu){
          this.hideExperimentMenu();
        }
      }, 1800)
    }

  }


  checkIfDisplayExperimentTestMenu(experiment: Experiment) {
    if (this.showExperimentMenu){
      this.displayExperimentTestContainer(experiment);
    }
  }

  checkToHideExperimentTestMenu() {
    setTimeout(() => {
      if (!this.pointerInExperimentMenu){
        this.hideExperimentTestMenu();
      }
      if (!this.pointerInExperimentMenu){
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
}
