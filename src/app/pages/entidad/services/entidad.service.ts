import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { NavigationService } from "src/@vex/services/navigation.service";
import { ApiUrl } from "src/app/Shared/Routes/ApiServiceUrl";
import { ApiResponse } from "../../colaboradores/models/colaboradores";
import { LocalService } from "src/app/services/local.service";

const helper = new JwtHelperService();

@Injectable({
  providedIn: "root",
})
export class EntidadService {
  catalogoUrl = ApiUrl.catalogos;

  nominaUrl = ApiUrl.nominaUrl;
  unidad;
  cargo;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone,
    private navigationService: NavigationService,
    private localServiceS: LocalService
  ) {}

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

  getUnidades(term = ""): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/nomina/panel-configuracion/obtener/unidades?term=${term}`;
    return this.http.get<ApiResponse>(url);
  }

  getAreas(idDepartamento, term = ""): Observable<ApiResponse> {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/nomina/panel-configuracion/obtener/${idDepartamento}/areas?term=${term}`;
    return this.http.get<ApiResponse>(url);
  }

  updateAreaSubarea(
    data: any,
    idColaborador: number,
    idDependiente
  ): Observable<any> {
    this.tokenvalido();
    let url = `${this.nominaUrl}/colaborador/${idColaborador}/dependiente/${idDependiente}`;
    return this.http.put<any>(url, data);
  }

  postAreaSubarea(data: any, idColaborador: number): Observable<any> {
    this.tokenvalido();
    let url = `${this.nominaUrl}/colaborador/${idColaborador}/dependiente`;
    return this.http.post<any>(url, data);
  }

  getEmpleados() {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/empleados`;
    return this.http.get<ApiResponse>(url);
  }

  guardarUnidad(data: any): Observable<any> {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/nomina/panel-configuracion/unidad`;
    return this.http.post<any>(url, data);
  }

  guardarArea(data: any): Observable<any> {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/nomina/panel-configuracion/area`;
    return this.http.post<any>(url, data);
  }

  eliminarUnidad(id: number): Observable<any> {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/nomina/panel-configuracion/${id}/unidad`;
    return this.http.delete<any>(url);
  }

  eliminarArea(id: number): Observable<any> {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/nomina/panel-configuracion/${id}/area`;
    return this.http.delete<any>(url);
  }

  actualizarUnidad(id: number, data: any): Observable<any> {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/nomina/panel-configuracion/modificar/${id}/unidad`;
    return this.http.put<any>(url, data);
  }

  actualizarAreaSubarea(id: number, data: any): Observable<any> {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/nomina/panel-configuracion/modificar/${id}/area`;
    return this.http.put<any>(url, data);
  }

  postCargoSubcargo(data: any): Observable<any> {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/nomina/panel-configuracion/cargo`;
    return this.http.post<any>(url, data);
  }

  actualizaCargoSubcargo(id: number, data: any): Observable<any> {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/nomina/panel-configuracion/modificar/${id}/cargo`;
    return this.http.put<any>(url, data);
  }

  eliminarCargoSubcargo(id: number): Observable<any> {
    this.tokenvalido();
    let url = `${this.catalogoUrl}/nomina/panel-configuracion/${id}/cargo`;
    return this.http.delete<any>(url);
  }

  getCargosBuscador(term = ""): Observable<ApiResponse> {
    this.tokenvalido();
    let params = new HttpParams();
    params = params.append("term", term);

    let url = `${this.catalogoUrl}/nomina/panel-configuracion/cargos/buscador`;
    return this.http.get<ApiResponse>(url, { params });
  }

  getCargos(term = ""): Observable<ApiResponse> {
    this.tokenvalido();
    let params = new HttpParams();
    params = params.append("term", term);

    let url = `${this.catalogoUrl}/nomina/panel-configuracion/cargos`;
    return this.http.get<ApiResponse>(url, { params });
  }

}
