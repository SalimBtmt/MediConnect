import { Component, OnInit } from '@angular/core';
import { HomeComponent } from './home/home.component';

// Interface for the sidenav toggle event
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'frontend';

  // Flag to track the collapse state of the sidenav
  isSideNavCollappsed = false;
  // Variable to store the current screen width
  screenWidth = 0;

  /**
   * OnInit implementation
   */
  ngOnInit(): void {}

  // Event handler for the sidenav toggle event
  onToggleSideNav(data: SideNavToggle): void {
    // Update the collapse state and screen width based on the event data
    this.isSideNavCollappsed = data.collapsed;
    this.screenWidth = data.screenWidth;
  }
}
