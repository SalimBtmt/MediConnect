import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../types/patient.type';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { DoctorService } from './doctor.service';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private readonly _apiUrl: string;

  constructor(
    private _http: HttpClient,
    private cookieService: CookieService,
    private readonly _doctorService: DoctorService
  ) {
    this._apiUrl = `${environment.backend.protocol}://${environment.backend.host}`;
    if (environment.backend.port) {
      this._apiUrl += `:${environment.backend.port}`;
    }
  }

  getPatients(): Observable<Patient[]> {
    return this._http.get<Patient[]>(`${this._apiUrl}/patient`);
  }

  getPatient(id: string): Observable<Patient> {
    return this._http.get<Patient>(`${this._apiUrl}/patient/${id}`);
  }

  getPatientByDoctorId(doctorId: number): Observable<Patient[]> {
    return this._http.get<Patient[]>(
      `${this._apiUrl}/patient/doctor/${doctorId}`
    );
  }
}
