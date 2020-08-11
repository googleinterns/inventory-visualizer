import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GoogleChartsModule} from 'angular-google-charts';
import {ApiService} from './api.service';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {NgxSpinnerModule} from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleChartsModule,
    HttpClientModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

