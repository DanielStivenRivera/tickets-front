import { TestBed } from '@angular/core/testing';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { CompaniesService } from './companies.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import {environment} from '../../../environments/environment';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let httpClientSpy: { get: jasmine.Spy };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: HttpClient, useValue: httpClientSpy }
      ],
    });

    service = TestBed.inject(CompaniesService);
  });

  describe('Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('getCompanies', () => {
    it('should fetch companies from API if not cached', async () => {
      const mockCompanies = [{ id: 1, name: 'Company A' }, { id: 2, name: 'Company B' }];
      httpClientSpy.get.and.returnValue(of(mockCompanies));

      const companies = await service.getCompanies();
      expect(companies).toEqual(mockCompanies as any);
      expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.apiUrl}/companies`);
    });

    it('should return cached companies if already fetched', async () => {
      const mockCompanies = [{ id: 1, name: 'Company A' }];
      service['_companies'] = mockCompanies as any;

      const companies = await service.getCompanies();
      expect(companies).toEqual(mockCompanies as any);
      expect(httpClientSpy.get).not.toHaveBeenCalled();
    });
  });

  describe('getCompanyId', () => {
    it('should return a specific company by ID', async () => {
      const mockCompanies = [{ id: 1, name: 'Company A' }, { id: 2, name: 'Company B' }];
      service['_companies'] = mockCompanies as any;

      const company = await service.getCompanyId(1);
      expect(company).toEqual(mockCompanies[0] as any);
    });

    it('should fetch companies if not cached before searching', async () => {
      const mockCompanies = [{ id: 1, name: 'Company A' }];
      httpClientSpy.get.and.returnValue(of(mockCompanies));

      const company = await service.getCompanyId(1);
      expect(company).toEqual(mockCompanies[0] as any);
      expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.apiUrl}/companies`);
    });
  });
});
