import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleChartsModule } from 'angular-google-charts';
import {ApiService} from './api.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { GoogleChartsComponent } from './google-charts/google-charts.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AuthInterceptor } from './auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Ng5SliderModule } from 'ng5-slider';


@NgModule({
  declarations: [
    AppComponent,
    GoogleChartsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleChartsModule,
    HttpClientModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    Ng5SliderModule
  ],
  providers: [ApiService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }

