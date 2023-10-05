import { DomSanitizer } from "@angular/platform-browser";
import {
  EventEmitter,
  Injectable,
  NgZone,
  OnInit,
  Output,
} from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";
import { map, tap } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable, Subject } from "rxjs";
import { Plugins } from "@capacitor/core";
import { id } from "date-fns/locale";
import moment from "moment";
import { ComponentesService } from "./componentes.service";
import {
  NavigationDropdown,
  NavigationItem,
  NavigationLink,
  NavigationSubheading,
} from "src/@vex/interfaces/navigation-item.interface";

// ICONOS
import icArchive from "@iconify/icons-ic/archive";
import icBusiness from "@iconify/icons-ic/business";
import icMoney from "@iconify/icons-ic/round-money";
import icCreditCard from "@iconify/icons-ic/credit-card";
import icPerson from "@iconify/icons-ic/person";
import icPeople from "@iconify/icons-ic/people";

import icDashboard from "@iconify/icons-ic/dashboard";
import icTicket from "@iconify/icons-ic/local-play";
import icAccountBalance from "@iconify/icons-ic/account-balance";
import icReport from "@iconify/icons-ic/assignment";
import icDollar from "@iconify/icons-ic/attach-money";
import icTable from "@iconify/icons-ic/developer-board";

const { Filesystem, Storage } = Plugins;
const helper = new JwtHelperService();
import { NavigationService } from "src/@vex/services/navigation.service";
import { Console } from "console";
import { NGXLogger } from "ngx-logger";
import {
  MetodoPago,
  Paises,
} from "../pages/participes/models/cesante-catalogo.interface";
import { ApiResponse, MiembrosCesantia } from "../model/models";
import { ApiServiceUrl, ApiUrl } from "../Shared/Routes/ApiServiceUrl";
import { LocalService } from "./local.service";
import { ReferenciaBancaria } from "../pages/colaboradores/models/colaboradores";

@Injectable({
  providedIn: "root",
})
export class DataService implements OnInit {
  @Output() aClickedEvent = new EventEmitter<string>();

  apiUrl = environment.serviceUrl;

  date = moment().format();
  nominaUrl = ApiUrl.nominaUrl;
  catalogoUrl = ApiUrl.catalogos;
  adjuntosUrl = ApiUrl.adjuntos;

  public videos = [];
  private VIDEOS_KEY: string = "videos";

