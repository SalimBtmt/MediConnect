import { Component, Injectable, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddConsultationComponent } from '../add-consultation/add-consultation.component';
import { addMinutes } from 'date-fns';
import { Consultation } from '../../shared/types/consultation.type';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-stepper-consultations',
  templateUrl: './stepper-consultations.component.html',
  styleUrls: ['./stepper-consultations.component.css'],
})
export class StepperConsultationsComponent implements OnInit {

  consultations: Consultation[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.consultations = [
      {
        "_id": "4",
        "dateStart": "2023-11-10T09:30:00Z",
        "dateEnd": "2023-11-10T10:15:00Z",
        "motive": "Contrôle régulier",
        "comment": "Tout semble normal. Aucun problème signalé.",
        "prescription": "Aucun médicament requis."
      },
      {
        "_id": "5",
        "dateStart": "2023-10-25T14:15:00Z",
        "dateEnd": "2023-10-25T14:45:00Z",
        "motive": "Maux de tête fréquents",
        "comment": "Le patient se plaint de maux de tête fréquents. Recommandé de réduire le stress.",
        "prescription": "Médicament : Paracétamol 500 mg, au besoin."
      },
      {
        "_id": "6",
        "dateStart": "2023-09-30T11:00:00Z",
        "dateEnd": "2023-09-30T11:45:00Z",
        "motive": "Examen dentaire",
        "comment": "Examen dentaire de routine. Aucun problème détecté.",
        "prescription": "Aucun médicament requis."
      },
      {
        "_id": "7",
        "dateStart": "2023-11-22T15:30:00Z",
        "dateEnd": "2023-11-22T16:15:00Z",
        "motive": "Fièvre inexpliquée",
        "comment": "Le patient présente de la fièvre sans raison apparente. Aucun symptôme notable.",
        "prescription": "Repos au lit et hydratation recommandés."
      },
      {
        "_id": "8",
        "dateStart": "2023-10-08T10:00:00Z",
        "dateEnd": "2023-10-08T10:45:00Z",
        "motive": "Blessure mineure",
        "comment": "Le patient a subi une blessure mineure à la main. Nettoyage et désinfection effectués.",
        "prescription": "Médicament : Crème antibiotique et bandage."
      },
      {
        "_id": "9",
        "dateStart": "2023-09-12T16:45:00Z",
        "dateEnd": "2023-09-12T17:30:00Z",
        "motive": "Douleurs abdominales",
        "comment": "Douleurs abdominales sévères. Aucune anomalie détectée.",
        "prescription": "Médicament : Antispasmodique, si nécessaire."
      }
    ]

    this.sortConsultationsByDateAscending();
  }

  sortConsultationsByDateAscending() {
    this.consultations.sort((a, b) => {
      const dateA = new Date(a.dateStart);
      const dateB = new Date(b.dateStart);
      return dateA.getTime() - dateB.getTime();
    });
  }

  calculateDuration(start:any, end:any) {
    const startDate:any = new Date(start);
    const endDate:any = new Date(end);
  
    // Calculate the time difference in milliseconds
    const durationInMilliseconds = endDate - startDate;
  
    // Convert milliseconds to minutes (1 minute = 60000 milliseconds)
    const durationInMinutes = durationInMilliseconds / 60000;
  
    return durationInMinutes;
  }

  openConsultationModal(): void {
    const dialogRef = this.dialog.open(AddConsultationComponent, {
      width: '400px', // Set the width as desired
    });
  }

  addConsultation(newConsultation: any) {
    // Assign a new ID for the consultation
    newConsultation._id = String(this.consultations.length + 5);

    const newDateEnd = addMinutes(new Date(newConsultation.dateStart), newConsultation.duration);

    const consultation: Consultation = {
      _id: String(this.consultations.length + 1),
      dateStart: newConsultation.dateStart.toISOString(),
      dateEnd: newDateEnd.toISOString(),
      motive: newConsultation.motive,
      comment: newConsultation.comment,
      prescription: newConsultation.prescription,
    };

    // Add the new consultation to the list
    this.consultations.unshift(consultation); // Add to the top of the list
    console.log(consultation)

    // Sort the consultations by date
    this.sortConsultationsByDateAscending();
  }
}