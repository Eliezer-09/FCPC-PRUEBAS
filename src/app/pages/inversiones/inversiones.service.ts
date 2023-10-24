import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";
import { NavigationService } from "src/@vex/services/navigation.service";
import { SimulacionInversion, Vector } from "src/app/model/models";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DomSanitizer } from "@angular/platform-browser";
import { ApiServiceUrl, ApiUrl } from "src/app/Shared/Routes/ApiServiceUrl";
import { LocalService } from "src/app/services/local.service";

const helper = new JwtHelperService();

@Injectable({
  providedIn: "root",
})
export class InversionesService {
  serviceUrl = environment.serviceUrl;
  token: any;

  httpHeaders: {
    "Content-Type": string;
    Authorization: string;
    ApiKey: string;
  };
  httpHeaders2: {
    // 'Content-Type': undefined,
    Authorization: string;
    ApiKey: string;
  };
  httpHeaders3: {
    "Content-Type": string;
    Authorization: string;
    ApiKey: string;
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone,
    private navigationService: NavigationService,
    private dom: DomSanitizer,
    private localServiceS: LocalService
  ) {
    this.token = this.localServiceS.getItem("token");
    this.httpHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
      ApiKey: "E704B2FF-6C48-4C3D-88B6-C4B623DCDD4D",
    };

    this.httpHeaders2 = {
      // 'Content-Type': undefined,
      Authorization: `Bearer ${this.token}`,
      ApiKey: "E704B2FF-6C48-4C3D-88B6-C4B623DCDD4D",
    };

    this.httpHeaders3 = {
      "Content-Type": "application/text",
      Authorization: `Bearer ${this.token}`,
      ApiKey: "E704B2FF-6C48-4C3D-88B6-C4B623DCDD4D",
    };
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

  //TODO: ENTIDAD FINANCIERA

  getEntidadFinanciera(tipoFinanciera, pagina?, size?, termino?) {
    this.tokenvalido();
    let params = new HttpParams();
    if (pagina != undefined && size != undefined) {
      params = params.append("page", String(pagina));
      params = params.append("pageSize", String(size));
      params = params.append("term", termino);
    }
    return this.http.get(
      `${ApiUrl.Inversiones}/entidad-financiera/tipo-financiera/${tipoFinanciera}`,
      {
        headers: this.httpHeaders,
        params,
      }
    );
  }

  getEntidadFinancieraLite(tipoFinanciera, pagina?, size?) {
    this.tokenvalido();
    let params = new HttpParams();
    if (pagina != undefined && size != undefined) {
      params = params.append("page", String(pagina));
      params = params.append("pageSize", String(size));
    }
    return this.http.get(
      `${ApiUrl.Inversiones}/entidad-financiera/lite/tipo-financiera/${tipoFinanciera}`,
      {
        headers: this.httpHeaders,
        params,
      }
    );
  }

