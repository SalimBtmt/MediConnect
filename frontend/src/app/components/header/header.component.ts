import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DoctorService } from 'src/app/shared/services/doctor.service';
import { Doctor } from 'src/app/shared/types/doctor.type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [DatePipe], // Add DatePipe to the providers array
})
export class HeaderComponent implements OnInit {
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  public doctorConnected: Doctor | undefined;
  private doctorId: string | null = null; // Initialize to null

  currentDateTime: string | null = null;

  constructor(
    private datePipe: DatePipe,
    private http: HttpClient,
    private router: Router,
    doctorService: DoctorService
  ) {
    const jsonString = localStorage.getItem('user');

    if (jsonString !== null) {
      const userObject = JSON.parse(jsonString);
      this.doctorId = userObject.id;
    }

    if (this.doctorId) {
      doctorService.getDoctor(this.doctorId).subscribe((response) => {
        // Handle the response here
        this.doctorConnected = response;
        console.log(this.doctorConnected);
      });
    }
  }

  ngOnInit(): void {
    this.updateDateTime();
    
  }

  getHeadClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed';
    } else {
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }

  private updateDateTime(): void {
    const now = new Date();
    this.currentDateTime = this.datePipe.transform(now, 'dd MMMM yyyy', 'fr');
  }

  logout(): void {
    // Clear local storage data
    localStorage.setItem('jwt', '');
    localStorage.setItem('token', '');
    localStorage.setItem('user', '');
    localStorage.setItem('patientId', '');
  
    // Make the HTTP request and navigate after it completes
    this.http.post('http://0.0.0.0:3000/auth/logout', {}).subscribe(
      (response) => {
        // Handle the response or simply navigate to the sign-in page
        this.router.navigate(['/signin']);
      },
      (error) => {
        console.error('Error during logout:', error);
  
        // Even if there's an error, navigate to the sign-in page
        this.router.navigate(['/signin']);
      }
    );
  }
  
}
