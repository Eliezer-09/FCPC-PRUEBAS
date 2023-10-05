import { Injectable } from "@angular/core";
import { ComponentesService } from "src/app/services/componentes.service";
import { DataService } from "src/app/services/data.service";
import { TiposAdjunto } from "src/@vex/interfaces/enums";
import { CreditosService } from "../pages/creditos/creditos.service";
import { AuthService } from "../pages/auth/auth.service";
import { catchError, map, tap } from "rxjs/operators";
import { Observable, of, throwError } from "rxjs";
import { PostAdjunto } from "../model/models";
import { SolicitudCredito } from "../pages/creditos/model/models-creditos";


@Injectable({
  providedIn: "root",
})
export class CreditoServiceComponent {
  constructor(
    private dataService: DataService,
    private creditosService: CreditosService,
    private authService: AuthService
  ) {}

  //TODO: CREDITOS


  simulacionCreditoRequest(tipoCredito,dataSimulacion){
      if(tipoCredito=="Normal")tipoCredito=""
      return this.creditosService.postSimulacionCreditos(tipoCredito,dataSimulacion).pipe(
        map((res) => {
        let data = res["result"];
        let solicitudCredito:SolicitudCredito={
          idParticipe: dataSimulacion.idParticipe,
          fecha: data.fechaInicio,
          fechaActualizacion:  null,
          plazo: data.plazo,
          idProducto: data.idProducto,
          tipoAmortizacion: data.tipoAmortizacion,
          montoSolicitado:data.montoSolicitado,
          valorCuota: data.valorCuota,  
          motivoPrestamo: "",
          comentarios: "",
          idProveedor: null,
          garantias: [],
          garantes: [],
          prestamos:dataSimulacion.prestamos,
          observaciones: "",
          descuentoMora:dataSimulacion.descuentoMora,
          interesVariable:dataSimulacion.interesVariable
        }
           return {solicitud:solicitudCredito, data:data}

      }),catchError((error) => {
        return of({
          error: true,
          message: error.error.message
        });
      })
      );

  }


}
