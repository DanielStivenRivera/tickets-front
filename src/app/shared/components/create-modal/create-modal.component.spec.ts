import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateModalComponent } from './create-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {DialogService} from '../../services/dialog.service';
import {provideExperimentalZonelessChangeDetection} from '@angular/core';

class MatDialogRefMock {
  close(value?: any) {}
}

class DialogServiceMock {
  openYesNoModal(title: string, message: string): Promise<string> {
    return Promise.resolve('yes');
  }
}

class ToastrServiceMock {
  error(message: string) {}
}

describe('CreateModalComponent', () => {
  let component: CreateModalComponent;
  let fixture: ComponentFixture<CreateModalComponent>;
  let dialogRef: MatDialogRef<CreateModalComponent>;
  let dialogService: DialogService;
  let toastrService: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useClass: MatDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: DialogService, useClass: DialogServiceMock },
        { provide: ToastrService, useClass: ToastrServiceMock },
        provideExperimentalZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateModalComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    dialogService = TestBed.inject(DialogService);
    toastrService = TestBed.inject(ToastrService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.creationForm).toBeDefined();
    expect(component.creationForm.get('title')).toBeDefined();
    expect(component.creationForm.get('description')).toBeDefined();
  });

  it('should set form values if data.body is provided', () => {
    const mockData = {
      body: {
        title: 'Test Title',
        description: 'Test Description',
      },
    };
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useClass: MatDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: DialogService, useClass: DialogServiceMock },
        { provide: ToastrService, useClass: ToastrServiceMock },
        provideExperimentalZonelessChangeDetection(),
      ],
    }).compileComponents();

    const fixtureWithData = TestBed.createComponent(CreateModalComponent);
    const componentWithData = fixtureWithData.componentInstance;
    fixtureWithData.detectChanges();

    expect(componentWithData.creationForm.value).toEqual(mockData.body);
  });

  it('should close dialog with "cancel" when form is not dirty', () => {
    spyOn(dialogRef, 'close');
    component.cancel();
    expect(dialogRef.close).toHaveBeenCalledWith('cancel');
  });

  it('should prompt user to confirm cancel when form is dirty', async () => {
    spyOn(dialogService, 'openYesNoModal').and.callThrough();
    spyOn(dialogRef, 'close');
    component.creationForm.markAsDirty();
    await component.cancel();
    expect(dialogService.openYesNoModal).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith('cancel');
  });

  it('should mark form as touched and show error toast if form is invalid on save', () => {
    spyOn(toastrService, 'error');
    component.save();
    expect(component.creationForm.touched).toBeTrue();
    expect(toastrService.error).toHaveBeenCalledWith('Valide los campos del formulario');
  });

  it('should close dialog with form value on save if form is valid', () => {
    spyOn(dialogRef, 'close');
    component.creationForm.setValue({ title: 'Valid Title', description: 'Valid Description' });
    component.save();
    expect(dialogRef.close).toHaveBeenCalledWith({ title: 'Valid Title', description: 'Valid Description' });
  });
});
