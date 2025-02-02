import {ChangeDetectionStrategy, Component, OnInit, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {AuthService} from '../shared/services/auth.service';
import {UserData} from '../shared/types/user-data.interface';
import {ProfileService} from '../shared/services/profile.service';
import {LoadingService} from '../shared/services/loading.service';
import {CompaniesService} from '../shared/services/companies.service';

@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  userData = signal<UserData | undefined>(undefined);

  constructor(
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
    private loadingService: LoadingService,
    public companiesService: CompaniesService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.loadingService.setLoading(true);
    await this.getProfileData();
    this.loadingService.setLoading(false);
  }

  async getProfileData(): Promise<void> {
    try {
      this.userData.set(await this.profileService.getProfileData());
    } catch (e) {
      console.error(e);
    }
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    delete this.companiesService._selectedCompany;
  }

}
