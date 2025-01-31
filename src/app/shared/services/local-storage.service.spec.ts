import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';
import {provideExperimentalZonelessChangeDetection} from '@angular/core';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  let mockLocalStorage: Storage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()]
    });
    service = TestBed.inject(LocalStorageService);

    mockLocalStorage = {
      getItem: jasmine.createSpy('getItem'),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem'),
      clear: jasmine.createSpy('clear'),
      key: jasmine.createSpy('key'),
      length: 0,
    } as any;

    spyOnProperty(window, 'localStorage', 'get').and.returnValue(mockLocalStorage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be able to save item in local storage', () => {
    service.setItem('testKey', 'testValue');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('testKey', 'testValue');
  });

  it('should be able to get item from local storage', () => {
    mockLocalStorage.getItem = jasmine.createSpy('getItem').and.returnValue('testValue');
    expect(service.getItem('testKey')).toBe('testValue');
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('testKey');
  });

  it('should be able to delete item from local storage', () => {
    service.removeItem('testKey');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('testKey');
  });

  it('should be able to validate if exist item in local storage', () => {
    mockLocalStorage.getItem = jasmine.createSpy('getItem').and.returnValue('testValue');
    expect(service.itemExists('testKey')).toBeTrue();
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('testKey');
  });

  it('should be able to return false when item doesnt exists in local storage', () => {
    mockLocalStorage.getItem = jasmine.createSpy('getItem').and.returnValue(null);
    expect(service.itemExists('testKey')).toBeFalse();
  });
});