  accesos = [];
  token: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dom: DomSanitizer,
    private dataComponent: ComponentesService,
    private navigationService: NavigationService,
    private ngZone: NgZone,
    private logger: NGXLogger,
    private localServiceS: LocalService
  ) {
    this.token = this.localServiceS.getItem("token");

  }

  AClicked(msg: any) {
    this.aClickedEvent.emit(msg);
  }

  getFechaActual(formato) {
    const fecha = moment().format(formato);
    return fecha;
  }

  getMetodosPago(): Observable<MetodoPago[]> {
    return this.http
      .get(`${ApiUrl.catalogos}/metodos-pago`)
      .pipe(map((response: any) => response as MetodoPago[]));
  }

  getFecha(fecha, formato) {
    const date = moment(fecha).format(formato);
    return date;
  }

  ngOnInit() {}

  items: NavigationItem[] = [];

  private _openChangeSubject = new Subject<NavigationDropdown>();
  openChange$ = this._openChangeSubject.asObservable();

  getParticipeById(id, idPrestamo?) {
    let params = new HttpParams();
    params = idPrestamo ? params.append("idPrestamo", idPrestamo) : params;
    return this.http.get(`${ApiUrl.Participe}/${id}/participe`, {
      params: params,
    });
  }

  getContratoById(id) {
    return this.http.get(
      `${ApiUrl.reports}/participe/${id}/contrato-adhesion/pdf`
    );
  }

  getConvenios(id) {
    return this.http.get(`${ApiUrl.Participe}/anuncio/convenios`);
  }

  getContratoAdjuntoTemp() {
    return this.http.get(
      `${ApiUrl.reports}/participe/${id}/contrato-adhesion/pdf`
    );
  }

  getParticipeByIdentificacion(id, full?) {
    let params = new HttpParams();
    if (full) {
      params = params.append("full", full);
      return this.http.get(`${ApiUrl.Participe}/identificacion/${id}`, {
        params: params,
      });
    } else {
      return this.http.get(`${ApiUrl.Participe}/identificacion/${id}`);
    }
  }

  getParticipeByToken(token) {
    return this.http.get(`${ApiUrl.Participe}/token/${token}`).pipe(
      map((res) => {
        return res["result"];
      })
    );
  }

  getTipoDireccion() {
    return this.http.get(`${ApiUrl.catalogos}/tipo-direccion`);
  }

  getAportesbyId(id) {
    const token = this.getToken();

    return this.http.get(`${ApiUrl.Participe}/${id}/aportes`, {});
  }

  getRiesgosParticipebyId(id) {
    const token = this.getToken();

    return this.http.get(`${ApiUrl.Participe}/${id}/riesgo`, {});
  }

  getParticipeComentario(id) {
    const token = this.getToken();

    return this.http.get(`${ApiUrl.Participe}/${id}/comentario`, {});
  }

  // ARCHIVO ADJUNTO
  getCuentaIndividual(id) {
    const token = this.getToken();
    return this.http.get(`${ApiUrl.Participe}/${id}/cuenta-individual`, {
      responseType: "blob",
    });
  }

  postParticipeAdjunto(id, adjunto) {
    adjunto.idPersona = id;
    adjunto.idEntidad = id;

    return this.http.post(`${ApiUrl.Participe}/${id}/adjunto`, adjunto, {});
  }

  postParticipeComentario(id, data) {
    return this.http.post(`${ApiUrl.Participe}/${id}/comentario`, data, {});
  }

  actualizarParticipeDatos(id, participe) {
    return this.http.put(
      `${ApiUrl.Participe}/${id}/actualizar-datos`,
      participe,
      {}
    );
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  getBlobFromBase64(file, type): Blob {
    const byteCharacters = atob(file);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: type });
    return blob;
  }

