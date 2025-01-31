import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import {provideExperimentalZonelessChangeDetection} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ToastrService} from 'ngx-toastr';
import {provideAnimations} from '@angular/platform-browser/animations';
import {CompaniesService} from '../../../shared/services/companies.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  const toastService = {
    error: () => {}
  };

  const companiesServiceMock = {
    getCompanies: async ()  => [{id: 1, name: 'name', address: 'address', phone: '2131211', email: 'email', nit: 'asdasd'}],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, HttpClientTestingModule],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        {provide: ToastrService, useValue: toastService},
        provideAnimations(),
        {provide: CompaniesService, useValue: companiesServiceMock}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to validate register form', async () => {
    const toastSpy = spyOn(component['toastService'], 'error').and.returnValues();
    await component.register();
    expect(toastSpy).toHaveBeenCalled();
  });

  it('should be able to validate backend errors', async () => {
    component.registerForm.setValue({
      name: 'Nombre',
      email: 'correo@correo.es',
      password: 'Pass1234',
      companyId: 1,
    });
    const spy = spyOn(component['authService'], 'register').and.rejectWith({error: {message: 'Email already exists'}});
    await component.register();
    expect(spy).toHaveBeenCalled();
    component.changePasswordVisibility({stopPropagation: () => {}} as any);
  });

  it('should be able to register and redirect to home', async () => {
    component.registerForm.setValue({
      name: 'Nombre',
      email: 'correo@correo.es',
      password: 'Pass1234',
      companyId: 1,
    });
    const spy = spyOn(component['authService'], 'register').and.resolveTo();
    spyOn(component['router'], 'navigateByUrl').and.resolveTo();
    await component.register();
    expect(spy).toHaveBeenCalled();
    component.changePasswordVisibility({stopPropagation: () => {}} as any);
  });

  it('should be able to manage error when cannot get companies list', async () => {
    const spy = spyOn(component['companiesService'], 'getCompanies').and.rejectWith();
    await component.getCompanies();
    expect(spy).toHaveBeenCalled();
  });

});
