import { Routes } from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './shared/guards/auth.guard';
import {ProjectsComponent} from './home/components/projects/projects.component';

export const routes: Routes = [
  {path: 'auth', component: AuthComponent, canActivate: [AuthGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
    {path: '', component: ProjectsComponent}
  ]},
  {path: '**', redirectTo: 'auth', pathMatch: 'full'},
];
