import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';
import { ApiUrl } from 'src/app/Shared/Routes/ApiServiceUrl';
import { Adjunto, Parentesco } from './models/cesante-catalogo.interface';
import { ActualizarCesante, Beneficiario, Cesante, CesantiaBeneficiario, DetalleCesante, RegistrarBeneficiario, RegistrarCesante, RegistroBeneficiario } from './models/cesante.interface';
import { Cesantia, SimulacionCesantia } from './models/cesantia.interface';
import { TipoCesante } from './models/tipo-censante.interface';

@Injectable({
  providedIn: 'root'
})
export class CesantesService {

  constructor(
    private http: HttpClient, 
    private dataService: DataService
  ) { }

  //TODO: CESANTE
  getTiposCesantes(): Observable<TipoCesante[]> {
    return this.http.get(`${ApiUrl.catalogos}/tipos-cesantia`).pipe(map((response: any) => response.result as TipoCesante[]
    ));
  }

  getCesanteById(id): Observable<Cesante> {
    return this.http.get(`${ApiUrl.cesantes}/${id}`).pipe(map((response: any) => response.result as Cesante
    ));
  }

  putActualizarCesante(id: number, body: ActualizarCesante): Observable<CesantiaBeneficiario> {
    return this.http.put(`${ApiUrl.cesantes}/${id}/actualizar`, body).pipe(map((response: any) => response.result as CesantiaBeneficiario
    ));
  }

  postSolicitante(body: RegistroBeneficiario): Observable<CesantiaBeneficiario> {
    return this.http.post(`${ApiUrl.catalogos}/persona/registro`, body).pipe(map((response: any) => response.result as CesantiaBeneficiario
    ));
  }

  postRegistrarCesante(body: RegistrarCesante): Observable<DetalleCesante> {
    return this.http.post(`${ApiUrl.cesantes}/registro`, body).pipe(map((response: any) => response.result as DetalleCesante
    ));
  }

  getSimulacionCesante(idCesante): Observable<SimulacionCesantia>{
    return this.http.get(`${ApiUrl.cesantes}/${idCesante}/cesantia/simulacion`).pipe(map((response: any) => response.result as SimulacionCesantia
    ));
  } 

  //TODO: BENEFICIARIO
  postBeneficiario(idCesantia: number, body: RegistrarBeneficiario): Observable<Beneficiario> {
    return this.http.post(`${ApiUrl.cesantes}/cesantia/${idCesantia}/beneficiario/agregar`, body).pipe(map((response: any) => response.result as Beneficiario
    ));
  }

  deleteBeneficiario(idCesantia: number, idBeneficiario: number): Observable<CesantiaBeneficiario> {
    return this.http.delete(`${ApiUrl.cesantes}/cesantia/${idCesantia}/beneficiario/${idBeneficiario}`).pipe(map((response: any) => response.result as CesantiaBeneficiario
    ));
  }

  //TODO: ADJUNTOS
  postCesantiaAdjunto(idCesantia: number, body): Observable<Adjunto> {
    return this.http.post(`${ApiUrl.cesantes}/${idCesantia}/adjunto`, body).pipe(map((response: any) => response.result as Adjunto
    ));
  }

  //TODO: CATALOGOS
  getParentescos(): Observable<Parentesco[]> {
    return this.http.get(`${ApiUrl.catalogos}/parentesco`).pipe(map((response: any) => response as Parentesco[]
    ));
  }

  //TODO: CESANTIA

  getCesantiaById(id): Observable<Cesantia> {
    return this.http.get(`${ApiUrl.cesantes}/cesantia/${id}`).pipe(map((response: any) => response.result as Cesantia
    ));
  }

  getCesantiasLiquidadas(estado?, pagina?, size?){
    let params = new HttpParams();
    if (estado != undefined && pagina != undefined && size != undefined) {
      params = params.append('estado', String(estado));
      params = params.append('page', String(pagina));
      params = params.append('pageSize', String(size));
    }
    return this.http.get(`${ApiUrl.cesantes}/cesantia/estado`, {params});
  }

  getTermCesantiaByEstado(term?,pagina?, size?) {
    let params = new HttpParams();
    params = params.append('term', term);
    return this.http.get(`${ApiUrl.cesantes}/cesantia/estado?estado=Liquidado&term=${term}&page=${pagina}&pageSize=${size}`);
  }

  postRegistroCesantia(body): Observable<Adjunto> {
    return this.http.post(`${ApiUrl.cesantes}/cesantia/registro`, body).pipe(map((response: any) => response.result as Adjunto
    ));
  }

  postLiquidarCesantia(idCesantia, body): Observable<Adjunto> {
    return this.http.post(`${ApiUrl.cesantes}/cesantia/${idCesantia}/liquidar`, body).pipe(map((response: any) => response.result as Adjunto
    ));
  }
}
