import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CreateModalComponent} from '../components/create-modal/create-modal.component';
import {lastValueFrom} from 'rxjs';
import {BasicCreation} from '../types/basic-creation.interface';
import {CreationDialog} from '../types/creation-dialog.interface';
import {YesNoModalComponent} from '../components/yes-no-modal/yes-no-modal.component';
import {Task} from '../types/task.interface';
import {ViewTaskComponent} from '../components/view-task/view-task.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private readonly matDialog: MatDialog,
  ) { }

  openCreateModal(title: string, body?: BasicCreation): Promise<'cancel' | BasicCreation> {
    const dialog = this.matDialog.open(CreateModalComponent, {
      data: {
        title,
        body,
      } as CreationDialog,
      width: '90%',
      maxWidth: '600px',
      height: 'auto',
      maxHeight: '800px'
    });
    return lastValueFrom(dialog.afterClosed());
  }

  openYesNoModal(title: string, message: string): Promise<'yes' | 'not'> {
    const dialog = this.matDialog.open(YesNoModalComponent, {
      data: {
        title,
        message,
      },
      width: '90%',
      maxWidth: '600px',
      height: 'auto',
      maxHeight: '800px',
    });
    return lastValueFrom(dialog.afterClosed());
  }

  openTaskModal(task: Task): Promise<'update' | undefined> {
    const dialog = this.matDialog.open(ViewTaskComponent, {
      data: task,
      width: '90%',
      maxWidth: '600px',
      height: '80%',
      maxHeight: '800px'
    });
    return lastValueFrom(dialog.afterClosed());
  }

}
