import {ChangeDetectionStrategy, Component, Inject, OnInit, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Task, TaskLog, TaskLogEventType, TaskStatus} from '../../types/task.interface';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatTooltip} from '@angular/material/tooltip';
import {MatDivider} from '@angular/material/divider';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {TasksService} from '../../services/tasks.service';
import {DialogService} from '../../services/dialog.service';
import {ToastrService} from 'ngx-toastr';
import {DATE_PIPE_DEFAULT_OPTIONS, DatePipe} from '@angular/common';

@Component({
  selector: 'app-view-task',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatTooltip,
    MatDivider,
    MatSelectModule,
    DatePipe
  ],
  providers: [
    {provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: {timezone: '-1000'}}
  ],
  templateUrl: './view-task.component.html',
  styleUrl: './view-task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewTaskComponent implements OnInit {

  taskForm: FormGroup;

  isEditing = signal(false);

  taskStatusControl = new FormControl('');

  taskLogs = signal<TaskLog[]>([]);

  commentControl = new FormControl<string>('');

  statusArray = [
    {status: TaskStatus.TODO, text: 'Por hacer'},
    {status: TaskStatus.IN_PROGRESS, text: 'En progreso'},
    {status: TaskStatus.FINISHED, text: 'Terminado'},
  ];

  eventType = TaskLogEventType;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Task,
    private dialogRef: MatDialogRef<ViewTaskComponent>,
    private readonly tasksService: TasksService,
    private dialogService: DialogService,
    private toastService: ToastrService,
  ) {
    this.buildForm();
  }

  async ngOnInit(): Promise<void> {
    await this.getTaskLogs();
  }

  async getTaskLogs(): Promise<void> {
    try {
      this.taskLogs.set(await this.tasksService.getTaskLogs(this.data.id));
    } catch (e) {
      console.error(e);
    }
  }

  buildForm(): void {
    this.taskForm = new FormGroup({
      title: new FormControl(this.data.title, [Validators.required]),
      description: new FormControl(this.data.description, [Validators.required])
    });
    this.taskStatusControl.setValue(this.data.status);
  }

  async cancel(): Promise<void> {
    let resp: 'yes' | 'not' = 'yes';
    if (this.taskForm.dirty) {
      resp = await this.dialogService.openYesNoModal('EDITAR TAREA', '¿Desea cancelar la edición de tarea?');
    }
    if (resp === 'yes')
      this.buildForm();
    this.isEditing.set(false);
  }

  async updateStatus(value: MatSelectChange): Promise<void> {
    try {
      await this.tasksService.changeStatus(this.data.id, {status: value.value});
      this.data.status = value.value;
      await this.getTaskLogs();
      this.tasksService.updateTask.emit({updated: true, task: this.data});
    } catch (e) {
      this.buildForm();
      this.toastService.error('Ha ocurrido un error inesperado al cambiar el estado de la tarea.');
      console.error(e);
    }
  }

  async commentTask(): Promise<void> {
    if (this.commentControl.value && this.commentControl.value.length > 0) {
      try {
        await this.tasksService.commentTask(this.data.id, {comment: this.commentControl.value});
        await this.getTaskLogs();
        this.commentControl.setValue('');
      } catch (e) {
        console.error(e);
        this.toastService.error('Error al comentar la tarea');
      }
    }

  }

  async save(): Promise<void> {
    if (this.taskForm.invalid)
      this.toastService.error('Valide la información del formulario');
    if (!this.taskForm.dirty)
      return;
    try {
      const resp = await this.tasksService.updateTaskInfo(this.data.id, this.taskForm.value);
      this.data = resp;
      this.tasksService.updateTask.emit({updated: true, task: resp});
      this.buildForm();
      this.isEditing.set(false);
    } catch (e) {
      console.error(e);
    }
  }
}
