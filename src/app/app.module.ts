import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {DownloadService} from './services/download-excel.service';
import {DataService} from './services/manage-movie-list.services'

@NgModule({
  declarations: [
    AppComponent,
    MovieListComponent,
    MovieDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [DownloadService,DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
