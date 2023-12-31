(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["default~pages-colaboradores-colaboradores-routing-module~pages-entidad-entidad-routing-module"],{

/***/ "427Y":
/*!****************************************************************************!*\
  !*** ./src/app/pages/colaboradores/utils/api-service-url-catalogs-TTHH.ts ***!
  \****************************************************************************/
/*! exports provided: ApiUrlCatalogsTTHH */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApiUrlCatalogsTTHH", function() { return ApiUrlCatalogsTTHH; });
const ApiUrlCatalogsTTHH = {
    nomina: "/nomina",
    catalogo: "/catalogo",
    direccion: "/direccion"
};


/***/ }),

/***/ "I+UP":
/*!***********************************************************!*\
  !*** ./src/app/pages/entidad/services/entidad.service.ts ***!
  \***********************************************************/
/*! exports provided: EntidadService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EntidadService", function() { return EntidadService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @auth0/angular-jwt */ "Nm8O");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var src_app_Shared_Routes_ApiServiceUrl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/Shared/Routes/ApiServiceUrl */ "bqWN");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var src_vex_services_navigation_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/@vex/services/navigation.service */ "0vMP");
/* harmony import */ var src_app_services_local_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/services/local.service */ "s3jE");









const helper = new _auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_1__["JwtHelperService"]();
class EntidadService {
    constructor(http, router, ngZone, navigationService, localServiceS) {
        this.http = http;
        this.router = router;
        this.ngZone = ngZone;
        this.navigationService = navigationService;
        this.localServiceS = localServiceS;
        this.catalogoUrl = src_app_Shared_Routes_ApiServiceUrl__WEBPACK_IMPORTED_MODULE_3__["ApiUrl"].catalogos;
        this.nominaUrl = src_app_Shared_Routes_ApiServiceUrl__WEBPACK_IMPORTED_MODULE_3__["ApiUrl"].nominaUrl;
    }
    tokenvalido() {
        if (this.localServiceS.getItem("token")) {
            const token = this.localServiceS.getItem("token");
            const isExpired = helper.isTokenExpired(token);
            if (isExpired) {
                this.logout();
            }
            else {
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
    getUnidades(term = "") {
        this.tokenvalido();
        let url = `${this.catalogoUrl}/nomina/panel-configuracion/obtener/unidades?term=${term}`;
        return this.http.get(url);
    }
    getAreas(idDepartamento, term = "") {
        this.tokenvalido();
        let url = `${this.catalogoUrl}/nomina/panel-configuracion/obtener/${idDepartamento}/areas?term=${term}`;
        return this.http.get(url);
    }
    updateAreaSubarea(data, idColaborador, idDependiente) {
        this.tokenvalido();
        let url = `${this.nominaUrl}/colaborador/${idColaborador}/dependiente/${idDependiente}`;
        return this.http.put(url, data);
    }
    postAreaSubarea(data, idColaborador) {
        this.tokenvalido();
        let url = `${this.nominaUrl}/colaborador/${idColaborador}/dependiente`;
        return this.http.post(url, data);
    }
    getEmpleados() {
        this.tokenvalido();
        let url = `${this.catalogoUrl}/empleados`;
        return this.http.get(url);
    }
    guardarUnidad(data) {
        this.tokenvalido();
        let url = `${this.catalogoUrl}/nomina/panel-configuracion/unidad`;
        return this.http.post(url, data);
    }
    guardarArea(data) {
        this.tokenvalido();
        let url = `${this.catalogoUrl}/nomina/panel-configuracion/area`;
        return this.http.post(url, data);
    }
    eliminarUnidad(id) {
        this.tokenvalido();
        let url = `${this.catalogoUrl}/nomina/panel-configuracion/${id}/unidad`;
        return this.http.delete(url);
    }
    eliminarArea(id) {
        this.tokenvalido();
        let url = `${this.catalogoUrl}/nomina/panel-configuracion/${id}/area`;
        return this.http.delete(url);
    }
    actualizarUnidad(id, data) {
        this.tokenvalido();
        let url = `${this.catalogoUrl}/nomina/panel-configuracion/modificar/${id}/unidad`;
        return this.http.put(url, data);
    }
    actualizarAreaSubarea(id, data) {
        this.tokenvalido();
        let url = `${this.catalogoUrl}/nomina/panel-configuracion/modificar/${id}/area`;
        return this.http.put(url, data);
    }
    postCargoSubcargo(data) {
        this.tokenvalido();
        let url = `${this.catalogoUrl}/nomina/panel-configuracion/cargo`;
        return this.http.post(url, data);
    }
    actualizaCargoSubcargo(id, data) {
        this.tokenvalido();
        let url = `${this.catalogoUrl}/nomina/panel-configuracion/modificar/${id}/cargo`;
        return this.http.put(url, data);
    }
    eliminarCargoSubcargo(id) {
        this.tokenvalido();
        let url = `${this.catalogoUrl}/nomina/panel-configuracion/${id}/cargo`;
        return this.http.delete(url);
    }
    getCargosBuscador(term = "") {
        this.tokenvalido();
        let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]();
        params = params.append("term", term);
        let url = `${this.catalogoUrl}/nomina/panel-configuracion/cargos/buscador`;
        return this.http.get(url, { params });
    }
    getCargos(term = "") {
        this.tokenvalido();
        let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]();
        params = params.append("term", term);
        let url = `${this.catalogoUrl}/nomina/panel-configuracion/cargos`;
        return this.http.get(url, { params });
    }
}
EntidadService.ɵfac = function EntidadService_Factory(t) { return new (t || EntidadService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](src_vex_services_navigation_service__WEBPACK_IMPORTED_MODULE_5__["NavigationService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](src_app_services_local_service__WEBPACK_IMPORTED_MODULE_6__["LocalService"])); };
EntidadService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: EntidadService, factory: EntidadService.ɵfac, providedIn: "root" });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](EntidadService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
        args: [{
                providedIn: "root",
            }]
    }], function () { return [{ type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"] }, { type: src_vex_services_navigation_service__WEBPACK_IMPORTED_MODULE_5__["NavigationService"] }, { type: src_app_services_local_service__WEBPACK_IMPORTED_MODULE_6__["LocalService"] }]; }, null); })();


/***/ }),

/***/ "TDBg":
/*!**************************************************************************!*\
  !*** ./src/app/pages/colaboradores/services/tthh-colaborador.service.ts ***!
  \**************************************************************************/
/*! exports provided: TTHHColaboradorService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TTHHColaboradorService", function() { return TTHHColaboradorService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @auth0/angular-jwt */ "Nm8O");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var src_app_Shared_Routes_ApiServiceUrl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/Shared/Routes/ApiServiceUrl */ "bqWN");
/* harmony import */ var _utils_api_service_url_catalogs_TTHH__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/api-service-url-catalogs-TTHH */ "427Y");
/* harmony import */ var _utils_api_service_url_TTHH__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/api-service-url-TTHH */ "vy7l");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var src_app_services_local_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/app/services/local.service */ "s3jE");
/* harmony import */ var src_vex_services_navigation_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/@vex/services/navigation.service */ "0vMP");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");














