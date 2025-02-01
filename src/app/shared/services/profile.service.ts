import { Injectable } from '@angular/core';
import * as jwtDecode from 'jwt-decode';
import {UserData} from '../types/user-data.interface';
import {LocalStorageService} from './local-storage.service';
import {CompaniesService} from './companies.service';
import {Payload} from '../types/payload.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  _userData: UserData | undefined = undefined;

  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly companiesService: CompaniesService,
  ) { }

  async getProfileData(): Promise<UserData> {
    const token = this.localStorageService.getItem('token');
    const payload = jwtDecode.jwtDecode<Payload>(token);
    this._userData = {
      name: payload.name,
      company: (await this.companiesService.getCompanyId(payload.companyId))?.name ?? '',
      companyId: payload.companyId,
    };
    return this._userData;
  }

}
