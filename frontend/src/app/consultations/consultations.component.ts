import { Component, OnInit } from '@angular/core';
import { Consultation } from '../shared/types/consultation.type';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Router, NavigationEnd } from '@angular/router';
import { Cons } from 'rxjs';
// Interface for the sidenav toggle event
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-consultations',
  templateUrl: './consultations.component.html',
  styleUrls: ['./consultations.component.css']
})
export class ConsultationsComponent implements OnInit {


  isSignInOrSignUpRoute: boolean = false;

  title = 'frontend';

  // Flag to track the collapse state of the sidenav
  isSideNavCollappsed: boolean = false;
  // Variable to store the current screen width
  screenWidth = 0;
// private property to store patient value

  private _consultations: Consultation[];
  // private property to store all backend URLs
  private readonly _backendURL: any;

  /**
   * Component constructor
   */
  constructor(private _http: HttpClient, private router: Router) {
    this._consultations = {} as Consultation[];
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

  get consultations(): Consultation[] {
    return this._consultations;
  }

  onToggleSideNav(data: SideNavToggle): void {
    // Update the collapse state and screen width based on the event data
    this.isSideNavCollappsed = data.collapsed;
    this.screenWidth = data.screenWidth;
  }

  ngOnInit(): void {
    this._http.get<Consultation[]>(this._backendURL.allConsultations)
      //.subscribe({ next: (consultation: Consultation) => this._consultations = consultation[1] });
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