const helper = new _auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_1__["JwtHelperService"]();
class TTHHColaboradorService {
    constructor(http, router, ngZone, localServiceS, navigationService, dom) {
        this.http = http;
        this.router = router;
        this.ngZone = ngZone;
        this.localServiceS = localServiceS;
        this.navigationService = navigationService;
        this.dom = dom;
        /*   catalogoUrl = ApiUrl.catalogos; */
        this.nominaUrl = _utils_api_service_url_catalogs_TTHH__WEBPACK_IMPORTED_MODULE_5__["ApiUrlCatalogsTTHH"].nomina;
        this.participeUrl = src_app_Shared_Routes_ApiServiceUrl__WEBPACK_IMPORTED_MODULE_4__["ApiUrl"].Participe;
        this.tthhServiceUrl = src_app_Shared_Routes_ApiServiceUrl__WEBPACK_IMPORTED_MODULE_4__["ApiUrl"].tthhUrl;
        this.colaboradorUrl = _utils_api_service_url_TTHH__WEBPACK_IMPORTED_MODULE_6__["ApiUrlTTHH"].colaborador;
        this.nominatthhUrl = _utils_api_service_url_TTHH__WEBPACK_IMPORTED_MODULE_6__["ApiUrlTTHH"].nomina;
        this.catalogosUrl = src_app_Shared_Routes_ApiServiceUrl__WEBPACK_IMPORTED_MODULE_4__["ApiUrl"].catalogos;
        this.catalogoUrl = _utils_api_service_url_catalogs_TTHH__WEBPACK_IMPORTED_MODULE_5__["ApiUrlCatalogsTTHH"].catalogo;
        this.httpHeaders = {
            "Content-Type": "application/json",
            ApiKey: "E704B2FF-6C48-4C3D-88B6-C4B623DCDD4D",
        };
        this.messageSource = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"]("default message");
        this.currentMessage$ = this.messageSource.asObservable();
    }
    changeMessage(message) {
        this.messageSource.next(message);
    }
    // TOKEN
    tokenvalido() {
        if (this.localServiceS.getItem("token")) {
            const token = this.localServiceS.getItem("token");
            const isExpired = helper.isTokenExpired(token);
            if (isExpired) {
                this.logout();
            }
            else {
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
    //TODO: COLABORADORES TTHH
    loadColaboradores(idTipoColaborador, pagina, size, termino) {
        this.tokenvalido();
        let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]();
        params = params.append("idTipoColaborador", idTipoColaborador);
        params = termino ? params.append("term", termino) : params;
        params = pagina ? params.append("page", String(pagina)) : params;
        params = size ? params.append("pageSize", String(size)) : params;
        return this.http.get(`${this.tthhServiceUrl}${this.colaboradorUrl}/listado-colaboradores/colaboradores`, {
            headers: this.httpHeaders,
            params,
        });
    }
    loadColaboradorId(id) {
        this.tokenvalido();
        let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]();
        params = id ? params.append("id", id) : params;
        return this.http.get(`${this.tthhServiceUrl}${this.colaboradorUrl}/listado-colaboradores/colaboradores`, {
            headers: this.httpHeaders,
            params,
        });
    }
    putInformacionLaboral(idColaborador, data) {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/informacion-laboral/${idColaborador}/colaborador`;
        return this.http.put(url, data);
    }
    //PROCESO DE SELECCION
    postProcesoSeleccion(idColaborador, data) {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/proceso-seleccion/${idColaborador}/colaborador`;
        return this.http.put(url, data);
    }
    postColaborador(data) {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/datos-colaborador`;
        return this.http.post(url, data);
    }
    //TODO: FORMACION ACADEMICA TTHH
    //reparar
    guardarDatosFormacionAcademica(id, idFormacionAcademica, data) {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${id}/formacion-academica/${idFormacionAcademica}`;
        return this.http.put(url, data);
    }
    getFormacionAcademica(id) {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${id}/formacion-academica`;
        return this.http.get(url);
    }
    postFormacionAcademica(data, idColaborador) {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/formacion-academica`;
        return this.http.post(url, data);
    }
    updateFormacionAcademica(data, idColaborador, idFormacionAcademica) {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/formacion-academica/${idFormacionAcademica}`;
        return this.http.put(url, data);
    }
    deleteFormacionAcademica(idColaborador, idFormacionAcademica) {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/formacion-academica/${idFormacionAcademica}`;
        return this.http.delete(url);
    }
    updateUltimaCulminadaFormacionAcademica(data, idColaborador, idFormacionAcademica) {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/formacion-culminada/${idFormacionAcademica}`;
        return this.http.put(url, data);
    }
    //REFERENCIA BANCARIA
    guardarDatosReferenciaBancaria(id, data) {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/cuenta-banco/${id}/colaborador`;
        return this.http.put(url, data);
    }
    //Todo: contactos
    //CONTACTO
    getContactos(id) {
        this.tokenvalido();
        let url = `${this.catalogosUrl}/contacto${this.colaboradorUrl}/${id}/contactos`;
        return this.http.get(url);
    }
    postContacto(data, idColaborador) {
        this.tokenvalido();
        let url = `${this.catalogosUrl}/contacto${this.colaboradorUrl}/${idColaborador}/contacto`;
        return this.http.post(url, data);
    }
    updateContacto(data, idColaborador, idContacto) {
        this.tokenvalido();
        let url = `${this.catalogosUrl}/contacto${this.colaboradorUrl}/${idColaborador}/contacto/${idContacto}`;
        return this.http.put(url, data);
    }
    deleteContacto(idColaborador, idContacto) {
        this.tokenvalido();
        let url = `${this.catalogosUrl}/contacto${this.colaboradorUrl}/${idColaborador}/contacto/${idContacto}`;
        return this.http.delete(url);
    }
    postDatosPersonales(data) {
        this.tokenvalido();
        let url = `${this.catalogosUrl}${this.nominaUrl}${this.colaboradorUrl}/datos-personales`;
        return this.http.post(url, data);
    }
    //NO USADO
    loadSupervisoresInmediatos() {
        this.tokenvalido();
        return this.http.get(`${this.catalogosUrl}${this.nominaUrl}${this.colaboradorUrl}/supervisores-inmediatos`, {
            headers: this.httpHeaders
        });
    }
    //NO USADO
    loadJefesInmediatos() {
        this.tokenvalido();
        return this.http.get(`${this.catalogosUrl}${this.nominaUrl}${this.colaboradorUrl}/jefes-inmediatos`, {
            headers: this.httpHeaders
        });
    }
    //TODO: CATALOGO COLABORADORES
    loadColaboradoresData(colaboradoresIds, pagina, size) {
        this.tokenvalido();
        let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]();
        params = pagina ? params.append("page", String(pagina)) : params;
        params = size ? params.append("pageSize", String(size)) : params;
        return this.http.post(`${this.catalogosUrl}${this.nominaUrl}${this.colaboradorUrl}/lista-entidades`, colaboradoresIds, {
            headers: this.httpHeaders,
            params,
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["catchError"])((error) => {
            console.log("Se produjo un error:", error);
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])({
                error: true,
                message: error.error.message,
            });
        }));
    }
    getTipoJornada() {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.catalogoUrl}/tipo-jornada`;
        return this.http.get(url);
    }
    getModalidad() {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.catalogoUrl}/tipo-modalidad`;
        return this.http.get(url);
    }
    getClasesContribuyentes() {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.catalogoUrl}/tipo-clase-contribuyente`;
        return this.http.get(url);
    }
    //TODO: DIRECCCION
    postDireccion(data, idEntidad) {
        this.tokenvalido();
        let url = `${this.participeUrl}${_utils_api_service_url_catalogs_TTHH__WEBPACK_IMPORTED_MODULE_5__["ApiUrlCatalogsTTHH"].direccion}/${idEntidad}/direccion`;
        return this.http.post(url, data);
    }
    getDireccionesById(idEntidad) {
        this.tokenvalido();
        let url = `${this.participeUrl}${_utils_api_service_url_catalogs_TTHH__WEBPACK_IMPORTED_MODULE_5__["ApiUrlCatalogsTTHH"].direccion}/${idEntidad}/direcciones`;
        return this.http.get(url);
    }
    updateDireccion(data, idEntidad, idDireccion) {
        this.tokenvalido();
        let url = `${this.participeUrl}${_utils_api_service_url_catalogs_TTHH__WEBPACK_IMPORTED_MODULE_5__["ApiUrlCatalogsTTHH"].direccion}/${idEntidad}/direccion/${idDireccion}`;
        return this.http.put(url, data);
    }
    deleteDireccion(idEntidad, idDireccion) {
        this.tokenvalido();
        let url = `${this.participeUrl}${_utils_api_service_url_catalogs_TTHH__WEBPACK_IMPORTED_MODULE_5__["ApiUrlCatalogsTTHH"].direccion}/${idEntidad}/direccion/${idDireccion}`;
        return this.http.delete(url);
    }
    //TODO:TRANSPORTES
    getTiposVehiculos() {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.catalogoUrl}/tipo-vehiculo`;
        return this.http.get(url);
    }
    getTransportes(id) {
        this.tokenvalido();
        if (!id)
            return;
        let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${id}/vehiculos`;
        return this.http.get(url);
    }
    updateTransporte(data, idColaborador, idVehiculo) {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/vehiculo/${idVehiculo}`;
        return this.http.put(url, data);
    }
    postTransporte(data, idColaborador) {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/vehiculo`;
        return this.http.post(url, data);
    }
    deleteTransporte(idColaborador, idVehiculo) {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/vehiculo/${idVehiculo}`;
        return this.http.delete(url);
    }
    //TODO:CARGAS FAMILIARES
    getTiposParentesco() {
        this.tokenvalido();
        let url = `${this.catalogosUrl}/parentesco`;
        return this.http.get(url);
    }
    getCargasFamiliares(idColaborador) {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/dependientes`;
        return this.http.get(url);
    }
    postCargaFamiliar(data, idColaborador) {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/dependiente`;
        return this.http.post(url, data);
    }
    updateCargaFamiliar(data, idColaborador, idDependiente) {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/dependiente/${idDependiente}`;
        return this.http.put(url, data);
    }
    deleteCargaFamiliar(idColaborador, idCargaFamiliar) {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/dependiente/${idCargaFamiliar}`;
        return this.http.delete(url);
    }
    //TODO:DATOS PERSONALES
    getDatosPersonales(id, idTipoIdentificacion) {
        this.tokenvalido();
        let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]();
        params = idTipoIdentificacion ? params.append("idTipoIdentificacion", String(idTipoIdentificacion)) : params;
        let url = `${this.catalogosUrl}${this.nominaUrl}${this.colaboradorUrl}/identificacion/${id}`;
        return this.http.get(url, { params });
    }
    getIdentificadores() {
        this.tokenvalido();
        let url = `${this.catalogosUrl}/tipos-identificacion`;
        return this.http.get(url);
    }
    getNacionalidades() {
        this.tokenvalido();
        let url = `${this.catalogosUrl}/nacionalidades`;
        return this.http.get(url);
    }
    getEstadosCivil() {
        this.tokenvalido();
        let url = `${this.catalogosUrl}/estado-civil`;
        return this.http.get(url);
    }
    getCertificados() {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.catalogoUrl}/tipo-certificacion`;
        return this.http.get(url);
    }
    getGeneros() {
        this.tokenvalido();
        let url = `${this.catalogosUrl}/genero`;
        return this.http.get(url);
    }
    getTiposDiscapacidad() {
        this.tokenvalido();
        let url = `${this.catalogosUrl}/nomina/tipo-discapacidad`;
        return this.http.get(url);
    }
    //TODO:Referencia bancaria
    getReferenciaBancaria(idColaborador) {
        this.tokenvalido();
        let url = `${this.catalogosUrl}/entidad/${idColaborador}/referencia-bancarias`;
        return this.http.get(url);
    }
    postReferenciaBancaria(data, idColaborador) {
        this.tokenvalido();
        let url = `${this.catalogosUrl}/entidad/${idColaborador}/referencia-bancaria`;
        return this.http.post(url, data);
    }
    updateReferenciaBancaria(data, idColaborador, idReferenciaBancaria) {
        this.tokenvalido();
        let url = `${this.catalogosUrl}/entidad/${idColaborador}/referencia-bancaria/${idReferenciaBancaria}`;
        return this.http.put(url, data);
    }
    deleteReferenciaBancaria(idColaborador, idReferenciaBancaria) {
        this.tokenvalido();
        let url = `${this.catalogosUrl}/entidad/${idColaborador}/referencia-bancaria/${idReferenciaBancaria}`;
        return this.http.delete(url);
    }
    //TODO:REFERENCIA PERSONAL
    getReferenciaPersonal(idColaborador) {
        this.tokenvalido();
        let url = `${this.catalogosUrl}/entidad/${idColaborador}/referencia-personales`;
        return this.http.get(url);
    }
    postReferenciaPersonal(data, idColaborador) {
        this.tokenvalido();
        let url = `${this.catalogosUrl}/entidad/${idColaborador}/referencia-personal`;
        return this.http.post(url, data);
    }
    updateReferenciaPersonal(data, idColaborador, idReferenciaPersonal) {
        this.tokenvalido();
        let url = `${this.catalogosUrl}/entidad/${idColaborador}/referencia-personal/${idReferenciaPersonal}`;
        return this.http.put(url, data);
    }
    deleteReferenciaPersonal(idColaborador, idReferenciaPersonal) {
        this.tokenvalido();
        let url = `${this.catalogosUrl}/entidad/${idColaborador}/referencia-personal/${idReferenciaPersonal}`;
        return this.http.delete(url);
    }
    //TODO:CONTRATO
    guardarInformacionContrato(idColaborador, data) {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/contrato`;
        return this.http.post(url, data);
    }
    getDatosContrato(idColaborador) {
        let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/contratos`;
        return this.http.get(url);
    }
    //TODO:ADJUNTOS
    getAdjuntos(idColaborador, idTipoColaborador) {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/${idColaborador}/plantilla-adjuntos/${idTipoColaborador}`;
        return this.http.get(url);
    }
    //TODO:CARGA BATCH NOMINA
    postCargaBatchIngresoEgreso(data) {
        const fd = new FormData();
        fd.append("request", data);
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.nominatthhUrl}/cargar-batch`;
        return this.http.post(url, fd);
    }
    postGuardarCargaBatchIngresoEgreso(data) {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.nominatthhUrl}/guardar-nomina`;
        return this.http.post(url, data);
    }
    postVerificaCargaBatchIngresoEgreso(data) {
        this.tokenvalido();
        let url = `${this.tthhServiceUrl}${this.nominatthhUrl}/verificar-nomina`;
        return this.http.post(url, data);
    }
    getNominaDetalle(data) {
        this.tokenvalido();
        let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]();
        params = data.code ? params.append("code", String(data.code)) : params;
        params = data.mes ? params.append("mes", String(data.mes)) : params;
        params = data.anio ? params.append("anio", String(data.anio)) : params;
        let url = `${this.tthhServiceUrl}${this.nominatthhUrl}/nomina-detalle`;
        return this.http.get(url, {
            headers: this.httpHeaders,
            params,
        });
    }
    getNominaNoProcesadaReporte(data) {
        this.tokenvalido();
        let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]();
        params = params.append("tipoColaborador", data.tipoColaborador);
        params = params.append("formato", data.formato);
        params = params.append("valido", data.valido);
        params = data.code ? params.append("code", data.code) : params;
        params = data.mes ? params.append("mes", data.mes) : params;
        params = data.anio ? params.append("anio", data.anio) : params;
        let url = `${this.tthhServiceUrl}${this.nominatthhUrl}/reporte-nomina`;
        return this.http.get(url, {
            headers: this.httpHeaders, params
        });
    }
    getPagoNominaReporte(data) {
        this.tokenvalido();
        let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]();
        params = params.append("tipoColaborador", data.tipoColaborador);
        params = params.append("formato", data.formato);
        params = params.append("code", data.code);
        let url = `${this.tthhServiceUrl}${this.nominatthhUrl}/reporte-pago-nomina`;
        return this.http.get(url, {
            headers: this.httpHeaders, params
        });
    }
    //TODO:NOMINA
    getListadoNomina(pagina, size, idTipoColaborador, colaborador) {
        this.tokenvalido();
        let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]();
        params = idTipoColaborador ? params.append("idTipoColaborador", String(idTipoColaborador)) : params;
        params = colaborador ? params.append("colaborador", colaborador) : params;
        params = pagina ? params.append("page", String(pagina)) : params;
        params = size ? params.append("pageSize", String(size)) : params;
        let url = `${this.tthhServiceUrl}${this.colaboradorUrl}/buscador`;
        return this.http.get(url, {
            headers: this.httpHeaders,
            params,
        });
    }
}
TTHHColaboradorService.ɵfac = function TTHHColaboradorService_Factory(t) { return new (t || TTHHColaboradorService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_8__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](src_app_services_local_service__WEBPACK_IMPORTED_MODULE_9__["LocalService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](src_vex_services_navigation_service__WEBPACK_IMPORTED_MODULE_10__["NavigationService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_11__["DomSanitizer"])); };
TTHHColaboradorService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: TTHHColaboradorService, factory: TTHHColaboradorService.ɵfac, providedIn: "root" });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TTHHColaboradorService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
        args: [{
                providedIn: "root",
            }]
    }], function () { return [{ type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_8__["Router"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"] }, { type: src_app_services_local_service__WEBPACK_IMPORTED_MODULE_9__["LocalService"] }, { type: src_vex_services_navigation_service__WEBPACK_IMPORTED_MODULE_10__["NavigationService"] }, { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_11__["DomSanitizer"] }]; }, null); })();


/***/ }),

/***/ "vy7l":
/*!*******************************************************************!*\
  !*** ./src/app/pages/colaboradores/utils/api-service-url-TTHH.ts ***!
  \*******************************************************************/
/*! exports provided: ApiUrlTTHH */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApiUrlTTHH", function() { return ApiUrlTTHH; });
const ApiUrlTTHH = {
    colaborador: "/colaborador",
    catalogos: "/catalogs",
    Participe: "/participes",
    creditosUrl: "/creditos",
    tickets: "/tickets",
    cesantes: "/cesantes",
    reportes: "/reportes",
    Inversiones: "/inversiones",
    contabilidad: "/contabilidad",
    nominaUrl: "/talento-humano",
    comprobantes: "/comprobantes/v1",
    reports: "/reports",
    adjuntos: "/adjuntos",
    nomina: "/nomina",
};


/***/ })

}]);
//# sourceMappingURL=default~pages-colaboradores-colaboradores-routing-module~pages-entidad-entidad-routing-module-es2015.js.map