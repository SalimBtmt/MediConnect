import { Component, OnInit, ChangeDetectionStrategy,
  ViewChild,
  TemplateRef } from '@angular/core';
import { Consultation } from '../shared/types/consultation.type';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Router, NavigationEnd } from '@angular/router';
import { Cons } from 'rxjs';

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
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
// Interface for the sidenav toggle event
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
  styles: [
    `
      h3 {
        margin: 0 0 10px;
      }

      pre {
        background-color: #f5f5f5;
        padding: 15px;
      }
    `,
  ],
  styleUrls: ['./consultations.component.css']
})
export class ConsultationsComponent implements OnInit {

  //------------------------------------------------------------------------------------------------


  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | undefined;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  } | undefined;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [
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
  ];

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
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        //color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
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
