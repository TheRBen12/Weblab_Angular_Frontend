import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserSetting} from '../models/user-setting';
import {FormGroup} from '@angular/forms';
import {User} from '../models/user';
import {NavigationSetting} from '../models/navigation-setting';
import {MentalModelShopConfiguration} from '../models/mental-model-shop-configuration';

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


  saveShopNavigationConfiguration(selectedInterFace: MentalModelShopConfiguration): Observable<MentalModelShopConfiguration> {
    return this.http.post<MentalModelShopConfiguration>("https://localhost:7147/api/setting/mental-model/shop/user-navigation/new", selectedInterFace);

  }

  getShopNavigationConfig(userId: number, testId: number) {
    return this.http.get<MentalModelShopConfiguration>("https://localhost:7147/api/setting/mental-model/shop/user-navigation/find", {params: {userId: userId, testId: testId}});

  }


  updateUserShopNavigationConfiguration(selectedInterFace: MentalModelShopConfiguration) {
    return this.http.put<MentalModelShopConfiguration>("https://localhost:7147/api/setting/mental-model/shop/user-navigation/update", selectedInterFace);

  }
}
