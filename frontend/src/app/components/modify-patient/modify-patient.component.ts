import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Patient } from 'src/app/shared/types/patient.type';

@Component({
  selector: 'app-modify-patient',
  templateUrl: './modify-patient.component.html',
  styleUrls: ['./modify-patient.component.css']
})
export class ModifyPatientComponent {
  modifyForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModifyPatientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { patient: Patient },
    private formBuilder: FormBuilder
  ) {
    this.modifyForm = this.formBuilder.group({
      firstname: [data.patient.firstname, Validators.required],
      lastname: [data.patient.lastname, Validators.required],
      email: [data.patient.email],
      phone: [data.patient.phone],
      birthDate: [data.patient.birthDate, Validators.required], 
      bloodtype: [data.patient.bloodtype, Validators.required],
    });
  }
  

  onSubmit(): void {
    if (this.modifyForm.valid) {
      this.dialogRef.close(this.modifyForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
