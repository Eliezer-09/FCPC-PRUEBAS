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
import { ApiServiceUrl, ApiUrl } from "src/app/Shared/Routes/ApiServiceUrl";
import { TreeNode } from "primeng/api";
import { LocalService } from "src/app/services/local.service";
import { ApiUrlCatalogsTTHH } from "../utils/api-service-url-catalogs-TTHH";
import { ApiUrlTTHH } from "../utils/api-service-url-TTHH";
import { catchError } from "rxjs/operators";



const helper = new JwtHelperService();

@Injectable({
  providedIn: "root",
})
export class TTHHColaboradorService {
/*   catalogoUrl = ApiUrl.catalogos; */

  nominaUrl = ApiUrlCatalogsTTHH.nomina;
  participeUrl = ApiUrl.Participe;
  tthhServiceUrl = ApiUrl.tthhUrl;
  colaboradorUrl=ApiUrlTTHH.colaborador;
  catalogosUrl = ApiUrl.catalogos;
 
  catalogoUrl= ApiUrlCatalogsTTHH.catalogo;
  httpHeaders = {
    "Content-Type": "application/json",
    ApiKey: "E704B2FF-6C48-4C3D-88B6-C4B623DCDD4D",
  };
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


  //TODO: COLABORADORES TTHH
   loadColaboradores(idTipoColaborador, pagina?, size?, termino?) {
    this.tokenvalido();
    let params = new HttpParams();
    params = params.append("idTipoColaborador", idTipoColaborador);
    params =termino? params.append("term", termino):params;
    params =pagina? params.append("page", String(pagina)):params;
    params =size? params.append("pageSize", String(size)):params;
    return this.http.get(`${this.tthhServiceUrl}${this.colaboradorUrl}/listado-colaboradores/colaboradores`, {
      headers: this.httpHeaders,
      params,
    });
  } 

  loadColaboradorId(id) {
    this.tokenvalido();
    let params = new HttpParams();
    params =id? params.append("id", id):params;
    return this.http.get(`${this.tthhServiceUrl}${this.colaboradorUrl}/listado-colaboradores/colaboradores`, {
      headers: this.httpHeaders,
      params,
    });
  }

