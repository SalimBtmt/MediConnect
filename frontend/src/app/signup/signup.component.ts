import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'; // Make sure you import the HttpClient module
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;

  constructor(
    private router: Router, // Inject the Router service
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ) {
    this.signUpForm = this.formBuilder.group({
      firstname: ['',[Validators.required]],
      lastname: ['', [Validators.required]],
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
    if (this.signUpForm && this.signUpForm.valid) {
      const formData = {
        firstname: this.signUpForm.get('firstname')!.value,
        lastname: this.signUpForm.get('lastname')!.value,
        username: this.signUpForm.get('username')!.value,
        password: this.signUpForm.get('password')!.value,
      };
  
      this.httpClient
        .post<any>('http://0.0.0.0:3000/auth/signup', formData, this.httpOptions)
        .pipe(catchError(this.handleError('signup failed', formData)))
        .subscribe((response) => {
          // Handle the response here
          console.log('Response:', response);
        });
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

  goTosignIn() {
    this.router.navigate(['/signin']);
    // Navigate to the sign-up page. You'll need to configure Angular routing for this.
    // You can use the Angular Router for navigation.
  }

}
