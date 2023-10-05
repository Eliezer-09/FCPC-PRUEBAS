import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpParams } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { NavigationService } from "src/@vex/services/navigation.service";
import { SimulacionInversion, Vector } from "src/app/model/models";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DomSanitizer } from "@angular/platform-browser";
import { ApiServiceUrl, ApiUrl } from "src/app/Shared/Routes/ApiServiceUrl";
import { environment } from "src/environments/environment";
import { LocalService } from "src/app/services/local.service";

const helper = new JwtHelperService();

@Injectable({
  providedIn: "root",
})
export class ContabilidadService {
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

  //TODO: ASIENTOS CONTABLES

  getAsientosContablesByTerm(estado, pagina?, size?, termino?, filters?) {
    this.tokenvalido();
    let params = new HttpParams();
    params = params.append("estado", estado);
    if (pagina != undefined && size != undefined) {
      params = params.append("page", String(pagina));
      params = params.append("pageSize", String(size));
      params = params.append("term", termino);
    }
    if (filters != undefined) {
      params = filters.desde ? params.append("desde", filters.desde) : params;
      params = filters.hasta ? params.append("hasta", filters.hasta) : params;
    }

    return this.http.get(`${ApiUrl.Contabilidad}/asiento-contable/buscar`, {
      headers: this.httpHeaders,
      params,
    });
  }