  putInformacionLaboral(
    idColaborador: number,
    data: any
  ): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/informacion-laboral/${idColaborador}/colaborador`;
    return this.http.put<ApiResponse>(url, data);
  }

    //PROCESO DE SELECCION
    postProcesoSeleccion(
      idColaborador: number,
      data: any
    ): Observable<ApiResponse> {
      this.tokenvalido();
      let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/proceso-seleccion/${idColaborador}/colaborador`;
      return this.http.put<ApiResponse>(url, data);
    }

    postColaborador(data: any): Observable<ApiResponse> {
      this.tokenvalido();
      let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/datos-colaborador`;
      return this.http.post<ApiResponse>(url, data);
    }
  

    //TODO: FORMACION ACADEMICA TTHH
//reparar
  guardarDatosFormacionAcademica(id: any, idFormacionAcademica:any,data: any) {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${id}/formacion-academica/${idFormacionAcademica }`;
    return this.http.put(url, data);
  }
    
  
  getFormacionAcademica(id: any): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${id}/formacion-academica`;
    return this.http.get<ApiResponse>(url);
  }

  postFormacionAcademica(
    data: any,
    idColaborador: number
  ): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/formacion-academica`;
    return this.http.post<ApiResponse>(url, data);
  }

  updateFormacionAcademica(
    data: any,
    idColaborador: number,
    idFormacionAcademica: number
  ): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/formacion-academica/${idFormacionAcademica}`;
    return this.http.put<ApiResponse>(url, data);
  }

  deleteFormacionAcademica(
    idColaborador: number,
    idFormacionAcademica: number
  ): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/formacion-academica/${idFormacionAcademica}`;
    return this.http.delete<ApiResponse>(url);
  }

  updateUltimaCulminadaFormacionAcademica(
    data: any,
    idColaborador: number,
    idFormacionAcademica: number
  ): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/formacion-culminada/${idFormacionAcademica}`;
    return this.http.put<ApiResponse>(url, data);
  }
  //REFERENCIA BANCARIA

  guardarDatosReferenciaBancaria(id: any, data: any) {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/cuenta-banco/${id}/colaborador`;
    return this.http.put(url, data);
  }


  //Todo: contactos
    //CONTACTO
    getContactos(id: any): Observable<ApiResponse> {
      this.tokenvalido();
      let url = `${this.catalogosUrl}/contacto${this.colaboradorUrl}/${id}/contactos`;
      return this.http.get<ApiResponse>(url);
    }
  
    postContacto(data: any, idColaborador: number): Observable<Contacto> {
      this.tokenvalido();
      let url = `${this.catalogosUrl}/contacto${this.colaboradorUrl}/${idColaborador}/contacto`;
      return this.http.post<Contacto>(url, data);
    }
  
    updateContacto(
      data: any,
      idColaborador: number,
      idContacto: number
    ): Observable<Contacto> {
      this.tokenvalido();
      let url = `${this.catalogosUrl}/contacto${this.colaboradorUrl}/${idColaborador}/contacto/${idContacto}`;
      return this.http.put<Contacto>(url, data);
    }
  
    deleteContacto(
      idColaborador: number,
      idContacto: number
    ): Observable<ApiResponse> {
      this.tokenvalido();
      let url = `${this.catalogosUrl}/contacto${this.colaboradorUrl}/${idColaborador}/contacto/${idContacto}`;
      return this.http.delete<ApiResponse>(url);
    }




  postDatosPersonales(data: any): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.catalogosUrl}${this.nominaUrl}${this.colaboradorUrl}/datos-personales`;
    return this.http.post<ApiResponse>(url, data);
  }

  //NO USADO
  loadSupervisoresInmediatos() {
    this.tokenvalido();
    return this.http.get(`${this.catalogosUrl}${this.nominaUrl}${this.colaboradorUrl}/supervisores-inmediatos`, {
      headers: this.httpHeaders
    });
  } 

  //NO USADO
  loadJefesInmediatos() {
    this.tokenvalido();
    return this.http.get(`${this.catalogosUrl}${this.nominaUrl}${this.colaboradorUrl}/jefes-inmediatos`, {
      headers: this.httpHeaders
    });
  } 


  //TODO: CATALOGO COLABORADORES
  loadColaboradoresData(colaboradoresIds,pagina, size) {
    this.tokenvalido();
    let params = new HttpParams();
    params =pagina? params.append("page", String(pagina)):params;
    params =size? params.append("pageSize", String(size)):params;
    return this.http.post(`${this.catalogosUrl}${this.nominaUrl}${this.colaboradorUrl}/lista-entidades`,colaboradoresIds,{
      headers: this.httpHeaders,
      params,
    }).pipe(
      catchError((error) => {
        console.log("Se produjo un error:", error);
        return of({
          error: true,
          message:error.error.message,
        });
      }))
  } 

  getTipoJornada(): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}${this.catalogoUrl}/tipo-jornada`;
    return this.http.get<ApiResponse>(url);
  }


  getModalidad(): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}${this.catalogoUrl}/tipo-modalidad`;
    return this.http.get<ApiResponse>(url);
  }

  getClasesContribuyentes(): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}${this.catalogoUrl}/tipo-clase-contribuyente`;
    return this.http.get<ApiResponse>(url);
  }

 //TODO: DIRECCCION

   postDireccion(data: any, idEntidad: any): Observable<Direccion[]> {
    this.tokenvalido();
    let url = `${this.participeUrl}${ApiUrlCatalogsTTHH.direccion}/${idEntidad}/direccion`;
    return this.http.post<Direccion[]>(url, data);
  }

  getDireccionesById(idEntidad: any): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.participeUrl}${ApiUrlCatalogsTTHH.direccion}/${idEntidad}/direcciones`;
    return this.http.get<ApiResponse>(url);
  }

  updateDireccion(
    data: any,
    idEntidad: any,
    idDireccion: any
  ): Observable<Direccion[]> {
    this.tokenvalido();
    let url = `${this.participeUrl}${ApiUrlCatalogsTTHH.direccion}/${idEntidad}/direccion/${idDireccion}`;
    return this.http.put<Direccion[]>(url, data);
  }

  deleteDireccion(
    idEntidad: number,
    idDireccion: number
  ): Observable<Direccion[]> {
    this.tokenvalido();
    let url = `${this.participeUrl}${ApiUrlCatalogsTTHH.direccion}/${idEntidad}/direccion/${idDireccion}`;
    return this.http.delete<Direccion[]>(url);
  }

  
  //TODO:TRANSPORTES
  getTiposVehiculos(): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}${this.catalogoUrl}/tipo-vehiculo`;
    return this.http.get<ApiResponse>(url);
  }

  getTransportes(id: any): Observable<ApiResponse> {
    this.tokenvalido();
    if (!id) return;
    let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${id}/vehiculos`;
    return this.http.get<ApiResponse>(url);
  }

  updateTransporte(
    data: Transporte,
    idColaborador: number,
    idVehiculo: number
  ): Observable<Transporte> {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/vehiculo/${idVehiculo}`;
    return this.http.put<Transporte>(url, data);
  }

  postTransporte(
    data: Transporte,
    idColaborador: number
  ): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/vehiculo`;
    return this.http.post<ApiResponse>(url, data);
  }

  deleteTransporte(
    idColaborador: number,
    idVehiculo: number
  ): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/vehiculo/${idVehiculo}`;
    return this.http.delete<ApiResponse>(url);
  }




  //TODO:CARGAS FAMILIARES
  getTiposParentesco(): Observable<Parentesco[]> {
    this.tokenvalido();
    let url = `${this.catalogosUrl}/parentesco`;
    return this.http.get<Parentesco[]>(url);
  }

  getCargasFamiliares(idColaborador: any): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/dependientes`;
    return this.http.get<ApiResponse>(url);
  }

  postCargaFamiliar(
    data: any,
    idColaborador: number
  ): Observable<CargaFamiliar> {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/dependiente`;
    return this.http.post<CargaFamiliar>(url, data);
  }

  updateCargaFamiliar(
    data: any,
    idColaborador: number,
    idDependiente
  ): Observable<CargaFamiliar> {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/dependiente/${idDependiente}`;
    return this.http.put<CargaFamiliar>(url, data);
  }

  deleteCargaFamiliar(
    idColaborador: number,
    idCargaFamiliar: number
  ): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/dependiente/${idCargaFamiliar}`;
    return this.http.delete<ApiResponse>(url);
  }


  //TODO:DATOS PERSONALES

  getDatosPersonales(
    id: any,
    idTipoIdentificacion: number
  ): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.catalogosUrl}${this.nominaUrl}${this.colaboradorUrl}/identificacion/${id}?idTipoIdentificacion=${idTipoIdentificacion}`;
    return this.http.get<ApiResponse>(url);
  }

  getIdentificadores(): Observable<TipoIdentificacion[]> {
    this.tokenvalido();
    let url = `${this.catalogosUrl}/tipos-identificacion`;
    return this.http.get<TipoIdentificacion[]>(url);
  }

  getNacionalidades(): Observable<Nacionalidades[]> {
    this.tokenvalido();
    let url = `${this.catalogosUrl}/nacionalidades`;
    return this.http.get<Nacionalidades[]>(url);
  }

  getEstadosCivil(): Observable<EstadoCivil[]> {
    this.tokenvalido();
    let url = `${this.catalogosUrl}/estado-civil`;
    return this.http.get<EstadoCivil[]>(url);
  }

  getCertificados(): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}${this.catalogoUrl}/tipo-certificacion`;
    return this.http.get<ApiResponse>(url);
  }

  getGeneros(): Observable<Genero[]> {
    this.tokenvalido();
    let url = `${this.catalogosUrl}/genero`;
    return this.http.get<Genero[]>(url);
  }



  getTiposDiscapacidad(): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.catalogosUrl}/nomina/tipo-discapacidad`;
    return this.http.get<ApiResponse>(url);
  }

//TODO:Referencia bancaria
  getReferenciaBancaria(idColaborador: any): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.catalogosUrl}/entidad/${idColaborador}/referencia-bancarias`;
    return this.http.get<ApiResponse>(url);
  }

  postReferenciaBancaria(data: any, idColaborador: number) {
    this.tokenvalido();
    let url = `${this.catalogosUrl}/entidad/${idColaborador}/referencia-bancaria`;
    return this.http.post(url, data);
  }

  updateReferenciaBancaria(
    data: any,
    idColaborador: number,
    idReferenciaBancaria: number
  ): Observable<ReferenciaBancaria> {
    this.tokenvalido();
    let url = `${this.catalogosUrl}/entidad/${idColaborador}/referencia-bancaria/${idReferenciaBancaria}`;
    return this.http.put<ReferenciaBancaria>(url, data);
  }

  deleteReferenciaBancaria(
    idColaborador: number,
    idReferenciaBancaria: number
  ): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.catalogosUrl}/entidad/${idColaborador}/referencia-bancaria/${idReferenciaBancaria}`;
    return this.http.delete<ApiResponse>(url);
  }


    //TODO:REFERENCIA PERSONAL
    getReferenciaPersonal(idColaborador: any): Observable<ApiResponse> {
      this.tokenvalido();
      let url = `${this.catalogosUrl}/entidad/${idColaborador}/referencia-personales`;
      return this.http.get<ApiResponse>(url);
    }
  
    postReferenciaPersonal(
      data: any,
      idColaborador: number
    ): Observable<ApiResponse> {
      this.tokenvalido();
      let url = `${this.catalogosUrl}/entidad/${idColaborador}/referencia-personal`;
      return this.http.post<ApiResponse>(url, data);
    }
  
    updateReferenciaPersonal(
      data: any,
      idColaborador: number,
      idReferenciaPersonal: number
    ): Observable<ApiResponse> {
      this.tokenvalido();
      let url = `${this.catalogosUrl}/entidad/${idColaborador}/referencia-personal/${idReferenciaPersonal}`;
      return this.http.put<ApiResponse>(url, data);
    }
  
    deleteReferenciaPersonal(
      idColaborador: number,
      idReferenciaPersonal: number
    ): Observable<ApiResponse> {
      this.tokenvalido();
      let url = `${this.catalogosUrl}/entidad/${idColaborador}/referencia-personal/${idReferenciaPersonal}`;
      return this.http.delete<ApiResponse>(url);
    }
  


     //TODO:CONTRATO
  guardarInformacionContrato(idColaborador, data): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/contrato`;
    return this.http.post<ApiResponse>(url, data);
  }

  getDatosContrato(idColaborador: number): Observable<ApiResponse> {
    let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/contratos`;
    return this.http.get<ApiResponse>(url);
  }


   //TODO:ADJUNTOS
  getAdjuntos(
    idColaborador: number,
    idTipoColaborador: number
  ): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/plantilla-adjuntos/${idTipoColaborador}`;
    return this.http.get<ApiResponse>(url);
  } 

  //TODO:CARGA BATCH NOMINA

  postCargaBatchIngresoEgreso(data: File): Observable<any> {
    const fd = new FormData();
    fd.append("request", data);
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}/colaborador/cargar-batch/nomina`;
    return this.http.post<ApiResponse>(url, fd);
  }


  postGuardarCargaBatchIngresoEgreso(data): Observable<any> {
    this.tokenvalido();
    let url = `${this.tthhServiceUrl}/colaborador/guardar/nomina`;
    return this.http.post<ApiResponse>(url, data);
  }

  getListadoNomina(pagina,size,idTipoColaborador?,identificacion?): Observable<ApiResponse> {
    this.tokenvalido();
    let params = new HttpParams();
    params =idTipoColaborador? params.append("idTipoColaborador", String(idTipoColaborador)):params;
    params =identificacion? params.append("identificacion", identificacion):params;
    params =pagina? params.append("page", String(pagina)):params;
    params =size? params.append("pageSize", String(size)):params;
    let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/buscador`;
    return this.http.get<ApiResponse>(url,{
      headers: this.httpHeaders,
      params,
    });
  }


}