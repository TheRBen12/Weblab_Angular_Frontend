import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserSetting} from '../models/user-setting';
import {FormGroup} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  http = inject(HttpClient);

  constructor() { }


  saveSettings(settings: UserSetting): Observable<UserSetting>{
    return this.http.post<UserSetting>("https://localhost:7147/api/user/setting", settings)
  }
}
