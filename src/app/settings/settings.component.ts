import {Component, inject, OnInit, signal} from '@angular/core';
import {SettingService} from '../services/setting.service';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {UserSetting} from '../models/user-setting';
import {LoginService} from '../services/login.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  constructor(private toastrService: ToastrService, private router: Router) {
  }

  accountService = inject(LoginService);
  settingsService = inject(SettingService);
  settingsForm = new FormGroup({
    progressiveVisualizationExperiment: new FormControl(false),
    progressiveVisualizationExperimentTest: new FormControl(false),
    autoStartNextExperiment: new FormControl(false),
  });

  saveSettings(): void {
    const userSetting: UserSetting = {
      progressiveVisualizationExperiment: this.settingsForm.get('progressiveVisualizationExperiment')?.value,
      progressiveVisualizationExperimentTest: this.settingsForm.get("progressiveVisualizationExperimentTest")?.value,
      autoStartNextExperiment: this.settingsForm.get('autoStartNextExperiment')?.value,
      userId: this.accountService.currentUser()?.id
    }
    this.settingsService.saveSettings(userSetting).subscribe((settings) => {
      if (settings) {
        this.toastrService.success("Ihre Einstellungen wurden gespeichert", "", {easeTime: 1000,})
        this.router.navigateByUrl("/");
      }
    }, error => {
      if (error) {
        this.toastrService.error("Ihre EInstellungen konnten leider nciht gespeichert werden. " +
          "Versuchen Sie es nocheinmal");
      }
    });
  }

  ngOnInit(): void {
    this.accountService.user$.subscribe((user) => {
      this.fetchSettings(user?.id)
    })

  }

  fetchSettings(userId: Number | undefined) {
    this.settingsService.fetchLastSetting(userId).subscribe((setting) => {
      this.settingsForm.patchValue({
        progressiveVisualizationExperiment: setting.progressiveVisualizationExperiment,
        progressiveVisualizationExperimentTest: setting.progressiveVisualizationExperimentTest,
        autoStartNextExperiment: setting.autoStartNextExperiment,
      });
    })
  }

}
