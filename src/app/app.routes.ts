import { Routes } from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './shared/guards/auth.guard';
import {ProjectsComponent} from './home/components/projects/projects.component';
import {UserHistoriesComponent} from './home/components/user-histories/user-histories.component';
import {CompaniesComponent} from './home/components/companies/companies.component';

export const routes: Routes = [
  {path: 'auth', component: AuthComponent, canActivate: [AuthGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
    {path: '', component: CompaniesComponent},
    {path:'projects', component: ProjectsComponent},
    {path: 'projects/:id', component: UserHistoriesComponent},
  ]},
  {path: '**', redirectTo: 'auth', pathMatch: 'full'},
];
