import { TestBed } from '@angular/core/testing';

import { ProfileService } from './profile.service';
import {provideExperimentalZonelessChangeDetection} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
