import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [DatePipe] // Add DatePipe to the providers array
})
export class HeaderComponent implements OnInit {

  @Input() collapsed = false;
  @Input() screenWidth = 0;

  currentDateTime: string | null = null;

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.updateDateTime();
    /* setInterval(() => {
      this.updateDateTime();
    }, 1000); */
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
    //this.currentDateTime = this.datePipe.transform(now, 'medium');
    this.currentDateTime = this.datePipe.transform(now, 'dd MMMM yyyy', 'fr');
  }

  logout() : void{
    alert("Logout")
  }
}
