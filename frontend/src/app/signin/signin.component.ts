import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'; // Make sure you import the HttpClient module
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';




@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  signInForm: FormGroup;

  constructor(
    private router: Router, // Inject the Router service
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private cookieService: CookieService // Add this line
  ) {
    this.signInForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  // Define httpOptions
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json', // You can adjust the content type as needed
    }),
  };

  ngOnInit(): void {}

  onSubmit() {

    
    if (this.signInForm && this.signInForm.valid) {
      const formData = {
        username: this.signInForm.get('username')!.value,
        password: this.signInForm.get('password')!.value,
      };
  
      this.httpClient
        .post<any>('http://0.0.0.0:3000/auth/signin', formData, this.httpOptions)
        .pipe(catchError(this.handleError('signin failed', formData)))
        .subscribe((response) => {

          // Handle the response here
          console.log('Response:', response);
          console.log('Response:', response.token);
          if (response.token) {
            // Store the token in cookies
            this.cookieService.set('jwt', response.token);
            localStorage.setItem('jwt', response.token);

            const headers = new HttpHeaders({
              "Content-Type": 'application/json',
              "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NDU2MDU1YmU2NDhjMTBjYjgwMTZmOSIsImlhdCI6MTY5OTA1NzI0MywiZXhwIjoxNjk5MzE2NDQzfQ.toG9rK6TXuWi5s5H9ztyvaXt8fa37ZElwygCAgq2Mu8"
            })

            // Fetch the user's ID from the /doctor endpoint
          this.httpClient
          .get('http://0.0.0.0:3000/auth/doctor', { headers: headers })
          .subscribe((doctor:any) => {
            console.log('Doctor:', doctor);
            // Extract and store the user's ID from the doctor data
            const userId = doctor.id;

            // Store the userId in session storage
            sessionStorage.setItem('userId', userId);

            // Store the token and userId in local storage
            localStorage.setItem('jwt', response.token);
            localStorage.setItem('userId', userId);
          });
  
        }});
      }
    }
  

  handleError(errorMessage: string, formData: any) {
    return (error: HttpErrorResponse) => {
      console.error(errorMessage, error);
      // You can add your error handling logic here.
      // For example, display an error message to the user.
  
      // Rethrow the error so the calling code can handle it too.
      return throwError(error);
    };

  }

  goToSignUp() {
    this.router.navigate(['/signup']);
    // Navigate to the sign-up page. You'll need to configure Angular routing for this.
    // You can use the Angular Router for navigation.
  }
}
