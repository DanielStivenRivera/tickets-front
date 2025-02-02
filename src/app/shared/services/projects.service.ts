import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CreateProject, Project} from '../types/project.interface';
import {lastValueFrom} from 'rxjs';
import {environment} from '../../../environments/environment';
import {BasicCreation} from '../types/basic-creation.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(
    private http: HttpClient,
  ) { }

  getProjects(companyId: number): Promise<Project[]> {
    const params = new HttpParams()
      .set('companyId', companyId);
    return lastValueFrom(this.http.get<Project[]>(`${environment.apiUrl}/projects`, {params}));
  }

  async createProject(body: CreateProject): Promise<void> {
    await lastValueFrom(this.http.post<Project>(`${environment.apiUrl}/projects`, body));
  }

  async editProject(id: number, body: BasicCreation): Promise<void> {
    await lastValueFrom(this.http.patch(`${environment.apiUrl}/projects/${id}`, body));
  }

  async deleteProject(id: number): Promise<void> {
    await lastValueFrom(this.http.delete(`${environment.apiUrl}/projects/${id}`));
  }

  getProjectById(id: number): Promise<Project> {
    return lastValueFrom(this.http.get<Project>(`${environment.apiUrl}/projects/${id}`));
  }

}
