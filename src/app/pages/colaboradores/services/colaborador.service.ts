import { Injectable, NgZone } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
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

const helper = new JwtHelperService();

@Injectable({
  providedIn: "root",
})
export class ColaboradorService {
  catalogoUrl = ApiUrl.catalogos;

  nominaUrl = ApiUrl.nominaUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone,
    private localServiceS: LocalService,
    private navigationService: NavigationService
  ) {}

  private messageSource = new BehaviorSubject("default message");
  currentMessage$ = this.messageSource.asObservable();
  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  // TOKEN
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

  getColaboradores(
    page,
    pageSize,

    idTipoColaborador,
    term = ""
  ): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.nominaUrl}/colaborador/listado-colaboradores/colaboradors?page=${page}&pageSize=${pageSize}&term=${term}&idTipoColaborador=${idTipoColaborador}`;
    return this.http.get<ApiResponse>(url);
  }

  getTiposColaborador(): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/nomina/tipo-colaborador`;
    return this.http.get<ApiResponse>(url);
  }

  getOperadoras(): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/operadora-telefonica`;
    return this.http.get<ApiResponse>(url);
  }

  


  

  //INFORMACIÓN LABORAL

  /*   getSupervisores(): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/supervisores`;
    return this.http.get<ApiResponse>(url);
  }


  getJefeInmediato(): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/jefe-inmediato`;
    return this.http.get<ApiResponse>(url);
  }


  getCargo(): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/cargo`;
    return this.http.get<ApiResponse>(url);
  }
   */




  getJefesInmediatos(): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.nominaUrl}/colaborador/jefes-inmediatos`;
    return this.http.get<ApiResponse>(url);
  }

  getSupervisoresInmediatos(): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.nominaUrl}/colaborador/supervisores-inmediatos`;
    return this.http.get<ApiResponse>(url);
  }

  getUnidadesTrabajo(): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/departamentos`;
    return this.http.get<ApiResponse>(url);
  }

  getAreas(): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/areas`;
    return this.http.get<ApiResponse>(url);
  }

  getTiposContrato(): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/nomina/tipo-contrato`;
    return this.http.get<ApiResponse>(url);
  }











  

  

  getAdjuntoById(
    idColaborador: number,
    idAdjunto: number
  ): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.nominaUrl}/colaborador/${idColaborador}/adjunto/${idAdjunto}`;
    return this.http.get<ApiResponse>(url);
  }

  postAdjunto(idColaborador: number, data: any): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.nominaUrl}/colaborador/${idColaborador}/adjuntos`;
    return this.http.post<ApiResponse>(url, data);
  }

  updateAdjunto(idColaborador: number, idAdjunto: number, data: any) {
    this.tokenvalido();
    let url = `${this.nominaUrl}/colaborador/${idColaborador}/adjunto/${idAdjunto}`;
    return this.http.put(url, data);
  }

  deleteAdjunto(
    idColaborador: number,
    idAdjunto: number
  ): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.nominaUrl}/colaborador/${idColaborador}/adjunto/${idAdjunto}`;
    return this.http.delete<ApiResponse>(url);
  }

  getAdjuntoColaborador(idColaborador: number): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.nominaUrl}/colaborador/${idColaborador}/adjuntos`;
    return this.http.get<ApiResponse>(url);
  }

  getAdjuntoByTipo(
    idColaborador: number,
    tipo: number
  ): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.nominaUrl}/colaborador/${idColaborador}/adjuntos/${tipo}`;
    return this.http.get<ApiResponse>(url);
  }



  getFormasReclutamiento(): Observable<ApiResponse> {
    let url = `${this.catalogoUrl}/nomina/forma-reclutamiento`;
    return this.http.get<ApiResponse>(url);
  }

  getActividadesEconomicas(
    term = "",
    idActividad = 0
  ): Observable<ApiResponse> {
    let url = `${this.catalogoUrl}/actividades-economicas/buscador?term=${term}&idActividad=${idActividad}`;
    return this.http.get<ApiResponse>(url);
  }
  
    //TODO:ADJUNTOS
    getAdjuntos(
      idColaborador: number,
      idTipoColaborador: number
    ): Observable<ApiResponse> {
      this.tokenvalido();
      let url = `${this.nominaUrl}/colaborador/${idColaborador}/plantilla-adjuntos/${idTipoColaborador}`;
      return this.http.get<ApiResponse>(url);
    }
  
  
}
