import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Consultation } from '../../shared/types/consultation.type';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-consultation',
  templateUrl: './add-consultation.component.html',
  styleUrls: ['./add-consultation.component.css'],
})
export class AddConsultationComponent {
  @Output() addConsultationEvent = new EventEmitter<Consultation>();

  consultationForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddConsultationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // You can remove this line if you don't want to pass any initial data
    private formBuilder: FormBuilder) {
    this.consultationForm = this.formBuilder.group({
      dateStart: [null, [Validators.required]],
      timeStart: [null, [Validators.required]],
      duration: [null, [Validators.required, Validators.min(1)]],
      motive: ['', [Validators.required]],
      comment: [''],
      prescription: [''],
    });

    
  }

  onSubmit() {
    if (this.consultationForm.valid) {
      /* const newConsultation = this.consultationForm.value as any;
      console.log(newConsultation.dateStart)
      console.log(newConsultation.timeStart)
      this.addConsultationEvent.emit(newConsultation); */

      this.dialogRef.close(this.consultationForm.value);
    }
  }
}