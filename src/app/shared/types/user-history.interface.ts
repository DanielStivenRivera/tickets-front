import {Task} from './task.interface';
import {BasicCreation} from './basic-creation.interface';
import {WritableSignal} from '@angular/core';

export interface UserHistory {
  id: number;
  description: string;
  title: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  tasks: Task[];
}

export interface CreateUserHistory extends BasicCreation {
  projectId: number;
}

export interface UserHistoryReactive extends Omit<UserHistory, 'tasks'> {
  tasks: WritableSignal<Task[]>
}
