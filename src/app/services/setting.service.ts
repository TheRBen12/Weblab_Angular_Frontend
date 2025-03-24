import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserSetting} from '../models/user-setting';
import {FormGroup} from '@angular/forms';
import {User} from '../models/user';
import {NavigationSetting} from '../models/navigation-setting';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  http = inject(HttpClient);

  constructor() { }


  saveSettings(settings: UserSetting): Observable<UserSetting>{
    return this.http.post<UserSetting>("https://localhost:7147/api/setting/new", settings)
  }

  fetchLastSetting(userId: Number | undefined): Observable<UserSetting>{
    return this.http.get<UserSetting>("https://localhost:7147/api/setting", {params: {userId: String(userId)}});
  }

  saveNavigationSettings(navigationSetting: NavigationSetting): Observable<NavigationSetting>{
    return this.http.post<NavigationSetting>("https://localhost:7147/api/setting/navigation/new", navigationSetting);
  }

  fetchNavigationSetting(userId: number): Observable<NavigationSetting> {
    return this.http.get<NavigationSetting>("https://localhost:7147/api/setting/navigation/find", {params: {userId: String(userId)}});

  }
}
