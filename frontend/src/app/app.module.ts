import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BodyComponent } from './body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { PatientComponent } from './patient/patient.component';
import { ConsultationsComponent } from './consultations/consultations.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BodyComponent,
    SidenavComponent,
    PatientComponent,
    ConsultationsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
