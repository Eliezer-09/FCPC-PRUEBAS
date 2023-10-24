import { HttpClient } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { NGXLogger } from "ngx-logger";
import { NavigationService } from "src/@vex/services/navigation.service";
import { ComponentesService } from "src/app/services/componentes.service";
import { environment } from "../../../environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";
import { map } from "rxjs/operators";
import { ApiServiceUrl, ApiUrl } from "src/app/Shared/Routes/ApiServiceUrl";
import { LocalService } from "src/app/services/local.service";
const helper = new JwtHelperService();

@Injectable({
  providedIn: "root",
})
export class AuthService {
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

  //AUTH

  //Permisos
  authPermisosRutas() {
    this.tokenvalido();
    return this.http.post(`${ApiUrl.Auth}/permissions`, {});
  }

  usuarioLogeado(httpOptions?) {
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

  logeado(httpOptions?) {
    if (this.localServiceS.getItem("token")) {
      const token = this.localServiceS.getItem("token");
      const isExpired = helper.decodeToken(token);
      return isExpired;
      /* if (isExpired) {
        this.logout();
      } else {
        return true
      } */
    }
  }

  actualizarClave(data) {
    this.tokenvalido();
    return this.http.post(`${ApiUrl.Auth}/password`, data);
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

  login(httpOptions) {
    return this.http.post(`${ApiUrl.Auth}/login`, { headers: httpOptions });
  }

  logout() {
    this.localServiceS.clear();
    this.ngZone.run(() => {
      this.router.navigateByUrl("/login");
      this.navigationService.items = [];
    });
  }

  getToken() {
    const data = this.localServiceS.getItem("token");
    return data;
  }

  actualizarCorreoTemporal(data) {
    this.tokenvalido();
    return this.http.post(`${ApiUrl.Auth}/email`, data);
  }

  getFuncionario() {
    const data = this.localServiceS.getItem("nombre");
    if (data) {
      return data;
    } else {
    }
  }

  // FUNCIONARIO

  getPerfilFuncionario() {
    this.tokenvalido();
    return this.http.get(`${ApiUrl.Auth}/profile`, {}).pipe(
      map((res) => {
        if (res["success"] == true) {
          return res["result"];
        } else {
          return res["error"]["message"];
        }
      })
    );
  }

  getFotoFuncionario(idFuncionario?) {
    this.tokenvalido();

    var httpHeadersPhoto;

    if (idFuncionario) {
      httpHeadersPhoto = {
        "Content-Type": "application/json",
        "user-login": idFuncionario,
        Authorization: `Bearer ${this.token}`,
        ApiKey: "E704B2FF-6C48-4C3D-88B6-C4B623DCDD4D",
      };
    } else {
      httpHeadersPhoto = this.httpHeaders;
    }

    return this.http
      .get(`${ApiUrl.Auth}/profile/photo`, {
        responseType: "blob",
        headers: httpHeadersPhoto,
      })
      .pipe(
        map((res) => {
          if (res["type"] == "text/plain") {
            this.dataComponent.alerta("info", "El funcionado no tiene foto");
          }
          if (res["type"] == "text/gif") {
            this.dataComponent.alerta("info", "El funcionario no tiene foto");
          }
          let url = URL.createObjectURL(res);
          return this.dom.bypassSecurityTrustUrl(url);
        })
      );
  }

  actualizarFotoFuncionario(adjunto) {
    this.tokenvalido();
    return this.http.post(`${ApiUrl.Auth}/profile/photo`, adjunto, {});
  }
}
