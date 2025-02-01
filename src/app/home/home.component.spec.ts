import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import {provideExperimentalZonelessChangeDetection} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AuthService} from '../shared/services/auth.service';
import {ProfileService} from '../shared/services/profile.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, HttpClientTestingModule],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        {provide: AuthService, useValue: {logout: () => {}}},
        {provide: ProfileService, useValue: {
          getProfileData: () => ({name: '', company: ''})
        }}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.logout();
  });
});
