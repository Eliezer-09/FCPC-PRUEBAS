import { TokenInterceptorService } from "./services/token-interceptor.service";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { VexModule } from "../@vex/vex.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { CustomLayoutModule } from "./custom-layout/custom-layout.module";
// Import the library
import { NgxImgZoomModule } from "ngx-img-zoom";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { AuthModule } from "./pages/auth/auth.module";
import { AngularMaterialModule } from "./pages/angular-material.module";
import { PagesModule } from "./pages/pages.module";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { LoggerModule, NgxLoggerLevel } from "ngx-logger";
import { InputNumberModule } from "primeng/inputnumber";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { TourService } from 'ngx-ui-tour-md-menu';

@NgModule({
  declarations: [AppComponent],
  imports: [
    InputNumberModule,
    CommonModule,
    BrowserModule,
    AutocompleteLibModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AuthModule,
    PagesModule,
    AngularMaterialModule,
    MatIconModule,
    // Vex
    VexModule,
    CustomLayoutModule,
    NgbModule,
    LoggerModule.forRoot({
      //serverLoggingUrl: `${environment.serviceUrl}/api/logs`,
      level: environment.logLevel,
      serverLogLevel: environment.serverLogLevel,
      disableConsoleLogging: false,
    }),
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
    FontAwesomeModule,
  ],
  providers: [
    // TourService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
