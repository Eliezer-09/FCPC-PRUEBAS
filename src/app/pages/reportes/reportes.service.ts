import { Injectable, NgZone } from "@angular/core";
import { DataService } from "src/app/services/data.service";
import { NavigationService } from "src/@vex/services/navigation.service";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ApiUrl } from "src/app/Shared/Routes/ApiServiceUrl";
import { LocalService } from "src/app/services/local.service";
import { map } from "rxjs/operators";
import { ComponentesService } from "src/app/services/componentes.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Observable } from "rxjs";
const helper = new JwtHelperService();

@Injectable({
  providedIn: "root",
})
export class ReportesService {
  token: any;
  httpHeaders: { "Content-Type": string; Authorization: string };
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

  constructor(
    private localServiceS: LocalService,
    private ngZone: NgZone,
    private router: Router,
    private navigationService: NavigationService,
    private http: HttpClient,
    private dataComponent: ComponentesService,
    private dom: DomSanitizer
  ) {
    this.token =
      this.localServiceS.getItem("token") || window.navigator.appVersion;
    this.httpHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
    };
  }

  getReporteDTO(pagina?, size?) {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.reportes}/buscar?pageNumber=${pagina}&pageSize=${size}`
    );
  }

  getReporteDTOByTerm(term?, pagina?, size?) {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.reportes}/buscar?term=${term}&pageNumber=${pagina}&pageSize=${size}`
    );
  }

  getReporteDTOLight(idReporte) {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.reportes}/${idReporte}`);
  }

  postReporteReports(idReporte, formato, data) {
    this.tokenvalido();
    return this.http.post(
      `${ApiUrl.reportes}/${idReporte}/descargar/${formato}`,
      data,
      { responseType: "blob" }
    );
  }

  //TODO:Estructuras

  getEstructuraReports(pagina?, size?,term?) {
    this.tokenvalido();
    let params = new HttpParams();
    params = term ? params.append("term", term) : params;
    return this.http.get(
      `${ApiUrl.reportes}/estructuras?pageNumber=${pagina}&pageSize=${size}`,
      { headers: this.httpHeaders, params }
    );
  }

  getEstructuraReporFile(codeReporte, formato, data,actualizar) {
    this.tokenvalido();
    let params = new HttpParams();
    params = params.append('actualizar',actualizar);
    return this.http.get(`${ApiUrl.reportes}/estructuras/${codeReporte}/${data.date_month_year || data.date_year}/${formato}`, { headers: this.httpHeaders, params });
  }


  getEstructuraReport(codeReporte, data) {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.reportes}/estructuras/${codeReporte}/${data.date_month_year || data.date_year}`);
  }

  getPrestamosPagareById(id): Observable<any> {
    this.tokenvalido();
    return this.http
      .get(`${ApiUrl.reports}/credito/${id}/pagare/PDF`, {
        responseType: "blob",
      })
      .pipe(
        map((res) => {
          let url = URL.createObjectURL(res);
          return this.dom.bypassSecurityTrustUrl(url);
        })
      );
  }

  getAnexoReports(pagina?, size?, term?) {
    this.tokenvalido();
    let params = new HttpParams();
    params = term ? params.append("term", term) : params;
    return this.http.get(
      `${ApiUrl.reportes}/anexos?pageNumber=${pagina}&pageSize=${size}`,
      { headers: this.httpHeaders, params }
    );
  }

  getAnexosFile(codeReporte, formato, data,actualizar) {
    this.tokenvalido();
    let params = new HttpParams();
    params = params.append('actualizar',actualizar);
    return this.http.get(
      `${ApiUrl.reportes}/anexos/${codeReporte}/${
        data.date_month_year || data.date_year
      }/${formato}`, { headers: this.httpHeaders, params }
    );
  }

  //? TIPO DE ADJUNTO AL OBTENER
  //107 - creditos normales
  //108 - novacion

  postSolictudCredito(IdPrestamo) {
    this.tokenvalido();
    //enviar en el body idPrestamo , va a devolver un adjunto en base64
    return this.http
      .post(
        `${ApiUrl.reports}/SolicitudCredito/download/PDF`,
        {
          IdPrestamo,
        },
        { responseType: "blob" }
      )
      .pipe(
        map((res) => {
          if (res["type"] == "text/plain") {
            this.dataComponent.alerta(
              "info",
              "El participe es migrado, no tiene adjuntos"
            );
          }
          let url = URL.createObjectURL(res);
          return this.dom.bypassSecurityTrustUrl(url);
        })
      );
  }

  //reciv

  postSolicitudNovacion(IdPrestamo) {
    this.tokenvalido();
    return this.http
      .post(
        `${ApiUrl.reports}/SolicitudNovacion/download/PDF`,
        {
          IdPrestamo: IdPrestamo,
        },
        { responseType: "blob" }
      )
      .pipe(
        map((res) => {
          if (res["type"] == "text/plain") {
            this.dataComponent.alerta(
              "info",
              "El participe es migrado, no tiene adjuntos"
            );
          }
          let url = URL.createObjectURL(res);
          return this.dom.bypassSecurityTrustUrl(url);
        })
      );
  }

  getAdjuntoByIdAdjunto(idEntidad, idPrestamo, idTipoAdjunto = null) {
    this.tokenvalido();

    let params = new HttpParams();
    params = idTipoAdjunto
      ? params.append("idTipoAdjunto", idTipoAdjunto)
      : params;
    params = idPrestamo ? params.append("idPrestamo", idPrestamo) : params;
    return this.http.get(`${ApiUrl.adjuntos}/${idEntidad}/adjuntos`, {
      headers: this.httpHeaders,
      params,
    });
  }

  postAdjuntos(idEntidad, data) {
    this.tokenvalido();
    return this.http.post(`${ApiUrl.adjuntos}/${idEntidad}/adjuntos`, data);
  }
}
