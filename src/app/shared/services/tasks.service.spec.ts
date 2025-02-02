import { TestBed } from '@angular/core/testing';

import { TasksService } from './tasks.service';
import {provideExperimentalZonelessChangeDetection} from '@angular/core';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()]
    });
    service = TestBed.inject(TasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
