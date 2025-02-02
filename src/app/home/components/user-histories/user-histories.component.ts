import {ChangeDetectionStrategy, Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingService} from '../../../shared/services/loading.service';
import {UserHistoriesService} from '../../../shared/services/user-histories.service';
import {ProjectsService} from '../../../shared/services/projects.service';
import {Project} from '../../../shared/types/project.interface';
import {ToastrService} from 'ngx-toastr';
import {UserHistoryReactive} from '../../../shared/types/user-history.interface';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';
import {Task, TaskStatus} from '../../../shared/types/task.interface';
import {CommonModule} from '@angular/common';
import {DialogService} from '../../../shared/services/dialog.service';
import {TasksService} from '../../../shared/services/tasks.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user-histories',
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatDivider,
    CommonModule,
  ],
  templateUrl: './user-histories.component.html',
  styleUrl: './user-histories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserHistoriesComponent implements OnInit {

  projectData = signal<Project | undefined>(undefined);
  userHistories = signal<UserHistoryReactive[]>([]);

  taskStatus = TaskStatus;

  updateTaskSubs: Subscription;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private userHistoriesService: UserHistoriesService,
    private projectsService: ProjectsService,
    private toastService: ToastrService,
    private dialogService: DialogService,
    private taskService: TasksService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    const projectId = this.route.snapshot.params['id'];
    if (!projectId) {
      await this.router.navigateByUrl('/home/projects');
      return;
    }
    this.loadingService.setLoading(true);
    await this.getProject(projectId);
    await this.getUserHistories(projectId);
    this.loadingService.setLoading(false);
    this.updateTaskSubs = this.taskService.updateTask.subscribe(async (data) => {
      if (data.updated) {
        this.userHistories().find(history => history.id === data.task.userHistoryId)?.tasks.update(tasks => tasks.map(item => item.id === data.task.id ? {...data.task} : {...item}));
      }
    });
  }

  async getProject(id: number): Promise<void> {
    try {
      this.projectData.set(await this.projectsService.getProjectById(id));
    } catch (e) {
      this.toastService.error('Error al obtener los datos del proyecto');
      console.error(e);
    }
  }

  async getUserHistories(id: number): Promise<void> {
    try {
      const resp = await this.userHistoriesService.getUserHistories(id);

      this.userHistories.set(resp.map(item => ({...item, tasks: signal(item.tasks)})));
    } catch (e) {
      this.toastService.error('Error al obtener las historias de usuario');
      console.error(e);
    }
  }

  async createUserHistory(): Promise<void> {
    const resp = await this.dialogService.openCreateModal('CREAR HISTORIA DE USUARIO');
    if (resp === 'cancel')
      return;
    this.loadingService.setLoading(true);
    try {
      const userHistory = await this.userHistoriesService.createUserHistory({...resp, projectId: this.projectData().id});
      this.userHistories.update(histories => [...histories, {...userHistory, tasks: signal(userHistory.tasks)}]);
      this.toastService.success('Historia de usuario creada exitosamente');
    }catch (e) {
      this.toastService.error('Ha ocurrido un error inesperado');
      console.error(e);
    }
    this.loadingService.setLoading(false);
  }

  async deleteUserHistory(event: MouseEvent, userHistory: UserHistoryReactive): Promise<void> {
    event.stopPropagation();
    const resp = await this.dialogService.openYesNoModal('ELIMINAR HISTORIA DE USUARIO', `¿Desea eliminar la historia de usuario << ${userHistory.title} >>?. Esta acción no es reversible.`);
    if (resp === 'not')
      return;
    this.loadingService.setLoading(true);
    try {
      await this.userHistoriesService.deleteUserHistory(userHistory.id);
      this.userHistories.update(histories => histories.filter(item => item.id !== userHistory.id));
      this.toastService.success('Historia de usuario eliminada exitosamente');
    } catch (e) {
      this.toastService.error('Ha ocurrido un error inesperado.');
      console.error(e);
    }
    this.loadingService.setLoading(false);
  }

  async updateUserHistory(event: MouseEvent, userHistory: UserHistoryReactive): Promise<void> {
    event.stopPropagation();
    const resp = await this.dialogService.openCreateModal('EDITAR HISTORIA DE USUARIO', userHistory);
    if (resp === 'cancel')
      return;
    this.loadingService.setLoading(true);
    try {
      await this.userHistoriesService.updateUserHistory(userHistory.id, resp);
      const history = await this.userHistoriesService.getUserHistoryById(userHistory.id);
      this.userHistories.update(histories =>
        histories.map(item =>
          item.id === userHistory.id
            ? { ...item, title: history.title, description: history.description, tasks: signal(history.tasks) }
            : item
        )
      );

      this.toastService.success('Historia de usuario actualizada correctamente');
    } catch (e) {
      console.error(e);
    }
    this.loadingService.setLoading(false);
  }

  async openTask(task: Task): Promise<void> {
    const resp = await this.dialogService.openTaskModal(task);
  }

  async createTasks(userHistoryId: number, event: MouseEvent): Promise<void> {
    event.stopPropagation();
    const resp = await this.dialogService.openCreateModal('CREAR TAREA');
    if (resp === 'cancel')
      return;
    this.loadingService.setLoading(true);
    try {
      const task = await this.taskService.createTask({...resp, userHistoryId});
      this.userHistories.update(histories => {
        histories.find(item => item.id === userHistoryId)?.tasks.update(tasks => [...tasks, task]);
        return histories;
      });
      this.toastService.success('Tarea creada exitosamente.');
    } catch (e) {
      this.toastService.error('Ha ocurrido un error inesperado');
      console.error(e);
    }
    this.loadingService.setLoading(false);
  }

  async deleteTask(task: Task): Promise<void> {
    const resp = await this.dialogService.openYesNoModal('ELIMINAR TAREA', `¿Desea eliminar la tarea << ${task.title} >>?. Esta acción no es irreversible.`);
    if (resp === 'not')
      return;
    this.loadingService.setLoading(true);
    try {
      await this.taskService.deleteTask(task.id);
      this.userHistories.update(histories => {
        histories.find(item => item.id === task.userHistoryId)?.tasks.update(tasks => tasks.filter(taskI => taskI.id !== task.id));
        return histories;
      });
    } catch (e) {
      console.error(e);
    }
    this.loadingService.setLoading(false);
  }

  async goBack(): Promise<void> {
    await this.router.navigateByUrl('home/projects');
  }

}
