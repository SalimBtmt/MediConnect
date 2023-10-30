import { Component, OnInit } from '@angular/core';
import { Patient } from '../shared/types/patient.type';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
// private property to store patient value
  private _patient: Patient;
  // private property to store all backend URLs
  private readonly _backendURL: any;

  /**
   * Component constructor
   */
  constructor(private _http: HttpClient) {
    this._patient = {} as Patient;
    this._backendURL = {};

    let baseUrl = `${environment.backend.protocol}://${environment.backend.host}`;
    if (environment.backend.port) {
      baseUrl += `:${environment.backend.port}`;
    }
    // build all backend urls
    // @ts-ignore
    Object.keys(environment.backend.endpoints).forEach(k => this._backendURL[ k ] = `${baseUrl}${environment.backend.endpoints[ k ]}`);
  }

  get patient(): Patient {
    return this._patient;
  }

  ngOnInit(): void {
    this._http.get<Patient[]>(this._backendURL.allPatients)
      .subscribe({ next: (patient: Patient[]) => this._patient = patient[6] });
  }

  /**
   * OnInit implementation
   */
  
}
