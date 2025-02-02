import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {LoadingService} from './shared/services/loading.service';
import {CompaniesService} from './shared/services/companies.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatProgressSpinner,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(
    public readonly loadingService: LoadingService,
    private companiesService: CompaniesService,
    private router: Router,
  ) {
  }

  async ngOnInit(): Promise<void> {
    if (!this.companiesService.selectedCompany) {
      await this.router.navigateByUrl('/home');
      return;
    }
  }

}
