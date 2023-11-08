import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddConsultationComponent } from '../add-consultation/add-consultation.component';
import { addMinutes, format, parse, parseISO } from 'date-fns';
import { Consultation } from '../../shared/types/consultation.type';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-stepper-consultations',
  templateUrl: './stepper-consultations.component.html',
  styleUrls: ['./stepper-consultations.component.css'],
})
export class StepperConsultationsComponent implements OnInit {
  consultations: Consultation[] = [];

  constructor(private dialog: MatDialog, private _http: HttpClient) {}

  ngOnInit(): void {
    this.loadConsultations();
  }

  loadConsultations() {
    this._http
      .get<Consultation[]>(`http://localhost:3000/consultation/patient/${localStorage.getItem("patientId")}`)
      .subscribe({
        next: (consultations: Consultation[]) => {
          this.consultations = consultations;
          this.sortConsultationsByDateDescending();
        },
        error: (error) => {
          console.error('Error fetching consultation data', error);
        },
      });
  }

  sortConsultationsByDateDescending() {
    this.consultations.sort((a, b) => {
      const dateA = new Date(a.dateStart);
      const dateB = new Date(b.dateStart);
      return dateB.getTime() - dateA.getTime();
    });
  }

  calculateDuration(start: any, end: any) {
    const startDate: any = new Date(start);
    const endDate: any = new Date(end);

    // Calculate the time difference in milliseconds
    const durationInMilliseconds = endDate - startDate;

    // Convert milliseconds to minutes (1 minute = 60000 milliseconds)
    const durationInMinutes = durationInMilliseconds / 60000;

    return durationInMinutes;
  }

  openConsultationModal(): void {
    const dialogRef = this.dialog.open(AddConsultationComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((newConsultation) => {
      this.handleNewConsultation(newConsultation);
    });
  }

  private buildDate(date: string, time : string): Date{
    const providedDate = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    providedDate.setHours(hours);
    providedDate.setMinutes(minutes);
    return providedDate
  }

  handleNewConsultation(newConsultation: any) {
    const startDate = this.buildDate(newConsultation.dateStart, newConsultation.timeStart);
  
    if (isNaN(startDate.getTime())) {
      console.error('Invalid date format:', startDate);
    } else {
      // Date is valid, proceed with the rest of the logic
  
      const consultation: Consultation = {
        dateStart: startDate.toISOString(),
        dateEnd: new Date(startDate.getTime() + newConsultation.duration * 60000).toISOString(),
        motive: newConsultation.motive,
        comment: newConsultation.comment ,
        prescription: newConsultation.prescription,
        patientId: localStorage.getItem('patientId') || '',
      };
  
      this._http.post('http://localhost:3000/consultation', consultation).subscribe({
        next: (response: any) => {
          console.log('Consultation added successfully:', response);
  
          // Load the updated consultations after successfully adding
          this.loadConsultations();
        },
        error: (error) => {
          console.error('Error adding consultation:', error);
        },
      });
    }
  }
  
}