  getEntidadFinancieraById(IdEntidad) {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.Inversiones}/entidad-financiera/${IdEntidad}`,
      {
        headers: this.httpHeaders,
      }
    );
  }

  postEntidadFinanciera(data) {
    this.tokenvalido();
    return this.http.post(
      `${ApiUrl.Inversiones}/entidad-financiera/crear`,
      data,
      {
        headers: this.httpHeaders,
      }
    );
  }

  validarIdentificacionEntidadFinanciera(tipo_financiera, identificacion) {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.Inversiones}/entidad-financiera/${identificacion}/tipo-financiera/${tipo_financiera}`,
      { headers: this.httpHeaders }
    );
  }

  //TODO: EMISOR
  getCalificacionEmisorActual(idEmisor) {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.Inversiones}/entidad-financiera/${idEmisor}/calificacion-actual`,
      { headers: this.httpHeaders }
    );
  }

  postCalificacionEmisor(idEmisor, data) {
    this.tokenvalido();
    return this.http.post(
      `${ApiUrl.Inversiones}/entidad-financiera/${idEmisor}/calificacion/registro`,
      data,
      { headers: this.httpHeaders }
    );
  }

  getCalificacionEmisor(idEmisor) {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.Inversiones}/emisor/${idEmisor}/calificacion`,
      { headers: this.httpHeaders }
    );
  }

  getCalificacionesEmisor(idEmisor) {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.Inversiones}/emisor/${idEmisor}/calificaciones`,
      { headers: this.httpHeaders }
    );
  }

  // DESCARGAR EMISORES
  getDescargarEmisores() {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.Inversiones}/entidad-financiera/emisores/excel`,
      {
        responseType: "blob",
        headers: this.httpHeaders,
      }
    );
  }

  //TODO: CALIFICADORA
  // DESCARGAR CALIFICADORAS
  getDescargarCalificadoras() {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.Inversiones}/entidad-financiera/calificadoras/excel`,
      {
        responseType: "blob",
        headers: this.httpHeaders,
      }
    );
  }

  //TODO: INVERSION
  guardarInversion(data) {
    this.tokenvalido();
    return this.http.post(`${ApiUrl.Inversiones}/crear`, data, {
      headers: this.httpHeaders,
    });
  }

  generarTablaAmortizacion(data: SimulacionInversion) {
    this.tokenvalido();
    return this.http.post(`${ApiUrl.Inversiones}/simulacion`, data, {
      headers: this.httpHeaders,
    });
  }

  deleteInversion(id) {
    this.tokenvalido();
    return this.http.delete(`${ApiUrl.Inversiones}/${id}/eliminar`, {
      headers: this.httpHeaders,
    });
  }

  getInversiones(page?, size?, term?) {
    this.tokenvalido();
    let params = new HttpParams();
    params = term ? params.append("term", term) : params;
    return this.http.get(
      `${ApiUrl.Inversiones}/buscar?&page=${page}&pageSize=${size}`,
      { headers: this.httpHeaders, params }
    );
  }

  getInversionesById(idInversion) {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.Inversiones}/${idInversion}`, {
      headers: this.httpHeaders,
    });
  }

  postDetalleInversion(idInversion, data) {
    this.tokenvalido();
    return this.http.post(
      `${ApiUrl.Inversiones}/${idInversion}/detalles/guardar`,
      data,
      { headers: this.httpHeaders }
    );
  }

  postAdjuntoByIdInversion(body, id) {
    this.tokenvalido();
    return this.http.post(`${ApiUrl.Inversiones}/${id}/adjunto`, body, {
      headers: this.httpHeaders,
    });
  }

  getAdjuntoByIdInversion(idInversion) {
    this.tokenvalido();
    return this.http
      .get(`${ApiUrl.Inversiones}/${idInversion}/adjunto/Documento`, {
        responseType: "blob",
        headers: this.httpHeaders,
      })
      .pipe(
        map((res) => {
          let url = URL.createObjectURL(res);
          return this.dom.bypassSecurityTrustUrl(url);
        })
      );
  }

  getArchivoInversiones(fechaCorte) {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.Inversiones}/descargar/inversiones/${fechaCorte}`,
      { headers: this.httpHeaders, responseType: "blob" }
    );
  }

  //TODO: VECTOR
  getVectorById(tipoRenta, bolsaValor, term?, pagina?, size?) {
    this.tokenvalido();
    let params = new HttpParams();
    if (pagina != undefined && size != undefined) {
      params = params.append("page", String(pagina));
      params = params.append("pageSize", String(size));
    }
    params = params.append("tipoBolsa", bolsaValor);
    params = params.append("tipoRenta", tipoRenta);
    params = params.append("term", term);
    return this.http.get(`${ApiUrl.Inversiones}/vector/buscarvector`, {
      headers: this.httpHeaders,
      params,
    });
  }

  getCoordenadasVector(tipoRenta, bolsaValor, term?) {
    this.tokenvalido();
    let params = new HttpParams();
    params = params.append("tipoRenta", tipoRenta);
    params = params.append("tipoBolsa", bolsaValor);
    params = params.append("term", term);
    return this.http.get(`${ApiUrl.Inversiones}/vector/coordenada`, {
      headers: this.httpHeaders,
      params,
    });
  }

  postCargarVectoresExcel(
    mes: number,
    anio: number,
    file: File,
    bolsaValores,
    tipoRenta
  ): Observable<any> {
    this.tokenvalido();
    const fd = new FormData();
    fd.append("archivo", file);
    return this.http.post(
      `${ApiUrl.Inversiones}/vector/cargar?anio=${anio}&mes=${mes}&tipo=${bolsaValores}&tipoRenta=${tipoRenta}`,
      fd,
      { headers: this.httpHeaders2 }
    );
  }

  postVector(vector: Vector[]): Observable<Vector> {
    return this.http.post(`${ApiUrl.Inversiones}/vector/guardar`, vector, {
      headers: this.httpHeaders,
    });
  }
}

export enum EstadoInversionEnum {
  Registrado = 1,
  Activo = 10,
  Pagado = 100,
  Anulado = 0,
}
