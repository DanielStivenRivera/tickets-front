import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHistoriesComponent } from './user-histories.component';
import {provideExperimentalZonelessChangeDetection} from '@angular/core';

describe('UserHistoriesComponent', () => {
  let component: UserHistoriesComponent;
  let fixture: ComponentFixture<UserHistoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserHistoriesComponent],
      providers: [provideExperimentalZonelessChangeDetection()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserHistoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
