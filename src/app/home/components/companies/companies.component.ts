import {ChangeDetectionStrategy, Component, OnInit, signal} from '@angular/core';
import {CompaniesService} from '../../../shared/services/companies.service';
import {Company} from '../../../shared/types/companies.interface';
import {LoadingService} from '../../../shared/services/loading.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-companies',
  imports: [],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompaniesComponent implements OnInit {

  companies = signal<Company[]>([]);

  constructor(
    private readonly companiesService: CompaniesService,
    private readonly loadingService: LoadingService,
    private readonly toastService: ToastrService,
    private readonly router: Router,
  ) {
  }

  async ngOnInit():Promise<void> {
    this.loadingService.setLoading(true);
    await this.getCompanies();
    this.loadingService.setLoading(false);
  }

  async getCompanies(): Promise<void> {
    try {
      this.companies.set(await this.companiesService.getCompanies());
    } catch (e) {
      this.toastService.error('No se han podido cargar las compañias');
      console.error(e);
    }
  }

  async selectCompany(company: Company): Promise<void> {
    this.companiesService.selectCompany(company);
    await this.router.navigateByUrl('/home/projects');
  }

}
