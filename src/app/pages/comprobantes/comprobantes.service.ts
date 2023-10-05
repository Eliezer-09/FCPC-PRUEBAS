import { Injectable, NgZone } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { NavigationService } from "src/@vex/services/navigation.service";
import { Parentesco } from "src/app/pages/participes/models/cesante-catalogo.interface";

import { ApiUrl } from "src/app/Shared/Routes/ApiServiceUrl";
import { TreeNode } from "primeng/api";
import { ApiResponse } from "../colaboradores/models/colaboradores";
import Swal from "sweetalert2";
import { UtilsService } from "../colaboradores/utils/utils.service";
import { LocalService } from "src/app/services/local.service";

const helper = new JwtHelperService();

@Injectable({
  providedIn: "root",
})
export class ComprobanteService {
  catalogoUrl = ApiUrl.catalogos;

  nominaUrl = ApiUrl.nominaUrl;
  token: string;
  httpHeaders: { "Content-Type": string; Authorization: string };

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone,
    private navigationService: NavigationService,
    private utilsService: UtilsService,
    private localServiceS: LocalService
  ) {
    this.token =
      this.localServiceS.getItem("token") || window.navigator.appVersion;
    this.httpHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
    };
  }

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

  getComprobantesByTermino(filters, page?, size?) {
    let params = new HttpParams();
    params = filters.term ? params.append("term", filters.term) : params;
    params = filters.tipoComprobante
      ? params.append("tipoComprobante", filters.tipoComprobante)
      : params;

    params = filters.tipoEmision
      ? params.append("tipoEmision", filters.tipoEmision)
      : params;

    params = filters.estado ? params.append("estado", filters.estado) : params;

    params = filters.desde ? params.append("desde", filters.desde) : params;
    params = filters.hasta ? params.append("hasta", filters.hasta) : params;
    let url = `${ApiUrl.comprobantes}/consultar?page=${page}&size=${size}`;
    return this.http.get<ApiResponse>(url, { params });
  }

  rutaComprobante(id, correo) {
    let url = `${ApiUrl.comprobantes}/${id}/enviar-email`;
    return this.http.post(url, { correo });
  }

  enviarComprobante(correo, id) {
    Swal.fire({
      title: "Enviar comprobante",
      text: "Ingrese el correo electrónico",
      input: "email",
      inputAttributes: {
        autocapitalize: "off",
      },
      inputValue: correo,
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,

      preConfirm: (email) => {
        Swal.getCancelButton().setAttribute("hidden", "true");
        return this.rutaComprobante(id, email)
          .toPromise()
          .then((res) => {
            if (!res["success"]) {
              throw new Error(res["message"]);
            }
            return res["message"];
          })
          .catch((error) => {
            this.utilsService.alerta(
              "error",
              "Hubo un error al enviar el correo"
            );
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        this.utilsService.alerta("success", "Correo enviado con éxito");
      }
    });
  }
}
