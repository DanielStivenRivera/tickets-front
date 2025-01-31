import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';

@Component({
  selector: 'app-auth',
  imports: [LoginComponent, RegisterComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent {

  section = signal<'login' | 'register'>('login');

  changeSection(section: 'register' | 'login'): void {
    this.section.set(section);
  }

}
