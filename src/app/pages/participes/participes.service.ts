import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { NGXLogger } from "ngx-logger";
import { NavigationService } from "src/@vex/services/navigation.service";
import { ComponentesService } from "src/app/services/componentes.service";
import { environment } from "../../../environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";
import { map } from "rxjs/operators";
import { DataService } from "src/app/services/data.service";

import { ApiServiceUrl, ApiUrl } from "src/app/Shared/Routes/ApiServiceUrl";

import { Observable } from "rxjs";
import { LocalService } from "src/app/services/local.service";

const helper = new JwtHelperService();

@Injectable({
  providedIn: "root",
})
export class ParticipesService {
  token: any;
  httpHeaders: {
    "Content-Type": string;
    Authorization: string;
    ApiKey: string;
  };
  constructor(
    private http: HttpClient,
    private router: Router,
    private dom: DomSanitizer,
    private dataComponent: ComponentesService,
    private navigationService: NavigationService,
    private ngZone: NgZone,
    private localServiceS: LocalService
  ) {
    this.token = this.localServiceS.getItem("token");
    this.httpHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
      ApiKey: "E704B2FF-6C48-4C3D-88B6-C4B623DCDD4D",
    };
  }

  getParticipeAportesPendientes(idParticipe) {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.Participe}/aportes/pendientes?identidad=${idParticipe}`,
      {}
    );
  }

  getParticipeGarantias(idParticipe) {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.Participe}/${idParticipe}/garantias`,
      {}
    );
  }

  getParticipeActvidad(idParticipe) {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.Participe}/${idParticipe}/actividad`,
      {}
    );
  }

  getComentariosByActividad(idTransaccion, tipoActividad) {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.Participe}/${idTransaccion}/actividad-comentario?TipoActividad=${tipoActividad}`,
      {}
    );
  }

  postComentarioByActividad(idTransaccion, tipoActividad, data) {
    this.tokenvalido();
    return this.http.post(
      `${ApiUrl.Participe}/${idTransaccion}/actividad-comentario?TipoActividad=${tipoActividad}`,
      data,
      {}
    );
  }

  postComentarioContrato(idParticipe, data) {
    this.tokenvalido();
    return this.http.post(
      `${ApiUrl.Participe}/${idParticipe}/comentario`,
      data,
      {}
    );
  }

  postComentarioTarea(data) {
    this.tokenvalido();
    return this.http.post(
      `${ApiUrl.Participe}/comentario/tipotarea`,
      data,
      {}
    );
  }

  getHistorialNotificaciones(id) {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.Participe}/${id}/log-notificaciones`,
      {}
    );
  }

  getHistorialCambios(idParticipe) {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.Participe}/${idParticipe}/log-estadoentidad`,
      {}
    );
  }

  getHistorialCambiosContrato(id) {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.Participe}/${id}/log-estadocontrato`,
      {}
    );
  }

  getHistorialCambiosPrestamo(id) {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.Participe}/${id}/log-estadoprestamo`,
      {}
    );
  }

  getTiposTareas() {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.tickets}/tipotarea`, {});
  }

  // Prestamos Vencidos
  getPrestamosVencidosByParticcipe(idParticipe) {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.creditos}/buscar/vencidos?idParticipe=${idParticipe}`,
      {}
    );
  }

  postSMS(data) {
    this.tokenvalido();
    return this.http.post(`${ApiUrl.Participe}/enviar/sms`, data, {});
  }

  getPhotoFuncionario(correo) {
    this.tokenvalido();
    const httpHeaders2 = {
      // 'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
      // 'ApiKey':'E704B2FF-6C48-4C3D-88B6-C4B623DCDD4D'
    };
    return this.http
      .get(`${ApiUrl.Auth}/profile/photo/${correo}`, { responseType: "blob" })
      .pipe(
        map((res) => {
          let url = URL.createObjectURL(res);
          return this.dom.bypassSecurityTrustUrl(url);
        })
      );
  }

  getVerifyEmail(email) {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.Participe}/existenciacorreo/${email}`,
      {}
    );
  }

  //CARGAR EXCEL DE ROLES
  postCargarExcelRoles(data: File): Observable<any> {
    const fd = new FormData();
    fd.append("archivo", data);
    this.tokenvalido();
    return this.http.post(`${ApiUrl.Participe}/cargar-roles`, fd);
  }

  //GUARDAR INFORMACION CARGADA ROLES
  postGuardarRoles(fecha, aporte) {
    this.tokenvalido();
    const data = {
      fecha: fecha,
      roles: aporte,
    };
    return this.http.post(`${ApiUrl.Participe}/guardar-roles`, data);
  }

  getAportesAdicionales(pagina?, size?, term?, full?) {
    this.tokenvalido();
    let params = new HttpParams();
    if (pagina != undefined && size != undefined) {
      params = params.append("page", String(pagina));
      params = params.append("pageSize", String(size));
    }
    params = term?params.append("term", String(term)):params;
    if (full != undefined) {
      params = params.append("full", full);
    }
    return this.http.get(`${ApiUrl.Participe}/aportes/historial`, {
      headers: this.httpHeaders,
      params,
    });
  }

  getComprobantesByParticipe(idParticipe) {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.Participe}/${idParticipe}/comprobantes`,
      {}
    );
  }

  getDocumentoAporteAdicional(idEntidad, monto) {
    this.tokenvalido();
    let params = new HttpParams();
    params = monto ? params.append("monto", String(monto)) : params;
    return this.http
      .get(
        `${ApiUrl.Participe}/${idEntidad}/aporte-adicional/solicitud`,
        { responseType: "blob", params }
      )
      .pipe(
        map((res) => {
          let url = URL.createObjectURL(res);
          return this.dom.bypassSecurityTrustUrl(url);
        })
      );
  }

  logout() {
    this.localServiceS.removeItem("token");
    sessionStorage.removeItem("email");

    this.ngZone.run(() => {
      this.router.navigateByUrl("/login");
      this.navigationService.items = [];
    });
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

  //TODO:DIRECCION


  getDireccionParticipe(idEntidad) {
    this.tokenvalido();
    return this.http.get( `${ApiUrl.Participe}/direccion/${idEntidad}/direcciones`,  {});
  }

  postDireccionParticipe(idEntidad,data) {
    this.tokenvalido();
    return this.http.post( `${ApiUrl.Participe}/direccion/${idEntidad}/direccion`, data);
  }

  putDireccionParticipe(idEntidad,idDireccion,data) {
    this.tokenvalido();
    return this.http.put( `${ApiUrl.Participe}/direccion/${idEntidad}/direccion/${idDireccion}`, data);
  }

  deleteDireccionParticipe(idEntidad,idDireccion) {
    this.tokenvalido();
    return this.http.delete( `${ApiUrl.Participe}/direccion/${idEntidad}/direccion/${idDireccion}`);
  }

  
  //TODO:CONTACTO


  getContactoParticipe(idEntidad) {
    this.tokenvalido();
    return this.http.get( `${ApiUrl.Participe}/contacto/${idEntidad}/contactos`,  {});
  }

  postContactoParticipe(idEntidad,data) {
    this.tokenvalido();
    return this.http.post( `${ApiUrl.Participe}/contacto/${idEntidad}/contacto`, data);
  }

  putContactoParticipe(idEntidad,idContacto,data) {
    this.tokenvalido();
    return this.http.put( `${ApiUrl.Participe}/contacto/${idEntidad}/contacto/${idContacto}`, data);
  }

  deleteContactoParticipe(idEntidad,idContacto) {
    this.tokenvalido();
    return this.http.delete( `${ApiUrl.Participe}/contacto/${idEntidad}/contacto/${idContacto}`);
  }

  //TODO: PERFIL ECONOMICO

  getPerfilEconomicoParticipe(idEntidad) {
    this.tokenvalido();
    return this.http.get( `${ApiUrl.Participe}/perfil-economico/${idEntidad}`,  {});
  }

  postPerfilEconomicoParticipe(idEntidad,data) {
    this.tokenvalido();
    return this.http.post( `${ApiUrl.Participe}/perfil-economico/${idEntidad}`, data);
  }

}
