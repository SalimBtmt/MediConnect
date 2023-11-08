import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { Consultation } from '../shared/types/consultation.type';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventColor } from 'calendar-utils';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarEventTitleFormatter,
  CalendarView,
} from 'angular-calendar';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { CustomEventTitleFormatter } from './custom-event-title-formatter.provider';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-consultations',
  templateUrl: './consultations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./consultations.component.css'],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
  ],
})
export class ConsultationsComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | undefined;
  
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData: { action: string; event: CalendarEvent; } | undefined;
  refresh = new Subject<void>();
  events: CalendarEvent[] = [];
  /* events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      //color: { ...colors.red },
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      //color: { ...colors.yellow },
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      //color: { ...colors.blue },
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      //color: { ...colors.yellow },
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ]; */

  activeDayIsOpen: boolean = true;


  //------------------------------------------------------------------------------------------------


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
  constructor(private _http: HttpClient, private router: Router, private modal: NgbModal) {
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

    this._http.get<Consultation[]>("http://localhost:3000/consultation").subscribe((data) => {
      this.events = data.map((item: Consultation) => {
        console.log(item);
        return {
          start: new Date(item.dateStart),
          end: new Date(item.dateEnd),
          title: item.motive,
          allDay: false,
        };
      });
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

  eventClicked({ event }: { event: CalendarEvent }): void {
    console.log('Event clicked', event);
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







  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
  }


  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  changeView(direction: number) {
    // Determine the current view and update accordingly
    if (this.view === CalendarView.Day) {
      // If the current view is 'Day', switch to the next or previous day
      this.viewDate = new Date(this.viewDate);
      this.viewDate.setDate(this.viewDate.getDate() + direction);
    } else if (this.view === CalendarView.Week) {
      // If the current view is 'Week', switch to the next or previous week
      this.viewDate = new Date(this.viewDate);
      this.viewDate.setDate(this.viewDate.getDate() + 7 * direction);
    } else if (this.view === CalendarView.Month) {
      // If the current view is 'Month', switch to the next or previous month
      this.viewDate = new Date(this.viewDate);
      this.viewDate.setMonth(this.viewDate.getMonth() + direction);
    }
    // You can also update other properties as needed, like fetching events for the new view date
  }
}
