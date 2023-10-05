
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

    constructor(
        private http: HttpClient,
        private router: Router,
        private ngZone: NgZone,
        private localServiceS: LocalService,
        private tthhColaboradorService: TTHHColaboradorService
      ) {}

      
 /* loadColaboradores(idTipoColaborador,page, size, term): Observable<any> {
  if(idTipoColaborador){

    this.tthhColaboradorService.loadColaboradores(idTipoColaborador,page, size, term)
      .subscribe(
        async (colaboradores) => {
            const colaboradoresList=colaboradores["result"];
            let colaboradoresIds=[];
            colaboradoresList.forEach(element => {
                colaboradoresIds.push({
                  "idEntidad": element["idEntidad"]
                });
            });
          this.tthhColaboradorService.loadColaboradoresData(colaboradoresIds) .subscribe(
  (colaboradores) => {return colaboradores},
  (error) => {
    console.log(error)
    this.dataFondoSource.data = [];
    this.utilsService.alerta("error", "Error al cargar los honorarios");
    this.isLoading = false;
  }
  ); 
        },
        (error) => {
            return of({
                error: true,
                message:error.error.message,
              });
        }
      );
         
  }else{
    return of({});
  } 
} */
}

