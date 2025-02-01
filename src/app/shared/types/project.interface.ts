import {BasicCreation} from './basic-creation.interface';

export interface Project {
  id: number;
  companyId: number;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  isActive: boolean;
}

export interface CreateProject extends BasicCreation {
  companyId: number;
}
