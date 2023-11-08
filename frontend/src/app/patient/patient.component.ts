import { Component, OnInit } from '@angular/core';
import { Patient } from '../shared/types/patient.type';
import { HttpClient,   HttpHeaders,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModifyPatientComponent } from '../components/modify-patient/modify-patient.component';


// Interface for the sidenav toggle event
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}


@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {


  isSignInOrSignUpRoute: boolean = false;

  title = 'frontend';

  // Flag to track the collapse state of the sidenav
  isSideNavCollappsed: boolean = false;
  // Variable to store the current screen width
  screenWidth = 0;
// private property to store patient value
  private _patient: Patient;
  // private property to store all backend URLs
  private readonly _backendURL: any;

  /**
   * Component constructor
   */
  constructor(private _http: HttpClient, private router: Router,private dialog: MatDialog,) {



    this._patient = {} as Patient;
    this._backendURL = {};

    let baseUrl = `${environment.backend.protocol}://${environment.backend.host}`;
    if (environment.backend.port) {
      baseUrl += `:${environment.backend.port}`;
    }
    // build all backend urls
    // @ts-ignore
    Object.keys(environment.backend.endpoints).forEach(k => this._backendURL[ k ] = `${baseUrl}${environment.backend.endpoints[ k ]}`);


    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is /signin or /signup
        this.isSignInOrSignUpRoute = ['/signin', '/signup'].includes(event.url);
      }
    });
  }

  get patient(): Patient {
    return this._patient;
  }

  onToggleSideNav(data: SideNavToggle): void {
    // Update the collapse state and screen width based on the event data
    this.isSideNavCollappsed = data.collapsed;
    this.screenWidth = data.screenWidth;
  }

  ngOnInit(): void {

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem("token")}`
    );

    this._http.get<Patient>(`http://localhost:3000/patient/${localStorage.getItem("patientId")}`)
      .subscribe({ next: (patient: Patient) => this._patient = patient });
  }

  
  // Method to determine the CSS class for the body element
  getBodyClass(): string {
    let styleClass = '';
    
    // If the sidenav is collapsed and the screen width is greater than 768 pixels, set the style class to 'body-trimmed'
    if(this.isSideNavCollappsed && this.screenWidth > 768) {
      styleClass = 'body-trimmed';
    
      // If the sidenav is collapsed and the screen width is less than or equal to 768 pixels and greater than 0, set the style class to 'body-md-screen'
    } else if(this.isSideNavCollappsed && this.screenWidth <= 768 && this.screenWidth > 0) {
      styleClass = 'body-md-screen'
    } 

    if (this.isSignInOrSignUpRoute){
      styleClass = "auth-page"
    }
    return styleClass;
  }

  openModifyDialog(patient: Patient): void {
    const dialogRef = this.dialog.open(ModifyPatientComponent, {
      width: '400px', // Set the dialog width
      data: { patient }, // Pass the patient data to the dialog
    });
  
    dialogRef.afterClosed().subscribe((result: Patient) => {
      if (result) {
        console.log(result);
  
        this._http.put(`http://localhost:3000/patient/${localStorage.getItem("patientId")}`, result).subscribe({
          next: (response) => {
            console.log('Patient updated successfully:', response);
            this._patient = result
          },
          error: (error) => {
            // Handle the error from the API, e.g., show an error message
            console.error('Error updating patient:', error);
          },
        });
      }
    });
  }
  
}
