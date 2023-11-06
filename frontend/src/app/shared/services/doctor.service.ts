import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../types/doctor.type';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
  })

  export class DoctorService {


    private readonly _apiUrl: string;
    //private _headers: HttpHeaders ;
  
    constructor(private _http: HttpClient, private cookieService: CookieService) {

        this._apiUrl = `${environment.backend.protocol}://${environment.backend.host}`;
        if (environment.backend.port) {
            this._apiUrl += `:${environment.backend.port}`;
        }

        /* this.headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${ localStorage.getItem('token') || cookieService.get('token')}`
          ); */
    }

    getDoctors(): Observable<Doctor[]> {
        return this._http.get<Doctor[]>(`${this._apiUrl}/doctor`);
      }

      getDoctor(id: string): Observable<Doctor> {
        return this._http.get<Doctor>(`${this._apiUrl}/doctor/${id}`);
      }
}