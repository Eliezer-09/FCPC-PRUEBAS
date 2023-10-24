import { DataService } from "src/app/services/data.service";
import { Injectable } from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { EMPTY, throwError } from "rxjs";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { LocalService } from "./local.service";

@Injectable({
  providedIn: "root",
})
export class TokenInterceptorService implements HttpInterceptor {
  url401 = "";
  reload = 0;
  constructor(
    private dataService: DataService,
    private router: Router,
    private localServiceS: LocalService,
    private dialogRef: MatDialog
  ) {}

  intercept(req, next) {
    let request = req;

    const basic = localStorage.getItem("basic");
    const token = this.localServiceS.getItem("token");

    if (basic) {
      const tokenReq = req.clone({
        setHeaders: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `${this.dataService.getBasic()}`,
        },
      });
      return next.handle(tokenReq);
    }
    if (token) {
      request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.dataService.getToken()}`,
        },
      });
    }

    if (this.reload > 30) {
      setTimeout((x) => {
        this.reload = 0;
      }, 10000);
      return EMPTY;
    } else {
      return next.handle(request).pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse && event.status === 200) {
            this.url401 = "";
            this.reload = 0;
          }
        }),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401) {
            if (this.url401 == request.url) {
              if (this.reload > 12) {
                this.reload = 0;
              } else {
                this.reload++;
              }
            } else {
              this.url401 = request.url;
              this.reload = 0;
            }
            this.localServiceS.removeItem("token");
            if (this.router.url == "/login" || this.router.url == "/") {
            } else {
              this.router.navigateByUrl("/login");
            }
            this.dialogRef.closeAll();
          }

          return throwError(err);
        })
      );
    }
  }
}
