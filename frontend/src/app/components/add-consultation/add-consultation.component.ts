import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Consultation } from '../../shared/types/consultation.type';

@Component({
  selector: 'app-add-consultation',
  templateUrl: './add-consultation.component.html',
  styleUrls: ['./add-consultation.component.css'],
})
export class AddConsultationComponent {
  @Output() addConsultationEvent = new EventEmitter<Consultation>();

  consultationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.consultationForm = this.fb.group({
      dateStart: [null, [Validators.required]],
      duration: [null, [Validators.required, Validators.min(1)]],
      motive: ['', [Validators.required]],
      comment: [''],
      prescription: [''],
    });
  }

  onSubmit() {
    if (this.consultationForm.valid) {
      const newConsultation = this.consultationForm.value as any;
      console.log(newConsultation);
      this.addConsultationEvent.emit(newConsultation);
    }
  }
}