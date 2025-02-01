import { Routes } from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './shared/guards/auth.guard';
import {ProjectsComponent} from './home/components/projects/projects.component';
import {TaskListComponent} from './home/components/task-list/task-list.component';

export const routes: Routes = [
  {path: 'auth', component: AuthComponent, canActivate: [AuthGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
    {path: '', component: ProjectsComponent},
    {path: 'project/:id', component: TaskListComponent},
  ]},
  {path: '**', redirectTo: 'auth', pathMatch: 'full'},
];
