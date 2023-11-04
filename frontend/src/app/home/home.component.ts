import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Patient } from '../shared/types/patient.type';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd } from '@angular/router';


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

  // Flag to track the collapse state of the sidenav
  isSideNavCollappsed: boolean = false;
  // Variable to store the current screen width
  screenWidth = 0;


  private _patients: Patient[] = [];
  private readonly _backendURL: any;

  displayedColumns: string[] = ['firstname', 'lastname', 'birthDate', 'bloodtype','actions'];
  dataSource = new MatTableDataSource<Patient>(); // Change the type to Patient

  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(private _http: HttpClient, private _liveAnnouncer: LiveAnnouncer, private router: Router) {
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

  ngOnInit(): void {
    this._http
      .get<Patient[]>(this._backendURL.allPatients)
      .subscribe({
        next: (patients: Patient[]) => {
          this._patients = patients;
          
          this.dataSource.data = this._patients; // Set patient data in MatTable
        },
        error: (error) => {
          console.error('Error fetching patient data', error);
        },
      });
  }


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
    this._http.delete(this._backendURL.onePatient.replace(':id',"654031be74926abbaed1eda1" /* patient.id */))
      .subscribe({
        next: () => {
          // Remove the patient from the local array
          this._patients = this._patients.filter((p: Patient) => p.id !== "654031be74926abbaed1eda1" /* patient.id */);
          
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
}