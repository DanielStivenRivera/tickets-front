import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {lastValueFrom} from 'rxjs';
import {Company} from '../types/companies.interface';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  private _companies: Company[];

  constructor(
    private readonly http: HttpClient,
  ) { }

  async getCompanies(): Promise<Company[]> {
    if (!this._companies) {
      this._companies = await lastValueFrom(this.http.get<Company[]>(`${environment.apiUrl}/companies`));
    }
    return this._companies;
  }

  async getCompanyId(id: number): Promise<Company> {
    if (!this._companies) {
      await this.getCompanies();
    }
    return this._companies.find(item => item.id === id);
  }

}