  getAsientosContableById(idAsientoContable) {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.Contabilidad}/asiento-contable/${idAsientoContable}`,
      {
        headers: this.httpHeaders,
      }
    );
  }

  postAgregarAsientosContable(data) {
    this.tokenvalido();
    return this.http.post(
      `${ApiUrl.Contabilidad}/asiento-contable/crear`,
      data,
      {
        headers: this.httpHeaders,
      }
    );
  }

  putActualizarAsientosContable(idAsientoContable, data) {
    this.tokenvalido();
    return this.http.put(
      `${ApiUrl.Contabilidad}/asiento-contable/${idAsientoContable}`,
      data,
      {
        headers: this.httpHeaders,
      }
    );
  }

  deleteAsientosContable(idAsientoContable) {
    this.tokenvalido();
    return this.http.delete(
      `${ApiUrl.Contabilidad}/asiento-contable/${idAsientoContable}`,
      {
        headers: this.httpHeaders,
      }
    );
  }

  //TODO: DETALE ASIENTOS CONTABLES
  getDetalleAsiento(idAsientoContable, pagina?, size?) {
    this.tokenvalido();
    let params = new HttpParams();
    if (pagina != undefined && size != undefined) {
      params = params.append("page", String(pagina));
      params = params.append("pageSize", String(size));
    }
    return this.http.get(
      `${ApiUrl.Contabilidad}/asiento-contable/${idAsientoContable}/detalle`,
      {
        headers: this.httpHeaders,
        params,
      }
    );
  }

  putDetalleAsientosContable(idDetalleAsientoContable, data) {
    this.tokenvalido();
    return this.http.put(
      `${ApiUrl.Contabilidad}/asiento-contable/detalle/${idDetalleAsientoContable}`,
      data,
      {
        headers: this.httpHeaders,
      }
    );
  }

  postDetalleAsientosContable(idAsientoContable, data) {
    this.tokenvalido();
    return this.http.post(
      `${ApiUrl.Contabilidad}/asiento-contable/${idAsientoContable}/detalle/crear`,
      data,
      {
        headers: this.httpHeaders,
      }
    );
  }

  deleteDetalleAsientosContable(idDetalleAsientoContable) {
    this.tokenvalido();
    return this.http.delete(
      `${ApiUrl.Contabilidad}/asiento-contable/detalle/${idDetalleAsientoContable}`,
      {
        headers: this.httpHeaders,
      }
    );
  }

  //TODO: AUXILIAR
  getAuxiliarVistas() {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.Contabilidad}/auxiliar/vistas`, {
      headers: this.httpHeaders,
    });
  }

  getAuxiliarByTerm(idVista, pagina?, size?, termino?) {
    this.tokenvalido();
    let params = new HttpParams();
    params = termino ? params.append("term", termino) : params;
    params = pagina ? params.append("page", String(pagina)) : params;
    params = size ? params.append("pageSize", String(size)) : params;
    return this.http.get(`${ApiUrl.Contabilidad}/auxiliar/buscar/${idVista}`, {
      headers: this.httpHeaders,
      params,
    });
  }

  //TODO: TIPO ASIENTO

  getTipoAsientoByTerm(termino?) {
    this.tokenvalido();
    let params = new HttpParams();
    params = termino ? params.append("term", termino) : params;
    return this.http.get(`${ApiUrl.Contabilidad}/tipo-asiento/buscar`, {
      headers: this.httpHeaders,
      params,
    });
  }

  //TODO: TRANSACCION

  getTransccacionByTerm(termino?) {
    this.tokenvalido();
    let params = new HttpParams();
    params = termino ? params.append("term", termino) : params;
    return this.http.get(`${ApiUrl.Contabilidad}/tipo-transaccion/buscar`, {
      headers: this.httpHeaders,
      params,
    });
  }

  //TODO: CUENTAS

  getCuentasContables(pagina?, size?, termino?) {
    this.tokenvalido();
    let params = new HttpParams();
    params = pagina ? params.append("page", String(pagina)) : params;
    params = size ? params.append("pageSize", String(size)) : params;
    params = termino ? params.append("term", termino) : params;

    return this.http.get(`${ApiUrl.Contabilidad}/cuenta-contable/buscar`, {
      headers: this.httpHeaders,
      params,
    });
  }

  getCuentasContablesTree(actualizar) {
    this.tokenvalido();
    let params = new HttpParams();
    params =params.append("actualizar", actualizar);
    return this.http.get(`${ApiUrl.Contabilidad}/cuenta-contable/arbol`, {
      headers: this.httpHeaders,
      params
    });
  }

  postCuentasContables(data) {
    this.tokenvalido();
    return this.http.post(`${ApiUrl.Contabilidad}/cuenta-contable/crear`, data, {
      headers: this.httpHeaders,
    });
  }

  getTipoCuentasContables(pagina?, size?, termino?) {
    this.tokenvalido();
    let params = new HttpParams();
      params = pagina?params.append("page", String(pagina)):params;
      params = size?params.append("pageSize", String(size)):params;
      params = termino?params.append("term", termino):params;

    return this.http.get(`${ApiUrl.Contabilidad}/cuenta-contable/tipo-cuenta/buscar`, {
      headers: this.httpHeaders,
      params,
    });
  }

  getCuentasContableById(idCuentaContable) {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.Contabilidad}/cuenta-contable/${idCuentaContable}`, {
      headers: this.httpHeaders
    });
  }


  putCuentasContable(data) {
    console.log(data)
    let idCuentaContable=data.idCuentaContable
    this.tokenvalido();
    return this.http.put(`${ApiUrl.Contabilidad}/cuenta-contable/${idCuentaContable}`, data, {
      headers: this.httpHeaders,
    });
  }

  deleteCuentasContable(idCuentaContable) {
    this.tokenvalido();
    return this.http.delete(`${ApiUrl.Contabilidad}/cuenta-contable/${idCuentaContable}`, {
      headers: this.httpHeaders,
    });
  }



  //TODO:RegimenTributario

  getRegimenTributario(pagina?, size?, termino?) {
    this.tokenvalido();
    let params = new HttpParams();
      params = pagina?params.append("page", String(pagina)):params;
      params = size?params.append("pageSize", String(size)):params;
      params = termino?params.append("term", termino):params;

    return this.http.get(`${ApiUrl.Contabilidad}/regimen-tributario/buscar`, {
      headers: this.httpHeaders,
      params,
    });
  }
}
