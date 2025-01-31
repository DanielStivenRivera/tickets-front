import { TestBed } from '@angular/core/testing';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    localStorageService = jasmine.createSpyObj('LocalStorageService', ['setItem', 'removeItem']);
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: LocalStorageService, useValue: localStorageService },
        { provide: Router, useValue: router },
      ],
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(AuthService);
  });

  describe('Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('Login', () => {
    it('should store token after successful login', async () => {
      const mockResponse = { token: 'testToken' };
      const spy = spyOn(service['http'], 'post').and.returnValues(of(mockResponse));
      await service.login({ email: 'test@example.com', password: 'password' });
      expect(spy).toHaveBeenCalled();
      expect(localStorageService.setItem).toHaveBeenCalledWith('token', 'testToken');
    });
  });

  describe('Register', () => {
    it('should store token after successful registration', async () => {
      const mockResponse = { token: 'testToken' };
      const spy = spyOn(service['http'], 'post').and.returnValues(of(mockResponse));
      await service.register({ email: 'test@example.com', password: 'password', name: 'name', companyId: 1 });
      expect(spy).toHaveBeenCalled();
      expect(localStorageService.setItem).toHaveBeenCalledWith('token', 'testToken');
    });
  });

  describe('Logout', () => {
    it('should remove token and navigate to auth page', async () => {
      await service.logout();
      expect(localStorageService.removeItem).toHaveBeenCalledWith('token');
      expect(router.navigateByUrl).toHaveBeenCalledWith('/auth');
    });
  });
});
