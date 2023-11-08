import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Patient } from '../shared/types/patient.type';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';
import { ModifyPatientComponent } from '../components/modify-patient/modify-patient.component';
import { AddPatientComponent } from '../components/add-patient/add-patient.component';


// Interface for the sidenav toggle event
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  isSignInOrSignUpRoute: boolean = false;

  title = 'frontend';

  private doctorId: string | null = null;

  // Flag to track the collapse state of the sidenav
  isSideNavCollappsed: boolean = false;
  // Variable to store the current screen width
  screenWidth = 0;

  private _patients: Patient[] = [];
  private readonly _backendURL: any;

  displayedColumns: string[] = [
    'firstname',
    'lastname',
    'birthDate',
    'bloodtype',
    'actions',
  ];
  dataSource = new MatTableDataSource<Patient>(); // Change the type to Patient

  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(
    private _http: HttpClient,
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private cookieService: CookieService, 
    private dialog: MatDialog,
  ) {
    this._backendURL = {};

    let baseUrl = `${environment.backend.protocol}://${environment.backend.host}`;
    if (environment.backend.port) {
      baseUrl += `:${environment.backend.port}`;
    }
    // build all backend urls
    // @ts-ignore
    Object.keys(environment.backend.endpoints).forEach((k) =>(this._backendURL[k] = `${baseUrl}${environment.backend.endpoints[k]}`));

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is /signin or /signup
        this.isSignInOrSignUpRoute = ['/signin', '/signup'].includes(event.url);
      }
    });

    const jsonString = localStorage.getItem('user');

    if (jsonString !== null) {
      const userObject = JSON.parse(jsonString);
      this.doctorId = userObject.id;
    }
  }

  ngOnInit(): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );

    const userData = this.cookieService.get('user');

    if (userData) {
      const user = JSON.parse(userData);

      console.log('User from home:', user);

      if (user && user.id) {
        this._http
          .get<Patient[]>(`http://0.0.0.0:3000/patient/doctor/${user.id}`, {
            headers,
          })
          .subscribe({
            next: (patients: Patient[]) => {
              this._patients = patients;
              this.dataSource.data = this._patients; // Set patient data in MatTable
            },
            error: (error) => {
              console.error('Error fetching patient data', error);
            },
          });
      } else {
        console.error('User data is missing or invalid.');
      }
    } else {
      console.error('User data is not available in localStorage.');
    }
  }

  /* this._http
      .get<Patient[]>(this._backendURL.allPatients)
      .subscribe({
        next: (patients: Patient[]) => {
          this._patients = patients;
          
          this.dataSource.data = this._patients; // Set patient data in MatTable
        },
        error: (error) => {
          console.error('Error fetching patient data', error);
        },
      }); */

  onToggleSideNav(data: SideNavToggle): void {
    // Update the collapse state and screen width based on the event data
    this.isSideNavCollappsed = data.collapsed;
    this.screenWidth = data.screenWidth;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  deletePatient(patient: Patient): void {
    this._http
      .delete(
        this._backendURL.onePatient.replace(
          ':id',
          patient.id/* patient.id */
        )
      )
      .subscribe({
        next: () => {
          // Remove the patient from the local array
          this._patients = this._patients.filter(
            (p: Patient) => p.id !== patient.id /* patient.id */
          );

          // Update the MatTable data source
          this.dataSource.data = this._patients;

          // Reload the page to refresh the data
          window.location.reload();
        },
        error: (error) => {
          console.error('Error deleting patient', error);
        },
      });
  }

  // Method to determine the CSS class for the body element
  getBodyClass(): string {
    let styleClass = '';

    // If the sidenav is collapsed and the screen width is greater than 768 pixels, set the style class to 'body-trimmed'
    if (this.isSideNavCollappsed && this.screenWidth > 768) {
      styleClass = 'body-trimmed';

      // If the sidenav is collapsed and the screen width is less than or equal to 768 pixels and greater than 0, set the style class to 'body-md-screen'
    } else if (
      this.isSideNavCollappsed &&
      this.screenWidth <= 768 &&
      this.screenWidth > 0
    ) {
      styleClass = 'body-md-screen';
    }

    if (this.isSignInOrSignUpRoute) {
      styleClass = 'auth-page';
    }
    return styleClass;
  }

  onTableRowClick(row: Patient) {
    console.log(row)
    if (row && row.id) {
      localStorage.setItem('patientId', row.id);
      this.router.navigate(['/patient']);
    }
  }

  openAddPatientDialog(): void {
    const dialogRef = this.dialog.open(AddPatientComponent, {
      width: '400px', // Set the dialog width
    });
  
    dialogRef.afterClosed().subscribe((result: Patient) => {
      if (result) {
        // Add the doctorId to the patient data
        const patientWithDoctorId = { ...result, doctorId: this.doctorId };
    
        console.log(patientWithDoctorId);
    
        this._http.post('http://localhost:3000/patient', patientWithDoctorId).subscribe({
          next: (response: any) => {
            console.log('Patient added successfully:', response);
    
            // Set the doctorId for the newly added patient
            const addedPatient = { ...result, doctorId: this.doctorId };
            
            // Push the patient into the _patients array
            this._patients.push(addedPatient);
    
            this.dataSource.data = this._patients;

            window.location.reload();
          },
          error: (error) => {
            console.error('Error adding patient:', error);
          },
        });
      }
    });
    
    
  }
  

  openModifyDialog(patient: Patient): void {
    const dialogRef = this.dialog.open(ModifyPatientComponent, {
      width: '400px', // Set the dialog width
      data: { patient }, // Pass the patient data to the dialog
    });
  
    dialogRef.afterClosed().subscribe((result: Patient) => {
      if (result) {
        console.log(result);
  
        this._http.put(`http://localhost:3000/patient/${patient.id}`, result).subscribe({
          next: (response) => {
            console.log('Patient updated successfully:', response);
  
            // Update the local patient data
            const index = this._patients.findIndex((p) => p.id === patient.id);
            if (index !== -1) {
              this._patients[index] = result;
              this.dataSource.data = this._patients; // Update the MatTable data source
            }
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
