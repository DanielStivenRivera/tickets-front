import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YesNoModalComponent } from './yes-no-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {provideExperimentalZonelessChangeDetection} from '@angular/core';

class MatDialogRefMock {
  close(value?: string) {}
}

describe('YesNoModalComponent', () => {
  let component: YesNoModalComponent;
  let fixture: ComponentFixture<YesNoModalComponent>;
  let dialogRef: MatDialogRef<YesNoModalComponent>;

  const mockDialogData = {
    title: 'Test Title',
    message: 'Test Message',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: MatDialogRef, useClass: MatDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        provideExperimentalZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(YesNoModalComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with provided dialog data', () => {
    expect(component.data.title).toBe('Test Title');
    expect(component.data.message).toBe('Test Message');
  });

  it('should close dialog with "yes" when emitOption is called with "yes"', () => {
    spyOn(dialogRef, 'close');
    component.emitOption('yes');
    expect(dialogRef.close).toHaveBeenCalledWith('yes');
  });

  it('should close dialog with "not" when emitOption is called with "not"', () => {
    spyOn(dialogRef, 'close');
    component.emitOption('not');
    expect(dialogRef.close).toHaveBeenCalledWith('not');
  });

  it('should disable close on the dialog', () => {
    expect(component['dialogRef'].disableClose).toBeTrue();
  });
});
