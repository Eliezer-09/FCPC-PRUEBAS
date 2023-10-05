import { HttpClient, HttpParams } from "@angular/common/http";
import {
  Component,
  EventEmitter,
  Injectable,
  NgZone,
  Output,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { NGXLogger } from "ngx-logger";
import { NavigationService } from "src/@vex/services/navigation.service";
import { ComponentesService } from "src/app/services/componentes.service";
import { DataService } from "src/app/services/data.service";
import { environment } from "../../../environments/environment";
import data from "@iconify/icons-ic/twotone-visibility";
import { Areas, Estados, TipoTarea } from "./ticket.interface";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { ApiServiceUrl, ApiUrl } from "src/app/Shared/Routes/ApiServiceUrl";
import { LocalService } from "src/app/services/local.service";
import { PostAdjunto } from "src/app/model/models";

const helper = new JwtHelperService();

@Injectable({
  providedIn: "root",
})
export class TicketsService {
  @Output() aClickedEvent = new EventEmitter<string>();
  token: any;
  httpHeaders: { "Content-Type": string; Authorization: string };
  adjuntosUrl = ApiUrl.adjuntos;
  constructor(
    private http: HttpClient,
    private router: Router,

    private navigationService: NavigationService,
    private ngZone: NgZone,
    private localServiceS: LocalService
  ) {
    this.token =
      this.localServiceS.getItem("token") || window.navigator.appVersion;
    this.httpHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
    };
  }

  logout() {
    this.localServiceS.removeItem("token");
    sessionStorage.removeItem("email");

    this.ngZone.run(() => {
      this.router.navigateByUrl("/login");
      this.navigationService.items = [];
    });
  }

  AClicked(msg: string) {
    this.aClickedEvent.emit(msg);
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

  setStatusColor(estado) {
    switch (estado) {
      case "Pendiente":
        return "#FF5733";
      case "Creado":
        return "#FFBE33";
      case "Pausa":
        return "#E720F0";
      case "EsperaRespuesta":
        return "#8033FF";
      case "EnProceso":
        return "#FFD433";
      case "Reabierto":
        return "#20F0AE";
      case "Asignado":
        return "#33A2FF";
      case "Completado":
        return "#20F02D";
      case "Cerrado":
        return "#0004FF";
      case "Leido":
        return "#FF6E33";
      case "StandBy":
        return "#AE20F0";
      default:
        break;
    }
  }

  //TICKETS
  postTicketCreate(cedula, nombre, tipo_atencion, idEntidad) {
    const data = {
      identificacion: cedula,
      nombre: nombre,
      idTipoTarea: tipo_atencion,
      idEntidad: idEntidad,
    };
    return this.http.post(`${ApiUrl.tickets}/crear`, data, {});
  }

  postTicketCreateInterno(data) {
    return this.http.post(`${ApiUrl.tickets}/crearInterno`, data, {});
  }

  postTicketCrearSubTarea(idTicket, data) {
    return this.http.post(
      `${ApiUrl.tickets}/${idTicket}/crear-sub-tarea`,
      data,
      {}
    );
  }

  getTicketSubTarea(idTicketPadre) {
    return this.http.get(`${ApiUrl.tickets}/${idTicketPadre}/sub-tareas`, {});
  }

  postTicketAnular(idTicket) {
    const data = {};
    return this.http.post(`${ApiUrl.tickets}/${idTicket}/anular`, data, {});
  }
  /* 
  postTickeAdjunto(idTicket, data) {
    return this.http.post(`${ApiUrl.tickets}/${idTicket}/adjunto`, data, {});
  } */

  postNewTicketAdjunto(data: PostAdjunto) {
    this.tokenvalido();
    let idUsuario = this.localServiceS.getItem("id");
    let url = `${this.adjuntosUrl}/${idUsuario}/adjuntos`;
    return this.http.post(url, data);
  }

  /*   postAdjuntoComentarioInterno(idComentario, data) {
    return this.http.post(
      `${ApiUrl.Participe}/comentario/${idComentario}/adjunto`,
      data,
      {}
    );
  } */

  postAprobarTicket(idTicket, idEntidad, data) {
    return this.http.post(
      `${ApiUrl.tickets}/internos/aprobar?idTicket=${idTicket}&entity=${idEntidad}`,
      data,
      {}
    );
  }
  /* 
  getAdjuntoComentarioInterno(idComentario) {
    return this.http.get(
      `${ApiUrl.Participe}/comentario/${idComentario}/adjuntos`,
      {}
    );
  } */

  getNewComentarioAdjuntos(idComentario) {
    let params = new HttpParams();
    params = params.append("idComentario", idComentario);
    let url = `${this.adjuntosUrl}/${idComentario}/adjuntos`;
    return this.http.get(url, { params });
  }
  /*   
  getAdjuntosComentarioInterno(idAdjunto, idComentario) {
    return this.http.get(
      `${ApiUrl.Participe}/comentario/${idAdjunto}/adjunto/${idComentario}`,
      { responseType: "blob" }
    );
  } */

  getNotificacionesTickets(idEntidad) {
    return this.http.get(`${ApiUrl.tickets}/notificaciones/${idEntidad}`);
  }

  // TICKETS INTERNOS
  getTicketsInternoTodos() {
    return this.http.get(`${ApiUrl.tickets}/internos`);
  }

  // TICKETS INTERNOS
  getTicketsInterno(pagina?, size?, estado?) {
    let params = new HttpParams();
    if (pagina && size) {
      params = params.append("page", String(pagina));
      params = params.append("pageSize", String(size));
    }

    if (pagina && size && estado) {
      params = params.append("page", String(pagina));
      params = params.append("pageSize", String(size));
      params = params.append("estado", String(estado));
    }

    return this.http.get(`${ApiUrl.tickets}/internos`, { params: params });
  }

  getTicketByTermino(estado?, term?) {
    let params = new HttpParams();
    params = params.append("term", term);
    return this.http.get(`${ApiUrl.tickets}/buscar/${estado}?term=${term}`);
  }

  getTicketsInternosByTermino(estado, filters, page?, size?) {
    let params = new HttpParams();
    params = filters.term ? params.append("term", filters.term) : params;
    params = filters.area ? params.append("area", filters.area) : params;
    params = filters.departamento
      ? params.append("departamento", filters.departamento)
      : params;
    params = filters.tipotarea
      ? params.append("tipoTarea", filters.tipotarea)
      : params;
    params = filters.prioridad
      ? params.append("prioridad", filters.prioridad)
      : params;
    params = filters.desde ? params.append("desde", filters.desde) : params;
    params = filters.hasta ? params.append("hasta", filters.hasta) : params;
    return this.http.get(
      `${ApiUrl.tickets}/internos/buscar?estado=${estado}&page=${page}&pageSize=${size}`,
      { headers: this.httpHeaders, params }
    );
  }

  getTicketInternoEstado(term?, estado?) {
    return this.http.get(
      `${ApiUrl.tickets}/internos?term=${term}?estado=${estado}`
    );
  }

  getEstados(term?): Observable<Estados[]> {
    return this.http
      .get(`${ApiUrl.tickets}/ticketsestado?term=${term}`)
      .pipe(map((res: any) => res.result as Estados[]));
  }

  getEstadosDetalle(estado) {
    return this.http
      .get(`${ApiUrl.tickets}/estados/${estado}`)
      .pipe(map((res: any) => res.result as Estados[]));
  }

  getTicketsGenerados(idEntidad) {
    return this.http.get(`${ApiUrl.tickets}/${idEntidad}/generados`, {});
  }

  getTicketsSolicitudes(idEntidad) {
    return this.http.get(`${ApiUrl.tickets}/solicitudes/${idEntidad}`, {});
  }

  getTicketsByEstado(estado) {
    return this.http.get(`${ApiUrl.tickets}/buscar/${estado}`, {});
  }

  getTicketsInternosByEstado(estado, id) {
    return this.http.get(
      `${ApiUrl.tickets}/buscarInternos/${estado}/${id}`,
      {}
    );
  }

  getTicketsInternos() {
    return this.http.get(`${ApiUrl.tickets}/solicitudes`, {});
  }

  /*  getTicketAdjuntos(idTicket) {
    return this.http.get(`${ApiUrl.tickets}/${idTicket}/adjuntos`, {});
  } */

  getNewTicketAdjuntos(idTicket) {
    let params = new HttpParams();
    params = params.append("idTicket", idTicket);
    let url = `${this.adjuntosUrl}/${idTicket}/adjuntos`;
    return this.http.get(url, { params });
  }

  getTiposTarea(): Observable<TipoTarea[]> {
    return this.http
      .get(`${ApiUrl.tickets}/tipotarea`)
      .pipe(map((res: any) => res.result as TipoTarea[]));
  }

  getSubTareas(idTipoTarea): Observable<TipoTarea[]> {
    return this.http
      .get(`${ApiUrl.tickets}/subtarea/${idTipoTarea}`)
      .pipe(map((res: any) => res.result as TipoTarea[]));
  }

  getAreaByIdTiposTarea(idTipoTarea): Observable<Areas> {
    return this.http
      .get(`${ApiUrl.tickets}/area/${idTipoTarea}`)
      .pipe(map((res: any) => res.result as Areas));
  }

  getTicketTipoTareas(idTarea) {
    return this.http.get(`${ApiUrl.tickets}/tarea/${idTarea}/comentarios`, {});
  }

  /*   getTicketAdjuntosByIdAdjunto(idAjunto, idTicket) {
    return this.http.get(`${ApiUrl.tickets}/${idAjunto}/adjunto/${idTicket}`, {
      responseType: "blob",
    });
  } */

  getTicketById(idTicket) {
    return this.http.get(`${ApiUrl.tickets}/${idTicket}`, {});
  }

  getMensajesByIdTipoTarea(idTipoTarea) {
    return this.http.get(`${ApiUrl.tickets}/${idTipoTarea}/mensajes`, {});
  }

  getTareaById(idTarea) {
    return this.http.get(`${ApiUrl.tickets}/tarea/${idTarea}`, {});
  }

  postCambiarEstadoTicket(idTicket, data) {
    return this.http.put(`${ApiUrl.tickets}/${idTicket}/actualizar`, data, {});
  }

  postAsignarFuncionario(idTicket, idUsuario) {
    return this.http.post(
      `${ApiUrl.tickets}/${idTicket}/asignar-interno/${idUsuario}`,
      data,
      {}
    );
  }

  postAtenderTicket(idTicket, usuario, idUsuario) {
    const data = {};
    return this.http.post(
      `${ApiUrl.tickets}/${idTicket}/atender?usuario=${usuario}&idUsuario=${idUsuario}`,
      data,
      {}
    );
  }

  postAtenderTicketInterno(idTicket, usuario, idUsuario) {
    const data = {};
    return this.http.post(
      `${ApiUrl.tickets}/${idTicket}/atenderInterno?usuario=${usuario}&idUsuario=${idUsuario}`,
      data,
      {}
    );
  }

  postFinalizarTicket(idTicket, idReferido) {
    const data = {
      IdReferido: idReferido,
    };
    return this.http.post(`${ApiUrl.tickets}/${idTicket}/Finalizar`, data);
  }

  //TAREAS
  postTareaComentarios(
    idTarea,
    idUsuario,
    funcionario,
    observaciones,
    menciones?
  ) {
    const data = {
      idUsuario: idUsuario,
      funcionario: funcionario,
      observaciones: observaciones,
      menciones: menciones,
    };
    return this.http.post(
      `${ApiUrl.tickets}/tarea/${idTarea}/crear-comentario`,
      data,
      {}
    );
  }

  getComentariosByIdTarea(idTarea) {
    return this.http.get(`${ApiUrl.tickets}/tarea/${idTarea}/comentarios`, {});
  }

  getTiposReferencia() {
    return this.http.get(`${ApiUrl.tickets}/referencias`);
  }

  postFinalizarTarea(idTarea, idReferido) {
    const data = {
      IdTarea: idTarea,
      IdReferido: idReferido,
    };
    return this.http.post(`${ApiUrl.tickets}/tarea/finaliza`, data);
  }

  postFinalizarTareaInterna(idTarea) {
    return this.http.get(
      `${ApiUrl.tickets}/tarea/${idTarea}/finalizaInterno`,
      {}
    );
  }

  postAsignarTicket(idTicket, idUsuario) {
    return this.http.post(
      `${ApiUrl.tickets}/${idTicket}/asignar-interno/${idUsuario}`,
      {}
    );
  }

  putTicket(idTicket, body) {
    return this.http.put(`${ApiUrl.tickets}/${idTicket}/editar`, body, {});
  }

  postFechaTentativa(fecha, data) {
    return this.http.put(
      `${ApiUrl.tickets}/internos/${fecha}/fecha-tentativa`,
      data
    );
  }

  putEstadoTicket(idTicket, body) {
    return this.http.put(`${ApiUrl.tickets}/${idTicket}/actualizar`, body, {});
  }

  deleteAdjuntoTicket(idAdjunto) {
    return this.http.delete(`${ApiUrl.adjuntos}/adjunto/${idAdjunto}`, {});
  }

  // TAGS
  getTagsByTipoTarea(idTipoTarea) {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.tickets}/tags/${idTipoTarea}`, {});
  }

  getEmpleados(term) {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.catalogos}/empleados?term=${term}`);
  }
}
