import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Doctor } from '../shared/types/doctor.type';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  signInForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {
    this.signInForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  // Define httpOptions
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  authenticatedUser(token: string): Observable<Doctor> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<Doctor>('http://0.0.0.0:3000/auth/profile');
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.signInForm && this.signInForm.valid) {
      const formData = {
        username: this.signInForm.get('username')!.value,
        password: this.signInForm.get('password')!.value,
      };

      this.httpClient
        .post<any>(
          'http://0.0.0.0:3000/auth/signin',
          formData,
          this.httpOptions
        )
        .pipe(catchError(this.handleError('signin failed', formData)))
        .subscribe((response) => {
          // Handle the response here
          console.log('Response:', response);
          console.log('Response:', response.token);
          if (response.token) {
            // Store the token in cookies
            this.cookieService.set('jwt', response.token);
            localStorage.setItem('jwt', response.token);
            localStorage.setItem('token', response.token);

            // Now, wait for the authenticatedUser method to complete
            this.authenticatedUser(response.token).subscribe(
              (user: Doctor) => {
                if (user) {
                  localStorage.setItem('user', JSON.stringify(user));
                  this.cookieService.set('user', JSON.stringify(user));
                }

                // Navigate to another page only after the user data is updated
                this.router.navigate(['/home']);
              },
              (error) => {
                console.error('Error fetching user data:', error);

                // If there's an error, you can still navigate to another page
                this.router.navigate(['/home']);
              }
            );
          } else {
            // Handle the case when the token is undefined (e.g., show an error or redirect).
            console.error('Token is undefined');
          }
        });
    }
  }

  handleError(errorMessage: string, formData: any) {
    return (error: HttpErrorResponse) => {
      console.error(errorMessage, error);
      return throwError(error);
    };
  }

  goToSignUp() {
    this.router.navigate(['/signup']);
  }
}
