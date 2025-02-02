import { TestBed } from '@angular/core/testing';

import { UserHistoriesService } from './user-histories.service';
import {provideExperimentalZonelessChangeDetection} from '@angular/core';

describe('UserHistoriesService', () => {
  let service: UserHistoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()]
    });
    service = TestBed.inject(UserHistoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
