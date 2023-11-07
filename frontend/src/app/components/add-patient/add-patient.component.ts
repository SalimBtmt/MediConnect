import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddressType } from '../../shared/types/address.type'; // Replace with the actual path to your PersonAddressDto

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css'],
})
export class AddPatientComponent {
  addForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddPatientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // You can remove this line if you don't want to pass any initial data
    private formBuilder: FormBuilder
  ) {
    this.addForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: [''], // You can set any default values if needed
      phone: [''], // You can set any default values if needed
      birthDate: ['', Validators.required],
      bloodtype: ['', Validators.required],
      address: this.formBuilder.group({
        street: ['', ],
        postalCode: ['', ],
        city: ['',],
      }),
    });
  }

  onSubmit(): void {
    if (this.addForm.valid) {
      this.dialogRef.close(this.addForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