/*   // ARCHIVO ADJUNTO
  getParticipeAdjunto(id, tipo) {
    return this.http
      .get(`${ApiUrl.Participe}/${id}/adjunto/${tipo}`, {
        responseType: "blob",
      })
      .pipe(
        map((res) => {
          this.logger.log("VIDEO", res);
          if (res["type"] == "text/plain") {
            this.dataComponent.alerta(
              "info",
              "El participe es migrado, no tiene adjuntos"
            );
          }
          if (res["type"] == "text/gif") {
            this.dataComponent.alerta(
              "info",
              "El participe es migrado, no tiene adjuntos"
            );
          }
          if (res["type"] == "application/pdf") {
            //this.dataComponent.alerta("info", "el rol de pago es pdf")
          }

          if (tipo == "CedulaPosterior" || tipo == "CedulaFrontal") {
            this.localServiceS.setItem("cedula", "1");
          }
          let url = URL.createObjectURL(res);
          return this.dom.bypassSecurityTrustUrl(url);
        })
      );
  }
 */
  archivoParticipe(id?, archivos?) {
    return this.http.get(`${ApiUrl.Participe}/${id}/adjunto`, archivos);
  }

  archivoPrestamo(id, archivos) {
    return this.http.post(`${ApiUrl.creditos}/${id}/adjunto`, archivos);
  }

  getInstitucionesFinacierasById(id) {
    return this.http.get(`${ApiUrl.catalogos}/instituciones-financieras/${id}`);
  }

  getTipoCuenta(id) {
    return this.http.get(`${ApiUrl.catalogos}/tipos-cuenta/${id}`);
  }

  // CATALOGO
  getTiposIdentificaciones(term?) {
    let params = new HttpParams();
    params = term ? params.append("term", term) : params;
    return this.http.get(`${ApiUrl.catalogos}/tipos-identificacion`, {
      params: params,
    });
  }

  getTiposGenero() {
    return this.http.get(`${ApiUrl.catalogos}/genero`);
  }

  getEstadosCivil() {
    return this.http.get(`${ApiUrl.catalogos}/estado-civil`);
  }

  getNacionalidades() {
    return this.http.get(`${ApiUrl.catalogos}/nacionalidades`);
  }

  getPaises() {
    return this.http.get(`${ApiUrl.catalogos}/paises`);
  }

  getPaisById(idPais) {
    return this.http.get(`${ApiUrl.catalogos}/pais/${idPais}`);
  }

  getProvincias(idPais) {
    return this.http.get(`${ApiUrl.catalogos}/pais/${idPais}/provincias`);
  }

  getCiudades(idProvincia) {
    return this.http.get(
      `${ApiUrl.catalogos}/provincia/${idProvincia}/ciudades`
    );
  }

  getParroquias(idCuidad) {
    return this.http.get(`${ApiUrl.catalogos}/ciudad/${idCuidad}/parroquias`);
  }

  getNivelEstudio() {
    return this.http.get(`${ApiUrl.catalogos}/nivel-estudios`);
  }

  getNivelIngreso() {
    return this.http.get(`${ApiUrl.catalogos}/nivel-ingresos`);
  }

  getProfesiones() {
    return this.http.get(`${ApiUrl.catalogos}/profesiones`);
  }

  getProductoFinanciero() {
    return this.http.get(`${ApiUrl.catalogos}/productos-financieros`);
  }

  getGrado() {
    return this.http.get(`${ApiUrl.catalogos}/grados-cte`);
  }

  getInstitucionesFinancieras() {
    return this.http.get(`${ApiUrl.catalogos}/instituciones-financieras`);
  }

  getTipsoCuentas() {
    return this.http.get(`${ApiUrl.catalogos}/tipos-cuenta`);
  }

  getProductosFinancieros() {
    return this.http.get(`${ApiUrl.catalogos}/productos-financieros`);
  }

  // REFERENCIA BANCARIA

  postReferenciaBancaria(id, adjunto) {
    return this.http.post(
      `${ApiUrl.Participe}/referencia-bancaria/${id}/adjunto`,
      adjunto,
      {}
    );
  }

  getReferenciaBancaria(id) {
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

  getReferenciasBancarias(idParticipe) {
    return this.http.get(
      `${ApiUrl.Participe}/referencia-bancaria/${idParticipe}/referencias`
    );
  }

  //BASIC
  getBasic() {
    return localStorage.getItem("basic");
  }

  //DEPARTAMENTOS
  getDepartamentos() {
    return this.http.get(`${ApiUrl.catalogos}/departamentos`);
  }

  getEmpleadosByDepartamento(idDepartamento) {
    return this.http.get(
      `${ApiUrl.catalogos}/departamentos/${idDepartamento}/empleados`
    );
  }

  getEmpleadosByArea(idArea) {
    return this.http.get(`${ApiUrl.catalogos}/area/${idArea}/empleados`);
  }

  getEmpleadosCesantia(): Observable<MiembrosCesantia[]> {
    return this.http
      .get(`${ApiUrl.catalogos}/empleados/cesantia`)
      .pipe(map((res: any) => res.result as MiembrosCesantia[]));
  }

  getEncargados() {
    return this.http.get(`${ApiUrl.catalogos}/departamento/encargados`);
  }

  //AREAS
  getAreas() {
    return this.http.get(`${ApiUrl.catalogos}/areas`);
  }

  // ACTUALIZAR APORTE ADICIONAL
  aporteAdicionalSolicitud(idParticipe, data) {
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

  getToken() {
    const data = this.localServiceS.getItem("token");
    return data;
  }

  // AGREGAR NUEVO COMENTARIO
  postComentarioParticipe(idParticipe, data) {
    this.getToken();
    return this.http.post(
      `${ApiUrl.Participe}/${idParticipe}/comentario`,
      data
    );
  }

  getComentariosParticipe(idParticipe) {
    return this.http.get(`${ApiUrl.Participe}/${idParticipe}/comentario`);
  }

  // AGREGAR NUEVO COMENTARIO
  postComentario(idPrestamo, data) {
    this.getToken();
    return this.http.post(`${ApiUrl.creditos}/${idPrestamo}/comentario`, data);
  }

  // TURNOS

  getTurnos(idTurno, idTicket) {
    return this.http.get(`${ApiUrl.tickets}/turnos/${idTurno}`);
  }

  getTicketsInternosByEstado(idEntidad) {
    return this.http.get(`${ApiUrl.tickets}/solicitudes/${idEntidad}`, {});
  }

  // COMENTARIOS
  getComentarios(idPrestamo) {
    return this.http.get(`${ApiUrl.creditos}/${idPrestamo}/comentario`);
  }

  // TAREAS
  getTiposTareasByArea(idArea) {
    return this.http.get(`${ApiUrl.tickets}/tipotarea/${idArea}`, {});
  }

  // TAGS
  getTagsByTipoTarea(idTipoTarea) {
    return this.http.get(`${ApiUrl.tickets}/tags/${idTipoTarea}`, {});
  }

  authPermisos() {
    return this.http.post<{ result: any }>(`${ApiUrl.Auth}/permissions`, {});
  }

  menu() {
    this.navigationService.items.splice(0, this.navigationService.items.length);
    this.authPermisos().subscribe((res: any) => {
      const icons = [
        { name: "icCreditCard", icon: icCreditCard },
        { name: "icArchive", icon: icArchive },
        { name: "icDashboard", icon: icDashboard },
        { name: "icPerson", icon: icPerson },
        { name: "icTicket", icon: icTicket },
        { name: "icBusiness", icon: icBusiness },
        { name: "icMoney", icon: icMoney },
        { name: "icAccountBalance", icon: icAccountBalance },
        { name: "icReport", icon: icReport },
        { name: "icDollar", icon: icDollar },
        { name: "icTable", icon: icTable },

        { name: "icPeople", icon: icPeople },
      ];

      this.accesos = res["result"]["accesos"];

      this.accesos.forEach((m) => {
        var iconName = m["icono"] ? m["icono"] : "icPerson";
        var icon = icons.find((x) => x.name == iconName);
        var permisos = m["permisos"];

        var modulo: NavigationDropdown = {
          type: "dropdown",
          label: m["nombre"],
          icon: icon ? icon.icon : null,
          children: [],
        };

        //ordenar permisos por orden
        permisos.sort((a, b) => a.orden - b.orden);

        permisos.forEach((permiso) => {
          //ordenar por orden

          const opcion: NavigationLink = {
            type: "link",
            label: permiso["nombre"],
            route: permiso["accion"],
            badge: {
              value: permiso["badge"],
              bgClass: permiso["bgClass"],
              textClass: permiso["textClass"],
            },
          };

          modulo.children.push(opcion);
        });
        this.navigationService.items.push(modulo);
      });

      var inicio: NavigationLink = {
        type: "link",
        label: "Inicio",
        icon: icDashboard,
        route: "/",
      };
      this.navigationService.items.unshift(inicio);
    });
  }

  getG41(anio, mes, tipo) {
    return this.http.get(
      `${ApiUrl.reportes}/estructuras/g41/${anio}/${mes}/${tipo}`,
      {
        responseType: "blob",
      }
    );
  }

  getG42(anio, mes, tipo) {
    return this.http.get(
      `${ApiUrl.reportes}/estructuras/g42/${anio}/${mes}/${tipo}`,
      {
        responseType: "blob",
      }
    );
  }

  getG45(anio, mes, tipo) {
    return this.http.get(
      `${ApiUrl.reportes}/estructuras/g45/${anio}/${mes}/${tipo}`,
      {
        responseType: "blob",
      }
    );
  }

  getG46(anio, mes, tipo) {
    return this.http.get(
      `${ApiUrl.reportes}/estructuras/g46/${anio}/${mes}/${tipo}`,
      {
        responseType: "blob",
      }
    );
  }

  getProveedores() {
    return this.http.get(
      `${ApiUrl.catalogos}/proveedor?idEmpresa=1&esproveedor=true`
    );
  }

  getDataDashboard(): Observable<any> {
    return this.http.get(`${ApiUrl.catalogos}/dashboard`);
  }

  getGerentes() {
    return this.http.get(`${ApiUrl.catalogos}/gerentes`);
  }

  getCalificacionesFinancieras() {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.catalogos}/calificacion-financiera`);
  }

  getSectorFinanciero() {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.catalogos}/sectores-financieros`, {});
  }

  getTipoInversion() {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.catalogos}/tipo-inversion`, {});
  }

  getPeriodos() {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.catalogos}/periodos`, {});
  }

  getMonedas(termino?) {
    this.tokenvalido();
    let params = new HttpParams();
    params = params.append("termino", termino);
    return this.http.get(`${ApiUrl.catalogos}/monedas/`, { params });
  }

  getNewReferenciaBancaria(id: any): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/entidad/${id}/referencia-bancarias`;
    return this.http.get<ApiResponse>(url);
  }

  postNewReferenciaBancaria(data: any, idColaborador: number) {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/entidad/${idColaborador}/referencia-bancaria`;
    return this.http.post(url, data);
  }

  deleteReferenciaBancaria(
    idColaborador: number,
    idReferenciaBancaria: number
  ): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/entidad/${idColaborador}/referencia-bancaria/${idReferenciaBancaria}`;
    return this.http.delete<ApiResponse>(url);
  }

  updateReferenciaBancaria(
    data: any,
    idColaborador: number,
    idReferenciaBancaria: number
  ): Observable<ReferenciaBancaria> {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/entidad/${idColaborador}/referencia-bancaria/${idReferenciaBancaria}`;
    return this.http.put<ReferenciaBancaria>(url, data);
  }

  getInfoAdjunto(adjuntoIds: any[]) {
    //id:idEntidad / idPrestamo
    this.tokenvalido();
    let url = `${this.adjuntosUrl}/colaborador/lista-entidades`;
    return this.http.post(url,adjuntoIds);
  }

  newPostAdjunto(data: any, idColaborador: number) {
    this.tokenvalido();
    let url = `${this.adjuntosUrl}/${idColaborador}/adjuntos`;
    return this.http.post(url, data);
  }

  updateAdjunto(idColaborador: number, idAdjunto: number, data: any) {
    this.tokenvalido();
    let url = `${this.adjuntosUrl}/${idColaborador}/adjunto/${idAdjunto}`;
    return this.http.put(url, data);
  }

  updateDatosParticipe(id, participe) {
    return this.http.put(
      `${ApiUrl.Participe}/${id}/actualizar-datos/participe`,
      participe,
      {}
    );
  }
  
  newGetAdjunto(idPrestamo, idTipoAdjunto?) {
    this.tokenvalido();
    let params = new HttpParams();
    params = params.append("idPrestamo", idPrestamo);

    if (idTipoAdjunto != null) {
      params = idTipoAdjunto
        ? params.append("idTipoAdjunto", idTipoAdjunto)
        : params;
    }
    let url = `${this.adjuntosUrl}/${idPrestamo}/adjuntos`;
    return this.http.get(url, { params });
  }

  newGetAdjuntoById(idEntidad, idTipoAdjunto?, idPrestamo?) {
    this.tokenvalido();
    let params = new HttpParams();
    if (idPrestamo != null) {
      params = params.append("idPrestamo", idPrestamo);
    }

    if (idTipoAdjunto != null) {
      params = idTipoAdjunto
        ? params.append("idTipoAdjunto", idTipoAdjunto)
        : params;
    }
    let url = `${this.adjuntosUrl}/${idEntidad}/adjuntos`;
    return this.http.get(url, { params });
  }

  newDeleteAdjunto(idAdjunto: number) {
    this.tokenvalido();
    let url = `${this.adjuntosUrl}/adjunto/${idAdjunto}`;
    return this.http.delete(url);
  }
  /* 
  getAdjunto(idEntidad, idAdjunto) {
    this.tokenvalido();
    let url = `${this.adjuntosUrl}/${idEntidad}/adjunto/${idAdjunto}`;
    return this.http.get(url);
  } */

  getPdfFromUrl(pdfUrl: string): Observable<Blob> {
    return this.http.request("GET", pdfUrl, { responseType: "blob" });
  }

  newUpdateAdjunto(idEntidad: number, idAdjunto: number, data: any) {
    this.tokenvalido();
    let url = `${this.adjuntosUrl}/${idEntidad}/adjunto/${idAdjunto}`;
    return this.http.put(url, data);
  }

  getParentesco() {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.catalogos}/parentesco`, {});
  }

  getParametroAporteAdicional(idParametro) {
    return this.http.get(`${ApiUrl.catalogos}/parametro/${idParametro}`, {});
  }

}
