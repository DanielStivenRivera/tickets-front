import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {lastValueFrom} from 'rxjs';
import {CreateUserHistory, UserHistory} from '../types/user-history.interface';
import {BasicCreation} from '../types/basic-creation.interface';

@Injectable({
  providedIn: 'root'
})
export class UserHistoriesService {

  constructor(
    private http: HttpClient,
  ) { }

  getUserHistories(id: number): Promise<UserHistory[]> {
    const params = new HttpParams()
      .set('projectId', id);
    return lastValueFrom(this.http.get<UserHistory[]>(`${environment.apiUrl}/user-histories`, {params}));
  }

  createUserHistory(body: CreateUserHistory): Promise<UserHistory> {
    return lastValueFrom(this.http.post<UserHistory>(`${environment.apiUrl}/user-histories`, body));
  }

  async deleteUserHistory(id: number): Promise<void> {
    await lastValueFrom(this.http.delete(`${environment.apiUrl}/user-histories/${id}`));
  }

  async updateUserHistory(id: number, body: BasicCreation): Promise<void> {
    await lastValueFrom(this.http.patch(`${environment.apiUrl}/user-histories/${id}`, body));
  }

  getUserHistoryById(id: number): Promise<UserHistory> {
    return lastValueFrom(this.http.get<UserHistory>(`${environment.apiUrl}/user-histories/${id}`));
  }
}
