import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { navbarData } from './nav-data';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit{

  // Event emitter for the sidenav toggle event
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  
  // Flag to track the collapse state of the sidenav
  collapsed = false;
  // Variable to store the current screen width
  screenWidth = 0;
  // Data for the sidenav navigation items
  navData = navbarData;

  // Listen to window resize events
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 768 ) {
      this.collapsed = false;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
    }
  }

  ngOnInit(): void {
      // Initialize the screen width
      this.screenWidth = window.innerWidth;
      // Add click event listener to the document
      document.addEventListener('click', this.onDocumentClick);

  }

  // Toggle the collapse state of the sidenav
  toggleCollapse() : void{
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
  }

  // Close the sidenav 
  closeSidenav(){
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
  }

  // Handle the document click event
  onDocumentClick = (event: MouseEvent) => {
    const sidenavElement = document.querySelector('.sidenav');
    const closeButton = document.querySelector('.btn-close');
    if (sidenavElement && !sidenavElement.contains(event.target as Node) && !closeButton?.contains(event.target as Node)) {
      this.closeSidenav();
    }
  }
}
