import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ChangeStatus, CommentTask, CreateTask, Task, TaskLog} from '../types/task.interface';
import {lastValueFrom} from 'rxjs';
import {environment} from '../../../environments/environment';
import {BasicCreation} from '../types/basic-creation.interface';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  updateTask = new EventEmitter<{task: Task, updated: boolean}>();

  constructor(
    private readonly http: HttpClient
  ) { }

  private readonly url = environment.apiUrl;

  createTask(body: CreateTask): Promise<Task> {
    return lastValueFrom(this.http.post<Task>(`${this.url}/tasks`, body));
  }

  async deleteTask(id: number): Promise<void> {
    await lastValueFrom(this.http.delete(`${this.url}/tasks/${id}`));
  }

  async changeStatus(id: number, body: ChangeStatus): Promise<void> {
    await lastValueFrom(this.http.post(`${this.url}/tasks/${id}/changeStatus`, body));
  }

  getTaskLogs(id: number): Promise<TaskLog[]> {
    return lastValueFrom(this.http.get<TaskLog[]>(`${this.url}/tasks/${id}/logs`));
  }

  async commentTask(id:number, body: CommentTask): Promise<void> {
    await lastValueFrom(this.http.post(`${this.url}/tasks/${id}/comment`, body));
  }

  async updateTaskInfo(id: number, body: BasicCreation): Promise<Task> {
    return lastValueFrom(this.http.patch<Task>(`${this.url}/tasks/${id}`, body));
  }

}
