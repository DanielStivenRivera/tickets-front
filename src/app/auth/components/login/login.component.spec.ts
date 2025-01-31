import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {provideExperimentalZonelessChangeDetection} from '@angular/core';
import {AuthService} from '../../../shared/services/auth.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ToastrService} from 'ngx-toastr';
import {provideAnimations} from '@angular/platform-browser/animations';
import {of} from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const toastService = {
    error: () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        AuthService,
        {provide: ToastrService, useValue: toastService},
        provideAnimations(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to validate form and show toast error', async () => {
    const toastSpy = spyOn(component['toastService'], 'error').and.returnValues();
    await component.login();
    expect(toastSpy).toHaveBeenCalled();
    component.changePasswordVisibility({stopPropagation: () => {}} as any);
  });

  it('should be able to show toast when credentials are invalid', async () => {
    component.loginForm.setValue({
      email: 'correo@correo.es',
      password: 'Pass12345'
    });
    const spy = spyOn(component['authService'], 'login').and.returnValues(Promise.reject({error: {message: 'Invalid email or password'}}));
    await component.login();
    expect(spy).toHaveBeenCalled();
  });

  it('should be able to login and redirect to home', async () => {
    component.loginForm.setValue({
      email: 'correo@correo.es',
      password: 'Pass12345'
    });
    const spy = spyOn(component['authService'], 'login').and.resolveTo();
    const validateTokenSpy = spyOn(component['localStorageService'], 'itemExists').and.returnValues(true);
    spyOn(component['router'], 'navigateByUrl').and.resolveTo();
    await component.login();
    expect(spy).toHaveBeenCalled();
    expect(validateTokenSpy).toHaveBeenCalled();
  });

});
