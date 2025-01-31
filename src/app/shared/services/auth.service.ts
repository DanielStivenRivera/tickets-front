import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ILogin} from '../types/login.interface';
import {environment} from '../../../environments/environment';
import {lastValueFrom} from 'rxjs';
import {AuthResponseInterface} from '../types/auth-response.interface';
import {RegisterInterface} from '../types/register.interface';
import {LocalStorageService} from './local-storage.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly http: HttpClient,
    private readonly localStorageService: LocalStorageService,
    private router: Router,
  ) { }

  async login(loginBody: ILogin): Promise<void> {
    const resp = await lastValueFrom(this.http.post<AuthResponseInterface>(`${environment.apiUrl}/auth/login`, loginBody));
    this.localStorageService.setItem('token', resp.token);
  }

  async register(registerBody: RegisterInterface): Promise<void> {
    const resp = await lastValueFrom(this.http.post<AuthResponseInterface>(`${environment.apiUrl}/auth/register`, registerBody));
    this.localStorageService.setItem('token', resp.token);
  }

  async logout(): Promise<void> {
    this.localStorageService.removeItem('token');
    await this.router.navigateByUrl('/auth');
  }

}
