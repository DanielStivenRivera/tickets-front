import {ChangeDetectionStrategy, Component, EventEmitter, Output, signal} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {AuthService} from '../../../shared/services/auth.service';
import {LocalStorageService} from '../../../shared/services/local-storage.service';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  hide = signal(true);

  errors= signal<{
    email: string | null,
    password: string | null,
  }>({email: null, password: null});

  loginForm: FormGroup;

  @Output()
    changeSection: EventEmitter<'register'> = new EventEmitter<'register'>();

  changePasswordVisibility (event: MouseEvent): void {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  constructor(
    private readonly authService: AuthService,
    private readonly localStorageService: LocalStorageService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private toastService: ToastrService,
  ) {
    this.initializeForm();
  }

  async login(): Promise<void> {
    this.loginForm.markAsDirty();
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      this.toastService.error('Validar los campos que contienen errores');
      return;
    }
    try {
      await this.authService.login(this.loginForm.value);
      if (this.localStorageService.itemExists('token')) {
        await this.router.navigateByUrl('/home');
      }
    } catch (e) {
      console.error(e);
      if (e.error.message === 'Invalid email or password') {
        this.toastService.error('Credenciales no validas');
      }
    }
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z\\d]{8,}$')]),
    });
  }

}
