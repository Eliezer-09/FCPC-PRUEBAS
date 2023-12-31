(function () {
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  (window["webpackJsonp"] = window["webpackJsonp"] || []).push([["default~pages-colaboradores-colaboradores-routing-module~pages-entidad-entidad-routing-module"], {
    /***/
    "427Y":
    /*!****************************************************************************!*\
      !*** ./src/app/pages/colaboradores/utils/api-service-url-catalogs-TTHH.ts ***!
      \****************************************************************************/

    /*! exports provided: ApiUrlCatalogsTTHH */

    /***/
    function Y(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "ApiUrlCatalogsTTHH", function () {
        return ApiUrlCatalogsTTHH;
      });

      var ApiUrlCatalogsTTHH = {
        nomina: "/nomina",
        catalogo: "/catalogo",
        direccion: "/direccion"
      };
      /***/
    },

    /***/
    "I+UP":
    /*!***********************************************************!*\
      !*** ./src/app/pages/entidad/services/entidad.service.ts ***!
      \***********************************************************/

    /*! exports provided: EntidadService */

    /***/
    function IUP(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "EntidadService", function () {
        return EntidadService;
      });
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @auth0/angular-jwt */
      "Nm8O");
      /* harmony import */


      var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/common/http */
      "tk/3");
      /* harmony import */


      var src_app_Shared_Routes_ApiServiceUrl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! src/app/Shared/Routes/ApiServiceUrl */
      "bqWN");
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");
      /* harmony import */


      var src_vex_services_navigation_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! src/@vex/services/navigation.service */
      "0vMP");
      /* harmony import */


      var src_app_services_local_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
      /*! src/app/services/local.service */
      "s3jE");

      var helper = new _auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_1__["JwtHelperService"]();

      var EntidadService = /*#__PURE__*/function () {
        function EntidadService(http, router, ngZone, navigationService, localServiceS) {
          _classCallCheck(this, EntidadService);

          this.http = http;
          this.router = router;
          this.ngZone = ngZone;
          this.navigationService = navigationService;
          this.localServiceS = localServiceS;
          this.catalogoUrl = src_app_Shared_Routes_ApiServiceUrl__WEBPACK_IMPORTED_MODULE_3__["ApiUrl"].catalogos;
          this.nominaUrl = src_app_Shared_Routes_ApiServiceUrl__WEBPACK_IMPORTED_MODULE_3__["ApiUrl"].nominaUrl;
        }

        _createClass(EntidadService, [{
          key: "tokenvalido",
          value: function tokenvalido() {
            if (this.localServiceS.getItem("token")) {
              var token = this.localServiceS.getItem("token");
              var isExpired = helper.isTokenExpired(token);

              if (isExpired) {
                this.logout();
              } else {
                return true;
              }
            }
          }
        }, {
          key: "logout",
          value: function logout() {
            var _this = this;

            this.localServiceS.removeItem("token");
            sessionStorage.removeItem("email");
            this.ngZone.run(function () {
              _this.router.navigateByUrl("/login");

              _this.navigationService.items = [];
            });
          }
        }, {
          key: "getUnidades",
          value: function getUnidades() {
            var term = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
            this.tokenvalido();
            var url = "".concat(this.catalogoUrl, "/nomina/panel-configuracion/obtener/unidades?term=").concat(term);
            return this.http.get(url);
          }
        }, {
          key: "getAreas",
          value: function getAreas(idDepartamento) {
            var term = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
            this.tokenvalido();
            var url = "".concat(this.catalogoUrl, "/nomina/panel-configuracion/obtener/").concat(idDepartamento, "/areas?term=").concat(term);
            return this.http.get(url);
          }
        }, {
          key: "updateAreaSubarea",
          value: function updateAreaSubarea(data, idColaborador, idDependiente) {
            this.tokenvalido();
            var url = "".concat(this.nominaUrl, "/colaborador/").concat(idColaborador, "/dependiente/").concat(idDependiente);
            return this.http.put(url, data);
          }
        }, {
          key: "postAreaSubarea",
          value: function postAreaSubarea(data, idColaborador) {
            this.tokenvalido();
            var url = "".concat(this.nominaUrl, "/colaborador/").concat(idColaborador, "/dependiente");
            return this.http.post(url, data);
          }
        }, {
          key: "getEmpleados",
          value: function getEmpleados() {
            this.tokenvalido();
            var url = "".concat(this.catalogoUrl, "/empleados");
            return this.http.get(url);
          }
        }, {
          key: "guardarUnidad",
          value: function guardarUnidad(data) {
            this.tokenvalido();
            var url = "".concat(this.catalogoUrl, "/nomina/panel-configuracion/unidad");
            return this.http.post(url, data);
          }
        }, {
          key: "guardarArea",
          value: function guardarArea(data) {
            this.tokenvalido();
            var url = "".concat(this.catalogoUrl, "/nomina/panel-configuracion/area");
            return this.http.post(url, data);
          }
        }, {
          key: "eliminarUnidad",
          value: function eliminarUnidad(id) {
            this.tokenvalido();
            var url = "".concat(this.catalogoUrl, "/nomina/panel-configuracion/").concat(id, "/unidad");
            return this.http["delete"](url);
          }
        }, {
          key: "eliminarArea",
          value: function eliminarArea(id) {
            this.tokenvalido();
            var url = "".concat(this.catalogoUrl, "/nomina/panel-configuracion/").concat(id, "/area");
            return this.http["delete"](url);
          }
        }, {
          key: "actualizarUnidad",
          value: function actualizarUnidad(id, data) {
            this.tokenvalido();
            var url = "".concat(this.catalogoUrl, "/nomina/panel-configuracion/modificar/").concat(id, "/unidad");
            return this.http.put(url, data);
          }
        }, {
          key: "actualizarAreaSubarea",
          value: function actualizarAreaSubarea(id, data) {
            this.tokenvalido();
            var url = "".concat(this.catalogoUrl, "/nomina/panel-configuracion/modificar/").concat(id, "/area");
            return this.http.put(url, data);
          }
        }, {
          key: "postCargoSubcargo",
          value: function postCargoSubcargo(data) {
            this.tokenvalido();
            var url = "".concat(this.catalogoUrl, "/nomina/panel-configuracion/cargo");
            return this.http.post(url, data);
          }
        }, {
          key: "actualizaCargoSubcargo",
          value: function actualizaCargoSubcargo(id, data) {
            this.tokenvalido();
            var url = "".concat(this.catalogoUrl, "/nomina/panel-configuracion/modificar/").concat(id, "/cargo");
            return this.http.put(url, data);
          }
        }, {
          key: "eliminarCargoSubcargo",
          value: function eliminarCargoSubcargo(id) {
            this.tokenvalido();
            var url = "".concat(this.catalogoUrl, "/nomina/panel-configuracion/").concat(id, "/cargo");
            return this.http["delete"](url);
          }
        }, {
          key: "getCargosBuscador",
          value: function getCargosBuscador() {
            var term = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
            this.tokenvalido();
            var params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]();
            params = params.append("term", term);
            var url = "".concat(this.catalogoUrl, "/nomina/panel-configuracion/cargos/buscador");
            return this.http.get(url, {
              params: params
            });
          }
        }, {
          key: "getCargos",
          value: function getCargos() {
            var term = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
            this.tokenvalido();
            var params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]();
            params = params.append("term", term);
            var url = "".concat(this.catalogoUrl, "/nomina/panel-configuracion/cargos");
            return this.http.get(url, {
              params: params
            });
          }
        }]);

        return EntidadService;
      }();

      EntidadService.ɵfac = function EntidadService_Factory(t) {
        return new (t || EntidadService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](src_vex_services_navigation_service__WEBPACK_IMPORTED_MODULE_5__["NavigationService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](src_app_services_local_service__WEBPACK_IMPORTED_MODULE_6__["LocalService"]));
      };

      EntidadService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
        token: EntidadService,
        factory: EntidadService.ɵfac,
        providedIn: "root"
      });
      /*@__PURE__*/

      (function () {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](EntidadService, [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
          args: [{
            providedIn: "root"
          }]
        }], function () {
          return [{
            type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]
          }, {
            type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]
          }, {
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]
          }, {
            type: src_vex_services_navigation_service__WEBPACK_IMPORTED_MODULE_5__["NavigationService"]
          }, {
            type: src_app_services_local_service__WEBPACK_IMPORTED_MODULE_6__["LocalService"]
          }];
        }, null);
      })();
      /***/

    },

    /***/
    "TDBg":
    /*!**************************************************************************!*\
      !*** ./src/app/pages/colaboradores/services/tthh-colaborador.service.ts ***!
      \**************************************************************************/

    /*! exports provided: TTHHColaboradorService */

    /***/
    function TDBg(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "TTHHColaboradorService", function () {
        return TTHHColaboradorService;
      });
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @auth0/angular-jwt */
      "Nm8O");
      /* harmony import */


      var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/common/http */
      "tk/3");
      /* harmony import */


      var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! rxjs */
      "qCKp");
      /* harmony import */


      var src_app_Shared_Routes_ApiServiceUrl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! src/app/Shared/Routes/ApiServiceUrl */
      "bqWN");
      /* harmony import */


      var _utils_api_service_url_catalogs_TTHH__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! ../utils/api-service-url-catalogs-TTHH */
      "427Y");
      /* harmony import */


      var _utils_api_service_url_TTHH__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
      /*! ../utils/api-service-url-TTHH */
      "vy7l");
      /* harmony import */


      var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
      /*! rxjs/operators */
      "kU1M");
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");
      /* harmony import */


      var src_app_services_local_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
      /*! src/app/services/local.service */
      "s3jE");
      /* harmony import */


      var src_vex_services_navigation_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
      /*! src/@vex/services/navigation.service */
      "0vMP");
      /* harmony import */


      var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
      /*! @angular/platform-browser */
      "jhN1");

      var helper = new _auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_1__["JwtHelperService"]();

      var TTHHColaboradorService = /*#__PURE__*/function () {
        function TTHHColaboradorService(http, router, ngZone, localServiceS, navigationService, dom) {
          _classCallCheck(this, TTHHColaboradorService);

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
            ApiKey: "E704B2FF-6C48-4C3D-88B6-C4B623DCDD4D"
          };
          this.messageSource = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"]("default message");
          this.currentMessage$ = this.messageSource.asObservable();
        }

        _createClass(TTHHColaboradorService, [{
          key: "changeMessage",
          value: function changeMessage(message) {
            this.messageSource.next(message);
          } // TOKEN

        }, {
          key: "tokenvalido",
          value: function tokenvalido() {
            if (this.localServiceS.getItem("token")) {
              var token = this.localServiceS.getItem("token");
              var isExpired = helper.isTokenExpired(token);

              if (isExpired) {
                this.logout();
              } else {
                return true;
              }
            }
          }
        }, {
          key: "logout",
          value: function logout() {
            var _this2 = this;

            this.localServiceS.removeItem("token");
            sessionStorage.removeItem("email");
            this.ngZone.run(function () {
              _this2.router.navigateByUrl("/login");

              _this2.navigationService.items = [];
            });
          } //TODO: COLABORADORES TTHH

        }, {
          key: "loadColaboradores",
          value: function loadColaboradores(idTipoColaborador, pagina, size, termino) {
            this.tokenvalido();
            var params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]();
            params = params.append("idTipoColaborador", idTipoColaborador);
            params = termino ? params.append("term", termino) : params;
            params = pagina ? params.append("page", String(pagina)) : params;
            params = size ? params.append("pageSize", String(size)) : params;
            return this.http.get("".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/listado-colaboradores/colaboradores"), {
              headers: this.httpHeaders,
              params: params
            });
          }
        }, {
          key: "loadColaboradorId",
          value: function loadColaboradorId(id) {
            this.tokenvalido();
            var params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]();
            params = id ? params.append("id", id) : params;
            return this.http.get("".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/listado-colaboradores/colaboradores"), {
              headers: this.httpHeaders,
              params: params
            });
          }
        }, {
          key: "putInformacionLaboral",
          value: function putInformacionLaboral(idColaborador, data) {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/informacion-laboral/").concat(idColaborador, "/colaborador");
            return this.http.put(url, data);
          } //PROCESO DE SELECCION

        }, {
          key: "postProcesoSeleccion",
          value: function postProcesoSeleccion(idColaborador, data) {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/proceso-seleccion/").concat(idColaborador, "/colaborador");
            return this.http.put(url, data);
          }
        }, {
          key: "postColaborador",
          value: function postColaborador(data) {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/datos-colaborador");
            return this.http.post(url, data);
          } //TODO: FORMACION ACADEMICA TTHH
          //reparar

        }, {
          key: "guardarDatosFormacionAcademica",
          value: function guardarDatosFormacionAcademica(id, idFormacionAcademica, data) {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/").concat(id, "/formacion-academica/").concat(idFormacionAcademica);
            return this.http.put(url, data);
          }
        }, {
          key: "getFormacionAcademica",
          value: function getFormacionAcademica(id) {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/").concat(id, "/formacion-academica");
            return this.http.get(url);
          }
        }, {
          key: "postFormacionAcademica",
          value: function postFormacionAcademica(data, idColaborador) {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/").concat(idColaborador, "/formacion-academica");
            return this.http.post(url, data);
          }
        }, {
          key: "updateFormacionAcademica",
          value: function updateFormacionAcademica(data, idColaborador, idFormacionAcademica) {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/").concat(idColaborador, "/formacion-academica/").concat(idFormacionAcademica);
            return this.http.put(url, data);
          }
        }, {
          key: "deleteFormacionAcademica",
          value: function deleteFormacionAcademica(idColaborador, idFormacionAcademica) {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/").concat(idColaborador, "/formacion-academica/").concat(idFormacionAcademica);
            return this.http["delete"](url);
          }
        }, {
          key: "updateUltimaCulminadaFormacionAcademica",
          value: function updateUltimaCulminadaFormacionAcademica(data, idColaborador, idFormacionAcademica) {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/").concat(idColaborador, "/formacion-culminada/").concat(idFormacionAcademica);
            return this.http.put(url, data);
          } //REFERENCIA BANCARIA

        }, {
          key: "guardarDatosReferenciaBancaria",
          value: function guardarDatosReferenciaBancaria(id, data) {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/cuenta-banco/").concat(id, "/colaborador");
            return this.http.put(url, data);
          } //Todo: contactos
          //CONTACTO

        }, {
          key: "getContactos",
          value: function getContactos(id) {
            this.tokenvalido();
            var url = "".concat(this.catalogosUrl, "/contacto").concat(this.colaboradorUrl, "/").concat(id, "/contactos");
            return this.http.get(url);
          }
        }, {
          key: "postContacto",
          value: function postContacto(data, idColaborador) {
            this.tokenvalido();
            var url = "".concat(this.catalogosUrl, "/contacto").concat(this.colaboradorUrl, "/").concat(idColaborador, "/contacto");
            return this.http.post(url, data);
          }
        }, {
          key: "updateContacto",
          value: function updateContacto(data, idColaborador, idContacto) {
            this.tokenvalido();
            var url = "".concat(this.catalogosUrl, "/contacto").concat(this.colaboradorUrl, "/").concat(idColaborador, "/contacto/").concat(idContacto);
            return this.http.put(url, data);
          }
        }, {
          key: "deleteContacto",
          value: function deleteContacto(idColaborador, idContacto) {
            this.tokenvalido();
            var url = "".concat(this.catalogosUrl, "/contacto").concat(this.colaboradorUrl, "/").concat(idColaborador, "/contacto/").concat(idContacto);
            return this.http["delete"](url);
          }
        }, {
          key: "postDatosPersonales",
          value: function postDatosPersonales(data) {
            this.tokenvalido();
            var url = "".concat(this.catalogosUrl).concat(this.nominaUrl).concat(this.colaboradorUrl, "/datos-personales");
            return this.http.post(url, data);
          } //NO USADO

        }, {
          key: "loadSupervisoresInmediatos",
          value: function loadSupervisoresInmediatos() {
            this.tokenvalido();
            return this.http.get("".concat(this.catalogosUrl).concat(this.nominaUrl).concat(this.colaboradorUrl, "/supervisores-inmediatos"), {
              headers: this.httpHeaders
            });
          } //NO USADO

        }, {
          key: "loadJefesInmediatos",
          value: function loadJefesInmediatos() {
            this.tokenvalido();
            return this.http.get("".concat(this.catalogosUrl).concat(this.nominaUrl).concat(this.colaboradorUrl, "/jefes-inmediatos"), {
              headers: this.httpHeaders
            });
          } //TODO: CATALOGO COLABORADORES

        }, {
          key: "loadColaboradoresData",
          value: function loadColaboradoresData(colaboradoresIds, pagina, size) {
            this.tokenvalido();
            var params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]();
            params = pagina ? params.append("page", String(pagina)) : params;
            params = size ? params.append("pageSize", String(size)) : params;
            return this.http.post("".concat(this.catalogosUrl).concat(this.nominaUrl).concat(this.colaboradorUrl, "/lista-entidades"), colaboradoresIds, {
              headers: this.httpHeaders,
              params: params
            }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["catchError"])(function (error) {
              console.log("Se produjo un error:", error);
              return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])({
                error: true,
                message: error.error.message
              });
            }));
          }
        }, {
          key: "getTipoJornada",
          value: function getTipoJornada() {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.catalogoUrl, "/tipo-jornada");
            return this.http.get(url);
          }
        }, {
          key: "getModalidad",
          value: function getModalidad() {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.catalogoUrl, "/tipo-modalidad");
            return this.http.get(url);
          }
        }, {
          key: "getClasesContribuyentes",
          value: function getClasesContribuyentes() {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.catalogoUrl, "/tipo-clase-contribuyente");
            return this.http.get(url);
          } //TODO: DIRECCCION

        }, {
          key: "postDireccion",
          value: function postDireccion(data, idEntidad) {
            this.tokenvalido();
            var url = "".concat(this.participeUrl).concat(_utils_api_service_url_catalogs_TTHH__WEBPACK_IMPORTED_MODULE_5__["ApiUrlCatalogsTTHH"].direccion, "/").concat(idEntidad, "/direccion");
            return this.http.post(url, data);
          }
        }, {
          key: "getDireccionesById",
          value: function getDireccionesById(idEntidad) {
            this.tokenvalido();
            var url = "".concat(this.participeUrl).concat(_utils_api_service_url_catalogs_TTHH__WEBPACK_IMPORTED_MODULE_5__["ApiUrlCatalogsTTHH"].direccion, "/").concat(idEntidad, "/direcciones");
            return this.http.get(url);
          }
        }, {
          key: "updateDireccion",
          value: function updateDireccion(data, idEntidad, idDireccion) {
            this.tokenvalido();
            var url = "".concat(this.participeUrl).concat(_utils_api_service_url_catalogs_TTHH__WEBPACK_IMPORTED_MODULE_5__["ApiUrlCatalogsTTHH"].direccion, "/").concat(idEntidad, "/direccion/").concat(idDireccion);
            return this.http.put(url, data);
          }
        }, {
          key: "deleteDireccion",
          value: function deleteDireccion(idEntidad, idDireccion) {
            this.tokenvalido();
            var url = "".concat(this.participeUrl).concat(_utils_api_service_url_catalogs_TTHH__WEBPACK_IMPORTED_MODULE_5__["ApiUrlCatalogsTTHH"].direccion, "/").concat(idEntidad, "/direccion/").concat(idDireccion);
            return this.http["delete"](url);
          } //TODO:TRANSPORTES

        }, {
          key: "getTiposVehiculos",
          value: function getTiposVehiculos() {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.catalogoUrl, "/tipo-vehiculo");
            return this.http.get(url);
          }
        }, {
          key: "getTransportes",
          value: function getTransportes(id) {
            this.tokenvalido();
            if (!id) return;
            var url = "".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/").concat(id, "/vehiculos");
            return this.http.get(url);
          }
        }, {
          key: "updateTransporte",
          value: function updateTransporte(data, idColaborador, idVehiculo) {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/").concat(idColaborador, "/vehiculo/").concat(idVehiculo);
            return this.http.put(url, data);
          }
        }, {
          key: "postTransporte",
          value: function postTransporte(data, idColaborador) {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/").concat(idColaborador, "/vehiculo");
            return this.http.post(url, data);
          }
        }, {
          key: "deleteTransporte",
          value: function deleteTransporte(idColaborador, idVehiculo) {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/").concat(idColaborador, "/vehiculo/").concat(idVehiculo);
            return this.http["delete"](url);
          } //TODO:CARGAS FAMILIARES

        }, {
          key: "getTiposParentesco",
          value: function getTiposParentesco() {
            this.tokenvalido();
            var url = "".concat(this.catalogosUrl, "/parentesco");
            return this.http.get(url);
          }
        }, {
          key: "getCargasFamiliares",
          value: function getCargasFamiliares(idColaborador) {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/").concat(idColaborador, "/dependientes");
            return this.http.get(url);
          }
        }, {
          key: "postCargaFamiliar",
          value: function postCargaFamiliar(data, idColaborador) {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/").concat(idColaborador, "/dependiente");
            return this.http.post(url, data);
          }
        }, {
          key: "updateCargaFamiliar",
          value: function updateCargaFamiliar(data, idColaborador, idDependiente) {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/").concat(idColaborador, "/dependiente/").concat(idDependiente);
            return this.http.put(url, data);
          }
        }, {
          key: "deleteCargaFamiliar",
          value: function deleteCargaFamiliar(idColaborador, idCargaFamiliar) {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/").concat(idColaborador, "/dependiente/").concat(idCargaFamiliar);
            return this.http["delete"](url);
          } //TODO:DATOS PERSONALES

        }, {
          key: "getDatosPersonales",
          value: function getDatosPersonales(id, idTipoIdentificacion) {
            this.tokenvalido();
            var params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]();
            params = idTipoIdentificacion ? params.append("idTipoIdentificacion", String(idTipoIdentificacion)) : params;
            var url = "".concat(this.catalogosUrl).concat(this.nominaUrl).concat(this.colaboradorUrl, "/identificacion/").concat(id);
            return this.http.get(url, {
              params: params
            });
          }
        }, {
          key: "getIdentificadores",
          value: function getIdentificadores() {
            this.tokenvalido();
            var url = "".concat(this.catalogosUrl, "/tipos-identificacion");
            return this.http.get(url);
          }
        }, {
          key: "getNacionalidades",
          value: function getNacionalidades() {
            this.tokenvalido();
            var url = "".concat(this.catalogosUrl, "/nacionalidades");
            return this.http.get(url);
          }
        }, {
          key: "getEstadosCivil",
          value: function getEstadosCivil() {
            this.tokenvalido();
            var url = "".concat(this.catalogosUrl, "/estado-civil");
            return this.http.get(url);
          }
        }, {
          key: "getCertificados",
          value: function getCertificados() {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.catalogoUrl, "/tipo-certificacion");
            return this.http.get(url);
          }
        }, {
          key: "getGeneros",
          value: function getGeneros() {
            this.tokenvalido();
            var url = "".concat(this.catalogosUrl, "/genero");
            return this.http.get(url);
          }
        }, {
          key: "getTiposDiscapacidad",
          value: function getTiposDiscapacidad() {
            this.tokenvalido();
            var url = "".concat(this.catalogosUrl, "/nomina/tipo-discapacidad");
            return this.http.get(url);
          } //TODO:Referencia bancaria

        }, {
          key: "getReferenciaBancaria",
          value: function getReferenciaBancaria(idColaborador) {
            this.tokenvalido();
            var url = "".concat(this.catalogosUrl, "/entidad/").concat(idColaborador, "/referencia-bancarias");
            return this.http.get(url);
          }
        }, {
          key: "postReferenciaBancaria",
          value: function postReferenciaBancaria(data, idColaborador) {
            this.tokenvalido();
            var url = "".concat(this.catalogosUrl, "/entidad/").concat(idColaborador, "/referencia-bancaria");
            return this.http.post(url, data);
          }
        }, {
          key: "updateReferenciaBancaria",
          value: function updateReferenciaBancaria(data, idColaborador, idReferenciaBancaria) {
            this.tokenvalido();
            var url = "".concat(this.catalogosUrl, "/entidad/").concat(idColaborador, "/referencia-bancaria/").concat(idReferenciaBancaria);
            return this.http.put(url, data);
          }
        }, {
          key: "deleteReferenciaBancaria",
          value: function deleteReferenciaBancaria(idColaborador, idReferenciaBancaria) {
            this.tokenvalido();
            var url = "".concat(this.catalogosUrl, "/entidad/").concat(idColaborador, "/referencia-bancaria/").concat(idReferenciaBancaria);
            return this.http["delete"](url);
          } //TODO:REFERENCIA PERSONAL

        }, {
          key: "getReferenciaPersonal",
          value: function getReferenciaPersonal(idColaborador) {
            this.tokenvalido();
            var url = "".concat(this.catalogosUrl, "/entidad/").concat(idColaborador, "/referencia-personales");
            return this.http.get(url);
          }
        }, {
          key: "postReferenciaPersonal",
          value: function postReferenciaPersonal(data, idColaborador) {
            this.tokenvalido();
            var url = "".concat(this.catalogosUrl, "/entidad/").concat(idColaborador, "/referencia-personal");
            return this.http.post(url, data);
          }
        }, {
          key: "updateReferenciaPersonal",
          value: function updateReferenciaPersonal(data, idColaborador, idReferenciaPersonal) {
            this.tokenvalido();
            var url = "".concat(this.catalogosUrl, "/entidad/").concat(idColaborador, "/referencia-personal/").concat(idReferenciaPersonal);
            return this.http.put(url, data);
          }
        }, {
          key: "deleteReferenciaPersonal",
          value: function deleteReferenciaPersonal(idColaborador, idReferenciaPersonal) {
            this.tokenvalido();
            var url = "".concat(this.catalogosUrl, "/entidad/").concat(idColaborador, "/referencia-personal/").concat(idReferenciaPersonal);
            return this.http["delete"](url);
          } //TODO:CONTRATO

        }, {
          key: "guardarInformacionContrato",
          value: function guardarInformacionContrato(idColaborador, data) {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/").concat(idColaborador, "/contrato");
            return this.http.post(url, data);
          }
        }, {
          key: "getDatosContrato",
          value: function getDatosContrato(idColaborador) {
            var url = "".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/").concat(idColaborador, "/contratos");
            return this.http.get(url);
          } //TODO:ADJUNTOS

        }, {
          key: "getAdjuntos",
          value: function getAdjuntos(idColaborador, idTipoColaborador) {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/").concat(idColaborador, "/plantilla-adjuntos/").concat(idTipoColaborador);
            return this.http.get(url);
          } //TODO:CARGA BATCH NOMINA

        }, {
          key: "postCargaBatchIngresoEgreso",
          value: function postCargaBatchIngresoEgreso(data) {
            var fd = new FormData();
            fd.append("request", data);
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.nominatthhUrl, "/cargar-batch");
            return this.http.post(url, fd);
          }
        }, {
          key: "postGuardarCargaBatchIngresoEgreso",
          value: function postGuardarCargaBatchIngresoEgreso(data) {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.nominatthhUrl, "/guardar-nomina");
            return this.http.post(url, data);
          }
        }, {
          key: "postVerificaCargaBatchIngresoEgreso",
          value: function postVerificaCargaBatchIngresoEgreso(data) {
            this.tokenvalido();
            var url = "".concat(this.tthhServiceUrl).concat(this.nominatthhUrl, "/verificar-nomina");
            return this.http.post(url, data);
          }
        }, {
          key: "getNominaDetalle",
          value: function getNominaDetalle(data) {
            this.tokenvalido();
            var params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]();
            params = data.code ? params.append("code", String(data.code)) : params;
            params = data.mes ? params.append("mes", String(data.mes)) : params;
            params = data.anio ? params.append("anio", String(data.anio)) : params;
            var url = "".concat(this.tthhServiceUrl).concat(this.nominatthhUrl, "/nomina-detalle");
            return this.http.get(url, {
              headers: this.httpHeaders,
              params: params
            });
          }
        }, {
          key: "getNominaNoProcesadaReporte",
          value: function getNominaNoProcesadaReporte(data) {
            this.tokenvalido();
            var params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]();
            params = params.append("tipoColaborador", data.tipoColaborador);
            params = params.append("formato", data.formato);
            params = params.append("valido", data.valido);
            params = data.code ? params.append("code", data.code) : params;
            params = data.mes ? params.append("mes", data.mes) : params;
            params = data.anio ? params.append("anio", data.anio) : params;
            var url = "".concat(this.tthhServiceUrl).concat(this.nominatthhUrl, "/reporte-nomina");
            return this.http.get(url, {
              headers: this.httpHeaders,
              params: params
            });
          }
        }, {
          key: "getPagoNominaReporte",
          value: function getPagoNominaReporte(data) {
            this.tokenvalido();
            var params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]();
            params = params.append("tipoColaborador", data.tipoColaborador);
            params = params.append("formato", data.formato);
            params = params.append("code", data.code);
            var url = "".concat(this.tthhServiceUrl).concat(this.nominatthhUrl, "/reporte-pago-nomina");
            return this.http.get(url, {
              headers: this.httpHeaders,
              params: params
            });
          } //TODO:NOMINA

        }, {
          key: "getListadoNomina",
          value: function getListadoNomina(pagina, size, idTipoColaborador, colaborador) {
            this.tokenvalido();
            var params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]();
            params = idTipoColaborador ? params.append("idTipoColaborador", String(idTipoColaborador)) : params;
            params = colaborador ? params.append("colaborador", colaborador) : params;
            params = pagina ? params.append("page", String(pagina)) : params;
            params = size ? params.append("pageSize", String(size)) : params;
            var url = "".concat(this.tthhServiceUrl).concat(this.colaboradorUrl, "/buscador");
            return this.http.get(url, {
              headers: this.httpHeaders,
              params: params
            });
          }
        }]);

        return TTHHColaboradorService;
      }();

      TTHHColaboradorService.ɵfac = function TTHHColaboradorService_Factory(t) {
        return new (t || TTHHColaboradorService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_8__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](src_app_services_local_service__WEBPACK_IMPORTED_MODULE_9__["LocalService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](src_vex_services_navigation_service__WEBPACK_IMPORTED_MODULE_10__["NavigationService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_11__["DomSanitizer"]));
      };

      TTHHColaboradorService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
        token: TTHHColaboradorService,
        factory: TTHHColaboradorService.ɵfac,
        providedIn: "root"
      });
      /*@__PURE__*/

      (function () {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TTHHColaboradorService, [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
          args: [{
            providedIn: "root"
          }]
        }], function () {
          return [{
            type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]
          }, {
            type: _angular_router__WEBPACK_IMPORTED_MODULE_8__["Router"]
          }, {
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]
          }, {
            type: src_app_services_local_service__WEBPACK_IMPORTED_MODULE_9__["LocalService"]
          }, {
            type: src_vex_services_navigation_service__WEBPACK_IMPORTED_MODULE_10__["NavigationService"]
          }, {
            type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_11__["DomSanitizer"]
          }];
        }, null);
      })();
      /***/

    },

    /***/
    "vy7l":
    /*!*******************************************************************!*\
      !*** ./src/app/pages/colaboradores/utils/api-service-url-TTHH.ts ***!
      \*******************************************************************/

    /*! exports provided: ApiUrlTTHH */

    /***/
    function vy7l(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "ApiUrlTTHH", function () {
        return ApiUrlTTHH;
      });

      var ApiUrlTTHH = {
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
        nomina: "/nomina"
      };
      /***/
    }
  }]);
})();
//# sourceMappingURL=default~pages-colaboradores-colaboradores-routing-module~pages-entidad-entidad-routing-module-es5.js.map