import {Component, inject, signal} from '@angular/core';
import {SettingService} from '../services/setting.service';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {UserSetting} from '../models/user-setting';

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
  settingsService = inject(SettingService);
  settingsForm = new FormGroup({
    progressiveVisualizationExperiment: new FormControl(false),
    progressiveVisualizationExperimentTest: new FormControl(false),
    autoStartNextExperiment: new FormControl(false),
  });

  saveSettings(): void {
    const userSetting: UserSetting = {
      progressiveVisualizationExperiment: this.settingsForm.get('progressiveVisualization')?.value,
      progressiveVisualizationExperimentTest: this.settingsForm.get("progressiveVisualizationExperimentTest")?.value,
      autoStartNextExperiment: this.settingsForm.get('autoStartNextExperiment')?.value
    }
    this.settingsService.saveSettings(userSetting).subscribe((settings) => {
      console.log("settings saved");
    });
  }
}
