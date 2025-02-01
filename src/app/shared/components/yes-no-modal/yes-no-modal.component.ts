import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-yes-no-modal',
  imports: [
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './yes-no-modal.component.html',
  styleUrl: './yes-no-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YesNoModalComponent {

  constructor(
    private readonly dialogRef: MatDialogRef<YesNoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {title: string, message: string}
  ) {
    this.dialogRef.disableClose = true;
  }

  emitOption(option:'yes' | 'not'): void {
    this.dialogRef.close(option);
  }

}
