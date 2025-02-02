import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {lastValueFrom} from 'rxjs';
import {Company} from '../types/companies.interface';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {


  private _selectedCompany: Company;

  get selectedCompany (): Company {
    return this._selectedCompany;
  }

  constructor(
    private readonly http: HttpClient,
  ) { }

  async getCompanies(): Promise<Company[]> {
    return  lastValueFrom(this.http.get<Company[]>(`${environment.apiUrl}/companies`));
  }

  async getCompanyId(id: number): Promise<Company> {
    return lastValueFrom(this.http.get<Company>(`${environment.apiUrl}/companies/${id}`));
  }

  selectCompany(company: Company) {
    this._selectedCompany = company;
  }

}
