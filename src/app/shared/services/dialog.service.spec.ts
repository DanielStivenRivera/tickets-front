import { TestBed } from '@angular/core/testing';

import { DialogService } from './dialog.service';
import {provideExperimentalZonelessChangeDetection} from '@angular/core';

describe('DialogService', () => {
  let service: DialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()]
    });
    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
