import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {CreationDialog} from '../../types/creation-dialog.interface';
import {MatIconModule} from '@angular/material/icon';
import {DialogService} from '../../services/dialog.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-create-modal',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './create-modal.component.html',
  styleUrl: './create-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateModalComponent implements OnInit {

  creationForm: FormGroup;

  constructor(
    private readonly dialogRef: MatDialogRef<CreateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreationDialog,
    private dialogService: DialogService,
    private toastService: ToastrService,
  ) {
    this.generateForm();
  }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
  }

  generateForm(): void {
    this.creationForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
    if (this.data.body) {
      this.creationForm.setValue({
        title: this.data.body.title,
        description: this.data.body.description,
      });
    }
  }

  async cancel(): Promise<void> {
    if (!this.creationForm.dirty) {
      this.dialogRef.close('cancel');
      return;
    }
    const resp = await this.dialogService.openYesNoModal(
      `${this.data.body ? 'CANCELAR EDICIÓN' : 'CANCELAR CREACIÓN'}`,
      `¿Desea cancelar el proceso de ${this.data.body ? 'edición' : 'creación'}?, los datos no serán guardados.`
    );
    if (resp === 'yes') {
      this.dialogRef.close('cancel');
    }
  }

  save(): void {
    this.creationForm.markAllAsTouched();
    if (this.creationForm.invalid) {
      this.toastService.error('Valide los campos del formulario');
      return;
    }
    this.dialogRef.close(this.creationForm.value);
  }

}
