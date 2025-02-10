import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';


import { routes } from './app.routes';
import { HttpClientModule} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { StudentListComponent } from './pages/student-list/student-list.component';
import { RouterModule } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers:[
    importProvidersFrom(BrowserModule),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(CommonModule),
    importProvidersFrom(RouterModule),
    provideRouter(routes),
    StudentListComponent
  ]
};
