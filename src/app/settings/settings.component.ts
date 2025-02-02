import {Component, inject, signal} from '@angular/core';
import {SettingService} from '../services/setting.service';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {UserSetting} from '../models/user-setting';
import {LoginService} from '../services/login.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  imports: [
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  constructor(private toastrService: ToastrService) {
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
      if (settings){
        this.toastrService.success("Ihre EInstellungen wurden erfokgreich gespeichert")
      }
    }, error => {
      if (error){
        this.toastrService.error("Ihre EInstellungen konnten leider nciht gespeichert werden. " +
          "Versuchen Sie es nocheinmal");
      }
    });
  }
}
