import {ChangeDetectionStrategy, Component, OnInit, signal} from '@angular/core';
import {ProjectsService} from '../../../shared/services/projects.service';
import {Project} from '../../../shared/types/project.interface';
import {DatePipe} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {Router} from '@angular/router';
import {DialogService} from '../../../shared/services/dialog.service';
import {ProfileService} from '../../../shared/services/profile.service';
import {LoadingService} from '../../../shared/services/loading.service';

@Component({
  selector: 'app-projects',
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent implements OnInit {

  projects = signal<Project[]>([]);

  constructor(
    private readonly projectService: ProjectsService,
    private readonly router: Router,
    private readonly dialogService: DialogService,
    private readonly profileService: ProfileService,
    private loadingService: LoadingService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.loadingService.setLoading(true);
    await this.getProjects();
    this.loadingService.setLoading(false);
  }

  async getProjects(): Promise<void> {
    try {
      const projects = await this.projectService.getProjects();
      this.projects.set(projects);
    } catch (e) {
      console.error(e);
    }
  }

  async openProject(id: number): Promise<void> {
    await this.router.navigateByUrl(`/home/project/${id}`);
  }

  async createProject(): Promise<void> {
    const resp = await this.dialogService.openCreateModal('Crear proyecto');
    if (resp === 'cancel')
      return;
    this.loadingService.setLoading(true);
    try {
      await this.projectService.createProject({...resp, companyId: (await this.profileService.getProfileData()).companyId});
      await this.getProjects();
    } catch (e) {
      console.error(e);
    }
    this.loadingService.setLoading(false);
  }

  async editProject(project: Project): Promise<void> {
    const resp = await this.dialogService.openCreateModal('Editar proyecto', project);
    if (resp === 'cancel')
      return;
    this.loadingService.setLoading(true);
    try {
      await this.projectService.editProject(project.id, resp);
      await this.getProjects();
    } catch (e) {
      console.error(e);
    }
    this.loadingService.setLoading(false);
  }

  async deleteProject(project: Project): Promise<void> {
    const resp = await this.dialogService.openYesNoModal('Eliminar proyecto', `Está seguro de eliminar el proyecto <<${project.title}>>?, esta acción es irreversible.`);
    if (resp === 'no')
      return;
    this.loadingService.setLoading(true);
    try {
      await this.projectService.deleteProject(project.id);
      await this.getProjects();
    }catch (e) {
      console.error(e);
    }
    this.loadingService.setLoading(false);
  }

}
