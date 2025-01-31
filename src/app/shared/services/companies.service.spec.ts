import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { CompaniesService } from './companies.service';
import {provideExperimentalZonelessChangeDetection} from '@angular/core';
import {Company} from '../types/companies.interface';
import {environment} from '../../../environments/environment';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
      ],
      imports: [BrowserDynamicTestingModule, HttpClientTestingModule]
    });

    service = TestBed.inject(CompaniesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch companies from API if not cached', async () => {
    const mockCompanies: Company[] = [{ id: 1, name: 'Test Company' } as Company];

    service.getCompanies().then(companies => {
      expect(companies).toEqual(mockCompanies);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/companies`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCompanies);
  });

  it('should return cached companies if already fetched', async () => {
    const mockCompanies: Company[] = [{ id: 1, name: 'Test Company' } as Company];
    service['_companies'] = mockCompanies;

    const companies = await service.getCompanies();
    expect(companies).toEqual(mockCompanies);
  });
});
