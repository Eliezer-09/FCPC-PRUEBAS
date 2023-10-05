import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import moment from "moment";
import { NGXLogger } from "ngx-logger";
import { map } from "rxjs/operators";
import { NavigationService } from "src/@vex/services/navigation.service";
import { ComponentesService } from "src/app/services/componentes.service";
import { DataService } from "src/app/services/data.service";
import { LocalService } from "src/app/services/local.service";
import { ApiUrl } from "src/app/Shared/Routes/ApiServiceUrl";
import { environment } from "../../../environments/environment";
const helper = new JwtHelperService();
@Injectable({
  providedIn: "root",
})
export class ContratosService {
  date = moment().format();

  constructor(
    private http: HttpClient,
    private router: Router,
    private dom: DomSanitizer,
    private dataComponent: ComponentesService,
    private navigationService: NavigationService,
    private ngZone: NgZone,
    private logger: NGXLogger,
    private localServiceS: LocalService
  ) {}

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

  getContratoById(id) {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.Participe}/${id}/contrato`);
  }

  // ARCHIVO ADJUNTO
  getParticipeAdjunto(id, tipo) {
    this.tokenvalido();
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

   // ARCHIVO ADJUNTO CONTRATOS
   getParticipeAdjuntos(id,tipo) {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.Participe}/${id}/adjunto/${tipo}`,{responseType: 'blob', })
                    .pipe(
                      map((res) => {
                        let url = URL.createObjectURL(res);
                        return {url:this.dom.bypassSecurityTrustUrl(url),type:res["type"],res:res};   

                      })
                    )
  }

  // CONTRATO POR ID PARTICIPE
  getContratoByIdParticipe(id) {
    const token = this.localServiceS.getItem("token");
    const header = {
      api_key: token,
    };
    this.tokenvalido();
    return this.http.get(`${ApiUrl.reports}/participe/${id}/contrato-adhesion/PDF`,{responseType: 'blob', headers: header})
                    .pipe(
                      map((res) => {
                        this.logger.log("VIDEO", res)
                        if (res["type"] == "text/plain") {
                          this.dataComponent.alerta("info", "El participe es migrado, no tiene adjuntos")
                        }
                        if (res["type"] == "text/gif") {
                          this.dataComponent.alerta("info", "El participe es migrado, no tiene adjuntos")
                        } 
                        if (res["type"] == "application/pdf") {
                          //this.dataComponent.alerta("info", "el rol de pago es pdf")
                        } 
                        let url = URL.createObjectURL(res);
                        return this.dom.bypassSecurityTrustUrl(url);   
                      })
                    )
  }

  postAprobarParticipe(id, comentario, funcionario, fecha?) {
    this.tokenvalido();
    if (comentario == "") {
      const data = {
        comentarios: "N/A",
        funcionario: funcionario,
        fecha: this.date,
      };
      return this.http.post(
        `${ApiUrl.Participe}/${id}/aprobacion`,
        data
      );
    } else {
      const data = {
        comentarios: comentario,
        funcionario: funcionario,
        fecha: this.date,
      };
      return this.http.post(
        `${ApiUrl.Participe}/${id}/aprobacion`,
        data
      );
    }
  }

  postRechazarParticipe(id, comentario, funcionario, fecha?) {
    this.tokenvalido();
    const data = {
      comentarios: comentario,
      funcionario: funcionario,
      fecha: "2021-01-25T06:05:46.677Z",
    };
    return this.http.post(`${ApiUrl.Participe}/${id}/rechazo`, data);
  }

  postCrearTicket(identificacion) {
    this.tokenvalido();
    const data = {};
    return this.http.post(
      `${ApiUrl.cesantes}/${identificacion}/crear-ticket`,
      data
    );
  }

  getParticipeByEstado(estado, pagina?, size?) {
    this.tokenvalido();
    let params = new HttpParams();
    if (pagina != undefined && size != undefined) {
      params = params.append("page", String(pagina));
      params = params.append("pageSize", String(size));
    }

    return this.http.get(
      `${ApiUrl.Participe}/buscar/${estado}?page=${pagina}&pageSize=${size}`
    );
  }

  getTermParticipeByEstado(estado?, term?, pagina?, size?) {
    let params = new HttpParams();
    params = params.append("term", term);
    return this.http.get(
      `${ApiUrl.Participe}/buscar/${estado}?term=${term}&page=${pagina}&pageSize=${size}`
    );
  }

  getTicketByIdentificacion(identificacion) {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.tickets}/cesante/${identificacion}`);
  }
}
