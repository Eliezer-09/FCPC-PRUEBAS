
import { Injectable, NgZone } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable, of } from "rxjs";
import { NavigationService } from "src/@vex/services/navigation.service";
import { Parentesco } from "src/app/pages/participes/models/cesante-catalogo.interface";
import {
  ApiResponse,
  TipoIdentificacion,
  Nacionalidades,
  EstadoCivil,
  Genero,
  Transporte,
  CargaFamiliar,
  Direccion,
  Contacto,
  ReferenciaBancaria,
} from "../models/colaboradores";
import { ApiUrl } from "src/app/Shared/Routes/ApiServiceUrl";
import { TreeNode } from "primeng/api";
import { LocalService } from "src/app/services/local.service";

import { ColaboradorService } from "./colaborador.service";
import { catchError, map } from "rxjs/operators";
import { OperationResultParticipe } from "src/app/model/models";
import { TTHHColaboradorService } from "./tthh-colaborador.service";


const helper = new JwtHelperService();

@Injectable({
  providedIn: "root",
})
export class TThhService {
  tthhUrl = ApiUrl.tthhUrl;
  constructor(
      private http: HttpClient,
      private router: Router,
      private ngZone: NgZone,
      private localServiceS: LocalService,
      private tthhColaboradorService: TTHHColaboradorService,
      private navigationService: NavigationService
    ) {}

  tokenvalido() {
    if (this.localServiceS.getItem("token")) {
      const token = this.localServiceS.getItem("token");
      const isExpired = helper.isTokenExpired(token);
      if (isExpired) {
        this.logout();
      } else {
        return true;
      }
    }
  }
  logout() {
    this.localServiceS.removeItem("token");
    sessionStorage.removeItem("email");

    this.ngZone.run(() => {
      this.router.navigateByUrl("/login");
      this.navigationService.items = [];
    });
  }
cargarFeriado(page, size, term = ''): Observable<any> {
  this.tokenvalido();
  const url = `${this.tthhUrl}/colaborador/festivos`;
  return this.http.get(url);
}

guardarFeriado(data: any): Observable<any> {
  this.tokenvalido();
  const url = `${this.tthhUrl}/colaborador/festivo`;
  return this.http.post(url, data);
}



}

