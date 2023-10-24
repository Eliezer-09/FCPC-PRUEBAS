import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { NGXLogger } from "ngx-logger";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { NavigationService } from "src/@vex/services/navigation.service";
import { ComponentesService } from "src/app/services/componentes.service";
import { environment } from "src/environments/environment";
import moment from "moment";
import { JwtHelperService } from "@auth0/angular-jwt";
import { DataService } from "src/app/services/data.service";
import {
  ApiResponse,
  ApiResponseGeneric,
  OperationResult,
  Pagos,
} from "src/app/model/models";
import { ApiServiceUrl, ApiUrl } from "src/app/Shared/Routes/ApiServiceUrl";
import { LocalService } from "src/app/services/local.service";
import { Garante, GaranteCreditos } from "./model/models-creditos";

const helper = new JwtHelperService();

@Injectable({
  providedIn: "root",
})
export class CreditosService {
  date = moment().format();
  token: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dom: DomSanitizer,
    private dataComponent: ComponentesService,
    private navigationService: NavigationService,
    private ngZone: NgZone,
    private logger: NGXLogger,
    private dataService: DataService,
    private localServiceS: LocalService
  ) {
    this.token = this.localServiceS.getItem("token");
  }

  getFechaActual(formato) {
    const fecha = moment().format(formato);
    return fecha;
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

  // PRESTAMOS

  getPrestamosbyId(id): Observable<any> {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.Participe}/${id}/prestamos`);
  }

  getExcelConvenios(): Observable<any> {
    this.tokenvalido();
    return this.http
      .get(`${ApiUrl.Participe}/descargar/excel`, {
        responseType: "blob",
      })
      .pipe(
        map((res) => {
          let url = URL.createObjectURL(res);
          return this.dom.bypassSecurityTrustUrl(url);
        })
      );
  }

  // PRESTAMOS RELACIONADOS
  getPrestamosRelacionados(idPrestamo) {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.creditos}/${idPrestamo}/relacionados`);
  }

  getPrestamosByEstado(estado?, id?, pagina?, size?) {
    this.tokenvalido();
    let params = new HttpParams();
    if (pagina != undefined && size != undefined) {
      params = params.append("page", String(pagina));
      params = params.append("pageSize", String(size));
    }
    this.tokenvalido();

    if (estado && id) {
      return this.http.get(
        `${ApiUrl.creditos}/buscar/${estado}?idParticipe=${id}&page=${pagina}&pageSize=${size}`,
        { params }
      );
      //return this.http.get(`https://localhost:44358/prestamos/buscar/${estado}?idParticipe=${id}`, { headers: httpHeaders });
    } else {
      return this.http.get(
        `${ApiUrl.creditos}/buscar/${estado}?&page=${pagina}&pageSize=${size}`,
        { params }
      );
      // return this.http.get(`${ApiUrl.creditos}/buscar/${estado}`, { headers: httpHeaders });
      //return this.http.get(`https://localhost:44358/prestamos/buscar/${estado}`, { headers: httpHeaders });
    }
  }

  getTermPrestamoByEstado(estado?, term?, page?, size?) {
    let params = new HttpParams();
    // params = params.append('page', String(page));
    // params = params.append('size', String(size));
    params = params.append("term", term);
    return this.http.get(
      `${ApiUrl.creditos}/buscar/${estado}?term=${term}&page=${page}&pageSize=${size}`
    );
  }

  getAdjuntosByIdPrestamo(id, adjunto): Observable<any> {
    this.tokenvalido();
    return this.http
      .get(`${ApiUrl.creditos}/${id}/adjunto/${adjunto}`, {
        responseType: "blob",
      })
      .pipe(
        map((res) => {
          let url = URL.createObjectURL(res);
          return this.dom.bypassSecurityTrustUrl(url);
        })
      );
  }

  getAdjuntosByIdParticipe(id, adjunto): Observable<any> {
    this.tokenvalido();
    return this.http
      .get(`${ApiUrl.Participe}/${id}/adjunto/${adjunto}`, {
        responseType: "blob",
      })
      .pipe(
        map((res) => {
          let url = URL.createObjectURL(res);
          return this.dom.bypassSecurityTrustUrl(url);
        })
      );
  }

  getRolGarante(id): Observable<any> {
    this.tokenvalido();
    return this.http
      .get(`${ApiUrl.Participe}/${id}/adjunto/RolGarante`, {
        responseType: "blob",
      })
      .pipe(
        map((res) => {
          let url = URL.createObjectURL(res);
          return this.dom.bypassSecurityTrustUrl(url);
        })
      );
  }

  getRolGaranteInCredito(id): Observable<any> {
    this.tokenvalido();
    return this.http
      .get(`${ApiUrl.creditos}/${id}/adjunto/RolGarante`, {
        responseType: "blob",
      })
      .pipe(
        map((res) => {
          let url = URL.createObjectURL(res);
          return this.dom.bypassSecurityTrustUrl(url);
        })
      );
  }

  getPrestamoById(id) {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.creditos}/${id}`);
  }

  getPrestamoAutorizacionDebitoById(id) {
    this.tokenvalido();

    return this.http
      .get(`${ApiUrl.creditos}/${id}/autorizacion-debito`, {
        responseType: "blob",
      })
      .pipe(
        map((res) => {
          let url = URL.createObjectURL(res);
          return this.dom.bypassSecurityTrustUrl(url);
        })
      );
  }

  getTablaInformativaCostos(id: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      responseType: "json" as "json", // for receiving as json
    };

    return this.http
      .post(
        `${ApiUrl.reports}/TablaInformativa/PDF?disposition=HORIZONTAL`,
        { IdPrestamo: id },
        httpOptions
      )
      .pipe(
        map((response: any) => {
          const decodedData = atob(response.content);
          const bytes = new Uint8Array(decodedData.length);
          for (let i = 0; i < decodedData.length; ++i) {
            bytes[i] = decodedData.charCodeAt(i);
          }
          const blob = new Blob([bytes.buffer], { type: "application/pdf" });
          return blob;
        })
      );
  }

  getResumenCreditoById(id) {
    this.tokenvalido();

    return this.http
      .get(`${ApiUrl.creditos}/${id}/resumen-credito`, { responseType: "blob" })
      .pipe(
        map((res) => {
          let url = URL.createObjectURL(res);
          return this.dom.bypassSecurityTrustUrl(url);
        })
      );
  }

  getPagosIndividualesById(id) {
    this.tokenvalido();
    return this.http
      .get(`${ApiUrl.creditos}/${id}/pagos-individuales`, {
        responseType: "blob",
      })
      .pipe(
        map((res) => {
          let url = URL.createObjectURL(res);
          return this.dom.bypassSecurityTrustUrl(url);
        })
      );
  }

  getPrestamoByIdPrestamo(idPrestamo) {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.creditos}/${idPrestamo}`);
  }

  getPagare(id) {
    this.tokenvalido();
    return this.http
      .get(`${ApiUrl.creditos}/${id}/pagare`, { responseType: "blob" })
      .pipe(
        map((res) => {
          let url = URL.createObjectURL(res);
          return this.dom.bypassSecurityTrustUrl(url);
        })
      );
  }

  getTablaCostos(id) {
    this.tokenvalido();
    return this.http
      .get(`${ApiUrl.creditos}/${id}/pagare`, { responseType: "blob" })
      .pipe(
        map((res) => {
          let url = URL.createObjectURL(res);
          return this.dom.bypassSecurityTrustUrl(url);
        })
      );
  }

  postRechazarFirma(idPrestamo, comentario, funcionario, fecha?) {
    const data = {
      comentarios: comentario || "N/A",
      funcionario: funcionario,
      fecha: this.date,
    };
    return this.http.post(
      `${ApiUrl.creditos}/${idPrestamo}/rechazar-firma`,
      data
    );
  }

  postAnularPrestamo(idPrestamo, comentario, funcionario, fecha?) {
    if (comentario == "") {
      const data = {
        comentarios: "N/A",
        funcionario: funcionario,
        fecha: this.date,
      };
      return this.http.post(`${ApiUrl.creditos}/${idPrestamo}/anular`, data);
    } else {
      const data = {
        comentarios: comentario,
        funcionario: funcionario,
        fecha: this.date,
      };
      return this.http.post(`${ApiUrl.creditos}/${idPrestamo}/anular`, data);
    }
  }

  postPrestamoPagare(id, data) {
    this.tokenvalido();
    return this.http.post(`${ApiUrl.creditos}/${id}/legalizar`, data);
  }

  postPrestamoAdjuntos(id, adjunto) {
    this.logger.log(id);
    this.tokenvalido();
    return this.http.post(`${ApiUrl.creditos}/${id}/adjunto`, adjunto, {});
  }

  postAprobarPrestamo(idPrestamo, comentario, funcionario, fecha?) {
    this.tokenvalido();
    if (comentario == "") {
      const data = {
        comentarios: "N/A",
        funcionario: funcionario,
        fecha: this.date,
      };

      return this.http.post(
        `${ApiUrl.creditos}/${idPrestamo}/aprobacion`,
        data
      );
    } else {
      const data = {
        comentarios: comentario,
        funcionario: funcionario,
        fecha: this.date,
      };

      return this.http.post(
        `${ApiUrl.creditos}/${idPrestamo}/aprobacion`,
        data
      );
    }
  }

  postRechazarPrestamo(idPrestamo, comentario, funcionario, fecha?) {
    if (comentario == "") {
      const data = {
        comentarios: "N/A",
        funcionario: funcionario,
        fecha: this.date,
      };
      return this.http.post(`${ApiUrl.creditos}/${idPrestamo}/rechazo`, data);
    } else {
      const data = {
        comentarios: comentario,
        funcionario: funcionario,
        fecha: this.date,
      };
      return this.http.post(`${ApiUrl.creditos}/${idPrestamo}/rechazo`, data);
    }
  }

  postAcreditar(id, data) {
    this.tokenvalido();
    return this.http.post(`${ApiUrl.creditos}/${id}/acreditar`, data);
  }

  // REFERENCIA BANCARIA

  postReferenciaBancaria(id, adjunto) {
    this.tokenvalido();
    return this.http.post(
      `${ApiUrl.Participe}/referencia-bancaria/${id}/adjunto`,
      adjunto,
      {}
    );
  }

  getReferenciaBancaria(id) {
    this.tokenvalido();
    return this.http
      .get(`${ApiUrl.Participe}/referencia-bancaria/${id}/adjunto`, {
        responseType: "blob",
      })
      .pipe(
        map((res) => {
          let url = URL.createObjectURL(res);
          return this.dom.bypassSecurityTrustUrl(url);
        })
      );
  }

  postPrestamo(data) {
    this.tokenvalido();
    return this.http.post(`${ApiUrl.creditos}/solicitud`, data);
  }

  postPrestamoNovacion(data) {
    this.tokenvalido();
    return this.http.post(`${ApiUrl.creditos}/novacion`, data);
  }

  //BASIC
  getBasic() {
    return this.localServiceS.getItem("basic");
  }

  postSimulacionRestructuracion(data) {
    this.tokenvalido();
    return this.http.post(
      `${ApiUrl.creditos}/simulacion/restructuracion`,
      data
    );
  }

  postSimulacionRefinanciamiento(data) {
    this.tokenvalido();
    return this.http.post(
      `${ApiUrl.creditos}/simulacion/refinanciamiento`,
      data
    );
  }

  postSimulacionCreditos(tipoCredito,data) {
    this.tokenvalido();
    return this.http.post(
      `${ApiUrl.creditos}/simulacion/${tipoCredito}`,
      data
    );
  }

  postPrestamoRestructuracion(data) {
    this.tokenvalido();
    return this.http.post(`${ApiUrl.creditos}/restructuracion`, data);
  }

  postPrestamoRefinanciamiento(data) {
    this.tokenvalido();
    return this.http.post(`${ApiUrl.creditos}/refinanciamiento`, data);
  }

  getPrestamoByIdParticipe(idParticipe) {
    var url = `${ApiUrl.creditos}/buscar/transferido`;
    this.tokenvalido();
    return this.http.request("GET", url, {
      params: {
        idParticipe: `${idParticipe}`,
        page: "1",
      },
      responseType: "json",
    });
  }

  getPrestamoSimulacion(idParticipe,tipoSolicitud) {
    this.tokenvalido();
    let params = new HttpParams();
    params = params.append("tipoSolicitud", tipoSolicitud);
    return this.http.get(
      `${ApiUrl.creditos}/buscar-credito/${idParticipe}`, { params }
    );
  }

  getPrestamoVencidoByIdParticipe(idParticipe) {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.creditos}/buscar/vencidos?idParticipe=${idParticipe}`
    );
  }

  // NOVACION
  postSimulacionNovacion(data) {
    this.tokenvalido();

    return this.http.post(`${ApiUrl.creditos}/simulacion/novacion`, data);
  }

  // CARGAR EXCEL AUTORIZADOS
  postCargarExcelAutorizados(data: File, anio, mes): Observable<any> {
    const fd = new FormData();
    fd.append("archivo", data);
    this.tokenvalido();
    return this.http.post(
      `${ApiUrl.creditos}/cargar-autorizados?anio=${anio}&mes=${mes}`,
      fd
    );
    //return this.http.post(`https://localhost:44358/prestamos/cargar-autorizados?anio=${anio}&mes=${mes}`, fd);
  }

  getDescargarAportesMensuales() {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.Participe}/aportes/mensuales/Excel`, {
      responseType: "blob",
    }); /* .pipe(
      map((res) => {
        let url = URL.createObjectURL(res);
        return this.dom.bypassSecurityTrustUrl(url);
      })
    ) */
  }

  //GUARDAR LOS AUTORIZADOS
  postGuardarAutorizados(data) {
    this.tokenvalido();
    return this.http.post(`${ApiUrl.creditos}/guardar-autorizados`, data);
  }

  //CARGAR EXCEL DE APORTES
  postCargarExcelAportes(data: File, anio, mes): Observable<any> {
    const fd = new FormData();
    fd.append("archivo", data);
    this.tokenvalido();
    return this.http.post(
      `${ApiUrl.Participe}/aportes/cargar?anio=${anio}&mes=${mes}`,
      fd
    );
    //return this.http.post(`https://localhost:44358/aportes/cargar?anio=${anio}&mes=${mes}`, fd);
  }

  //GUARDAR INFORMACION CARGADA
  postGuardarAportes(info, date) {
    this.tokenvalido();
    const data = {
      fecha: date,
      detalles: info,
    };
    //return this.http.post(`https://localhost:44358/aportes/guardar?anio=${anio}&mes=${mes}`, data);
    return this.http.post(
      `${ApiUrl.Participe}/aportes/guardar`,
      data
    );
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

  getInfoAutorizados(anio, mes) {
    this.tokenvalido();
    return this.http.get(
      `${ApiUrl.creditos}/descuentos-autorizados?anio=${anio}&mes=${mes}`,
      { responseType: "blob" }
    );
  }

  // CARGAR EXCEL DE DESCUENTOS
  postCargarExcelDescuentos(data: File): Observable<any> {
    const fd = new FormData();
    fd.append("archivo", data);
    this.tokenvalido();
    return this.http.post(`${ApiUrl.creditos}/cargar-abonos`, fd);
  }

  // GUARDAR DESCUENTOS
  postGuardarDescuentos(data) {
    this.tokenvalido();
    return this.http.post(`${ApiUrl.creditos}/guardar-abonos`, data);
  }

  // SIMULACION
  getSimulacion(id) {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.creditos}/${id}/simulacion`);
  }
  // SIMULACION
  postSimulacion(data) {
    this.tokenvalido();
    return this.http.post(`${ApiUrl.creditos}/simulacion`, data);
  }

  // GET TABLA AMORTIZACION
  getTablaAmortizacion(id) {
    this.tokenvalido();
    return this.http
      .get(`${ApiUrl.creditos}/${id}/tabla-amortizacion`, {
        responseType: "blob",
      })
      .pipe(
        map((res) => {
          let url = URL.createObjectURL(res);
          return this.dom.bypassSecurityTrustUrl(url);
        })
      );
  }

  // DESCARGAR HISTORICO
  getHistorico(id) {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.creditos}/simulacion`);
  }

  // ACTUALIZAR APORTE ADICIONAL
  aporteAdicionalSolicitud(idParticipe, data) {
    this.tokenvalido();
    return this.http.post(
      `${ApiUrl.Participe}/${idParticipe}/aporte-adicional`,
      data
    );
  }

  // ARCHIVO DE APORTE
  getArchivoAporte(idParticipe, monto) {
    return this.http
      .get(
        `${ApiUrl.Participe}/${idParticipe}/aporte-adicional/solicitud?monto=${monto}`,
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

  archivoPrestamo(id, archivos) {
    this.tokenvalido();
    return this.http.post(`${ApiUrl.creditos}/${id}/adjunto`, archivos);
  }

  getComentarios(idPrestamo) {
    return this.http.get(`${ApiUrl.creditos}/${idPrestamo}/comentario`);
  }

  postComentario(idPrestamo, data) {
    this.tokenvalido();
    this.getToken();
    let params = new HttpParams();
    params = params.append("idComentario", data.idComentario);
    return this.http.post(`${ApiUrl.creditos}/${idPrestamo}/comentario`, data);
  }

  getToken() {
    const data = this.localServiceS.getItem("token");
    return data;
  }

  getParticipePrestamosById(id) {
    this.tokenvalido();
    const token = this.getToken();
    return this.http.get(`${ApiUrl.Participe}/${id}/prestamos`, {});
  }

  getProveedorById(id) {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.Participe}/proveedor/${id}`, {});
  }

  getPagoProveedor(idPrestamo) {
    this.tokenvalido();
    return this.http
      .get(`${ApiUrl.creditos}/${idPrestamo}/autorizacion-proveedor`, {
        responseType: "blob",
      })
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

  getPagoByIdPrestamo(id) {
    this.tokenvalido();
    return this.http.get<OperationResult>(`${ApiUrl.creditos}/${id}/pagos`);
  }

  getPrestamosGarantesByIdParticipe(id) {
    this.tokenvalido();
    return this.http.get<OperationResult>(
      `${ApiUrl.Participe}/${id}/garantes`,
      {}
    );
  }

  getPrestamosGarantizadosByIdParticipe(id) {
    this.tokenvalido();
    return this.http.get<OperationResult>(
      `${ApiUrl.Participe}/${id}/garantizados`,
      {}
    );
  }

  getCuentasBancarias() {
    this.tokenvalido();
    return this.http.get<OperationResult>(
      `${ApiUrl.Participe}/cuentabancaria`,
      {}
    );
  }

  getTablaComparativaByIdPrestamo(idPrestamo, formato) {
    this.tokenvalido();

    return this.http.get(
      `${ApiUrl.creditos}/${idPrestamo}/tabla-comparativa/${formato}`,
      { responseType: "blob" }
    );
  }

  // ACTUALIZAR TABLA DE AMORTIZACIÓN
  postActualizarTablaAmortizacion(id) {
    this.tokenvalido();

    return this.http.post(
      `${ApiUrl.creditos}/${id}/tabla-amortizacion/actualizar`,
      {}
    );
  }

  // PAGOS INDIVIDUALES
  postSimularAbono(data) {
    this.tokenvalido();
    return this.http.post(`${ApiUrl.creditos}/simular-abonos`, data);
  }

  postGuardarAbono(data) {
    this.tokenvalido();
    return this.http.post(`${ApiUrl.creditos}/guardar-pagos-individuales`, data);
  }

  //METODOS DE PAGOS
  getMetodosPagos() {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.catalogos}/metodos-pago`, {});
  }

  //TIPOS DE PAGO
  getTiposPago() {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.catalogos}/tipos-pago`, {});
  }

  //CARGAR EXCEL DE ROLES
  postCargarExcelRoles(data: File): Observable<any> {
    const fd = new FormData();
    fd.append("archivo", data);
    this.tokenvalido();
    return this.http.post(`${ApiUrl.creditos}/cargar-roles`, fd);
  }

  //GUARDAR INFORMACION CARGADA ROLES
  postGuardarRoles(fecha, aporte) {
    this.tokenvalido();
    const data = {
      fecha: fecha,
      roles: aporte,
    };
    return this.http.post(`${ApiUrl.creditos}/guardar-roles`, data);
  }

  getNewPagosIndividualesByPrestamo(
    idPrestamo
  ): Observable<ApiResponseGeneric<Pagos>> {
    this.tokenvalido();
    return this.http.get<ApiResponseGeneric<Pagos>>(
      `${ApiUrl.creditos}/${idPrestamo}/pagos-individuales/prestamo`,
      {}
    );
  }

  newGarantesByPrestamo(idPrestamo): Observable<ApiResponseGeneric<Garante[]>> {
    this.tokenvalido();
    return this.http.get<ApiResponseGeneric<Garante[]>>(
      `${ApiUrl.creditos}/garante/${idPrestamo}/garantes-prestamo`,
      {}
    );
  }

  canGaranteByPrestamo(identificacion,monto): Observable<ApiResponseGeneric<GaranteCreditos[]>> {
    this.tokenvalido();
    let params = new HttpParams();
    params = params.append("monto", monto);
 
    return this.http.get<ApiResponseGeneric<GaranteCreditos[]>>(
      `${ApiUrl.creditos}/garante/${identificacion}/garantes`,{ params }
    );
  }

  validarPesoArchivo(archivo) {
    let pesoArchivo = archivo.size;
    let pesoArchivoMB = pesoArchivo / 1000000;
    if (pesoArchivoMB > 10) {
      this.dataComponent.alerta("error", "El archivo no debe pesar más de 10MB");
      return false;
    }
    return true;
  }
}
