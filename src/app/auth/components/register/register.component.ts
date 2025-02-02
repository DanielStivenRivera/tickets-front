import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, signal} from '@angular/core';
import {CompaniesService} from '../../../shared/services/companies.service';
import {ToastrService} from 'ngx-toastr';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {AuthService} from '../../../shared/services/auth.service';
import {Router} from '@angular/router';
import {LoadingService} from '../../../shared/services/loading.service';

@Component({
  selector: 'app-register',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {

  @Output()
    changeSection: EventEmitter<'login'> = new EventEmitter<'login'>();

  registerForm: FormGroup;

  hide = signal(true);

  constructor(
    private readonly companiesService: CompaniesService,
    private readonly toastService: ToastrService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private loadingService: LoadingService,
  ) {
    this.initializeForm();
  }


  async getCompanies(): Promise<void> {
    try {
    } catch (e) {
      console.error(e);
      this.toastService.error('No se pudo obtener la lista de compañias');
    }
  }

  private initializeForm() {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z\\d]{8,}$')]),
    });
  }

  async register(): Promise<void> {
    this.registerForm.markAllAsTouched();
    this.registerForm.markAsDirty();
    if (this.registerForm.invalid) {
      this.toastService.error('Valide la información del formulario');
      return;
    }
    this.loadingService.setLoading(true);
    try {
      await this.authService.register(this.registerForm.value);
      await this.router.navigateByUrl('/home');
    } catch (e) {
      if (e.error.message === 'Email already exists') {
        this.toastService.error('El correo ya se encuentra registrado');
      }
      console.error(e);
    }
    this.loadingService.setLoading(false);
  }


  changePasswordVisibility(_event: MouseEvent): void {
    this.hide.set(!this.hide());
  }
}
