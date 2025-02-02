import {BasicCreation} from './basic-creation.interface';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
}

export interface Task {
  id: number;
  userHistoryId: number;
  title: string;
  description: string;
  status: TaskStatus;
}

export interface CreateTask extends BasicCreation {
  userHistoryId: number;
}

export interface ChangeStatus {
  status: TaskStatus;
}

export enum TaskLogEventType {
  CHANGE_STATUS= 'CHANGE_STATUS',
  COMMENT = 'COMMENT',
}

export interface TaskLogStatusChange {
  previous: TaskStatus;
  current: TaskStatus;
}

export interface TaskLog {
  id: number;
  eventType:TaskLogEventType,
  comment?: string;
  statusChange: TaskLogStatusChange;
  createdAt: string,
  taskId: number,
}

export interface CommentTask {
  comment: string;
}
