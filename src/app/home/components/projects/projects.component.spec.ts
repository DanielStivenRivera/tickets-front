import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectsComponent } from './projects.component';
import { ProjectsService } from '../../../shared/services/projects.service';
import { Router } from '@angular/router';
import { DialogService } from '../../../shared/services/dialog.service';
import { ProfileService } from '../../../shared/services/profile.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import {provideExperimentalZonelessChangeDetection} from '@angular/core';

class ProjectsServiceMock {
  getProjects() {
    return Promise.resolve([{ id: 1, title: 'Project 1' }]);
  }
  createProject(project: any) {
    return Promise.resolve(project);
  }
  editProject(id: number, project: any) {
    return Promise.resolve(project);
  }
  deleteProject(id: number) {
    return Promise.resolve();
  }
}

class RouterMock {
  navigateByUrl(url: string) {
    return Promise.resolve(true);
  }
}

class DialogServiceMock {
  openCreateModal(title: string, project?: any) {
    return Promise.resolve({ title: 'New Project' });
  }
  openYesNoModal(title: string, message: string) {
    return Promise.resolve('yes');
  }
}

class ProfileServiceMock {
  getProfileData() {
    return Promise.resolve({ companyId: 1 });
  }
}

class LoadingServiceMock {
  setLoading(loading: boolean) {}
}

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let projectsService: ProjectsService;
  let router: Router;
  let dialogService: DialogService;
  let profileService: ProfileService;
  let loadingService: LoadingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        DatePipe,
      ],
      providers: [
        { provide: ProjectsService, useClass: ProjectsServiceMock },
        { provide: Router, useClass: RouterMock },
        { provide: DialogService, useClass: DialogServiceMock },
        { provide: ProfileService, useClass: ProfileServiceMock },
        { provide: LoadingService, useClass: LoadingServiceMock },
        provideExperimentalZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    projectsService = TestBed.inject(ProjectsService);
    router = TestBed.inject(Router);
    dialogService = TestBed.inject(DialogService);
    profileService = TestBed.inject(ProfileService);
    loadingService = TestBed.inject(LoadingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects on init', async () => {
    spyOn(projectsService, 'getProjects').and.callThrough();
    spyOn(loadingService, 'setLoading');
    await component.ngOnInit();
    expect(projectsService.getProjects).toHaveBeenCalled();
    expect(component.projects().length).toBeGreaterThan(0);
    expect(loadingService.setLoading).toHaveBeenCalledWith(true);
    expect(loadingService.setLoading).toHaveBeenCalledWith(false);
  });

  it('should handle error when loading projects', async () => {
    spyOn(projectsService, 'getProjects').and.returnValue(Promise.reject('Error'));
    spyOn(console, 'error');
    await component.getProjects();
    expect(console.error).toHaveBeenCalledWith('Error');
  });

  it('should navigate to project details', async () => {
    spyOn(router, 'navigateByUrl');
    await component.openProject(1);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/home/project/1');
  });

  it('should create a new project', async () => {
    spyOn(dialogService, 'openCreateModal').and.callThrough();
    spyOn(projectsService, 'createProject').and.callThrough();
    spyOn(loadingService, 'setLoading');
    await component.createProject();
    expect(dialogService.openCreateModal).toHaveBeenCalledWith('Crear proyecto');
    expect(projectsService.createProject).toHaveBeenCalled();
    expect(loadingService.setLoading).toHaveBeenCalledWith(true);
    expect(loadingService.setLoading).toHaveBeenCalledWith(false);
  });

  it('should edit a project', async () => {
    const project = { id: 1, title: 'Project 1', description: 'desc' };
    spyOn(dialogService, 'openCreateModal').and.callThrough();
    spyOn(projectsService, 'editProject').and.callThrough();
    spyOn(loadingService, 'setLoading');
    await component.editProject(project as any);
    expect(dialogService.openCreateModal).toHaveBeenCalledWith('Editar proyecto', project);
    expect(projectsService.editProject).toHaveBeenCalledWith(project.id, jasmine.any(Object));
    expect(loadingService.setLoading).toHaveBeenCalledWith(true);
    expect(loadingService.setLoading).toHaveBeenCalledWith(false);
  });

  it('should delete a project', async () => {
    const project = { id: 1, title: 'Project 1', description: 'desc' };
    spyOn(dialogService, 'openYesNoModal').and.callThrough();
    spyOn(projectsService, 'deleteProject').and.callThrough();
    spyOn(loadingService, 'setLoading');
    await component.deleteProject(project as any);
    expect(dialogService.openYesNoModal).toHaveBeenCalledWith('Eliminar proyecto', `Está seguro de eliminar el proyecto <<${project.title}>>?, esta acción es irreversible.`);
    expect(projectsService.deleteProject).toHaveBeenCalledWith(project.id);
    expect(loadingService.setLoading).toHaveBeenCalledWith(true);
    expect(loadingService.setLoading).toHaveBeenCalledWith(false);
  });
});
