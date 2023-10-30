import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Patient } from '../shared/types/patient.type';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  private _patients: Patient[] = [];
  private readonly _backendURL: any;

  displayedColumns: string[] = ['firstname', 'lastname', 'birthDate', 'bloodtype'];
  dataSource = new MatTableDataSource<Patient>(); // Change the type to Patient

  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(private _http: HttpClient, private _liveAnnouncer: LiveAnnouncer) {
    this._backendURL = {};

    let baseUrl = `${environment.backend.protocol}://${environment.backend.host}`;
    if (environment.backend.port) {
      baseUrl += `:${environment.backend.port}`;
    }
    // build all backend urls
    // @ts-ignore
    Object.keys(environment.backend.endpoints).forEach(k => this._backendURL[ k ] = `${baseUrl}${environment.backend.endpoints[ k ]}`);
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
}