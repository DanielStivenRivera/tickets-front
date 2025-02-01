import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProjectsService } from './projects.service';
import {provideExperimentalZonelessChangeDetection} from '@angular/core';
import {of} from 'rxjs';

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProjectsService,
        provideExperimentalZonelessChangeDetection(),
      ]
    });
    service = TestBed.inject(ProjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });



  describe('getProjects', () => {
    it('should return a list of projects', async () => {
      const mockProjects = [{id: 1, name: 'Project 1'}, {id: 2, name: 'Project 2'}];
      const spy = spyOn(service['http'], 'get').and.returnValues(of(mockProjects));
      await service.getProjects();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('createProject', () => {
    it('should create a project', async () => {
      const createProjectPayload = { name: 'New Project' };
      const spy = spyOn(service['http'], 'post').and.returnValues(of({createProjectPayload}));
      await service.createProject(createProjectPayload as any);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('editProject', () => {
    it('should edit a project', async () => {
      const editProjectPayload = { name: 'Updated Project' };
      const projectId = 1;
      const spy = spyOn(service['http'], 'patch').and.returnValues(of({data: ''}));
      await service.editProject(projectId, editProjectPayload as any);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('deleteProject', () => {
    it('should delete a project', async () => {
      const projectId = 1;
      const spy = spyOn(service['http'], 'delete').and.returnValues(of({data: ''}));
      await service.deleteProject(projectId);
      expect(spy).toHaveBeenCalled();
    });
  });
});
