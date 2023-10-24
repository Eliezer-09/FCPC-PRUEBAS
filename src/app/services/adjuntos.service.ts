import { Injectable } from "@angular/core";
import { ComponentesService } from "src/app/services/componentes.service";
import { DataService } from "src/app/services/data.service";
import { TiposAdjunto } from "src/@vex/interfaces/enums";
import { CreditosService } from "../pages/creditos/creditos.service";
import { AuthService } from "../pages/auth/auth.service";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { Observable, of, throwError } from "rxjs";
import { PostAdjunto } from "../model/models";

@Injectable({
  providedIn: "root",
})
export class AdjuntosService {
  constructor(
    private dataService: DataService,
    private creditosService: CreditosService,
    private authService: AuthService
  ) {}

  //TODO: CEDULA FRONTAL

  adjuntarCedulaFrontal(action, file, idEntidad): Observable<any> {
    if (file.adjunto) {
      let data = {
        name: file.name,
        mimeType: file.mimeType,
        adjunto: file.adjunto,
        tipoAdjunto: TiposAdjunto.cedulaFrontal,
      };
      if (action == "POST") {
        return this.dataService.newPostAdjunto(data, idEntidad).pipe(
          catchError((error) => {
            console.log("Se produjo un error:", error);
            return of({
              error: true,
              message: "Ocurrió un error al adjuntar la cédula frontal",
            });
          })
        );
      }

      if (action == "PUT") {
        return this.dataService
          .updateAdjunto(idEntidad, file.idAdjunto, data)
          .pipe(
            catchError((error) => {
              console.log("Se produjo un error:", error);
              return of({
                error: true,
                message: "Ocurrió un error al actualizar la cédula frontal",
              });
            })
          );
      }
    } else {
      return of({});
    }
  }

  adjuntarCedulaPosterior(action, file, idEntidad): Observable<any> {
    if (file.adjunto) {
      let data = {
        name: file.name,
        mimeType: file.mimeType,
        adjunto: file.adjunto,
        tipoAdjunto: TiposAdjunto.cedulaPosterior,
      };

      if (action == "POST") {
        return this.dataService.newPostAdjunto(data, idEntidad).pipe(
          catchError((error) => {
            console.log("Se produjo un error:", error);
            return of({
              error: true,
              message: "Ocurrió un error al adjuntar la cédula posterior",
            });
          })
        );
      }

      if (action == "PUT") {
        return this.dataService
          .updateAdjunto(idEntidad, file.idAdjunto, data)
          .pipe(
            catchError((error) => {
              console.log("Se produjo un error:", error);
              return of({
                error: true,
                message: "Ocurrió un error al actualizar la cédula posterior",
              });
            })
          );
      }
    } else {
      return of({});
    }
  }

  adjuntarCedulaFrontalGarante(
    action,
    file,
    idEntidad,
    idPrestamo
  ): Observable<any> {
    if (file.adjunto) {
      let data = {
        name: file.name,
        mimeType: file.mimeType,
        adjunto: file.adjunto,
        tipoAdjunto: TiposAdjunto.cedulaFrontal,
        idPrestamo: idPrestamo,
      };
      if (action == "POST") {
        return this.dataService.newPostAdjunto(data, idEntidad).pipe(
          catchError((error) => {
            console.log("Se produjo un error:", error);
            return of({
              error: true,
              message: "Ocurrió un error al adjuntar la cédula frontal",
            });
          })
        );
      }

      if (action == "PUT") {
        return this.dataService
          .updateAdjunto(idEntidad, file.idAdjunto, data)
          .pipe(
            catchError((error) => {
              console.log("Se produjo un error:", error);
              return of({
                error: true,
                message: "Ocurrió un error al actualizar la cédula frontal",
              });
            })
          );
      }
    } else {
      return of({});
    }
  }


  updateEntidadCedulasGarante(
    file,
    idEntidad,
    tipoAdjunto
  ): Observable<any> {
    if (file.adjunto) {
      let data = {
        name: file.name,
        mimeType: file.mimeType,
        adjunto: file.adjunto,
        tipoAdjunto: tipoAdjunto,
      };
   
      return this.dataService.newGetAdjuntoById(idEntidad,data.tipoAdjunto).pipe(
          catchError((error) => {
            console.log("Se produjo un error:", error);
            const messageAdjunto=tipoAdjunto==TiposAdjunto.cedulaPosterior?'posterior':'frontal'
            return of({
              error: true,
              message: "Ocurrió un error al obtener la cédula "+ messageAdjunto,
            });
          })
        ).pipe(
  
          switchMap((res) => {
            let file=res["result"]
            file = file.length>0?file.filter((x) => x.idPrestamo == null):[];
            if(file.length>0){
              return this.dataService
              .updateAdjunto(idEntidad, file[0].idAdjunto, data)
              .pipe(
                catchError((error) => {
                  console.log("Se produjo un error:", error);
                  const messageAdjunto=tipoAdjunto==TiposAdjunto.cedulaPosterior?'posterior':'frontal'
                  return of({
                    error: true,
                    message: "Ocurrió un error al actualizar la cédula "+messageAdjunto,
                  });
                })
              );
            }
          })
        
        );
    
    } else {
      return of({});
    }
  }
 
  //TODO: CEDULA POSTERIOR
  adjuntarCedulaPosteriorGarante(
    action,
    file,
    idEntidad,
    idPrestamo
  ): Observable<any> {
    if (file.adjunto) {
      let data = {
        name: file.name,
        mimeType: file.mimeType,
        adjunto: file.adjunto,
        tipoAdjunto: TiposAdjunto.cedulaPosterior,
        idPrestamo: idPrestamo,
      };

      if (action == "POST") {
        return this.dataService.newPostAdjunto(data, idEntidad).pipe(
          catchError((error) => {
            console.log("Se produjo un error:", error);
            return of({
              error: true,
              message: "Ocurrió un error al adjuntar la cédula posterior",
            });
          })
        );
      }

      if (action == "PUT") {
        return this.dataService
          .updateAdjunto(idEntidad, file.idAdjunto, data)
          .pipe(
            catchError((error) => {
              console.log("Se produjo un error:", error);
              return of({
                error: true,
                message: "Ocurrió un error al actualizar la cédula posterior",
              });
            })
          );
      }
    } else {
      return of({});
    }
  }

  //TODO: ROL GARANTE

  adjuntarRolGarante(action, file, idEntidad, idPrestamo): Observable<any> {
    if (file.adjunto) {
      let data = {
        name: file.name,
        mimeType: file.mimeType,
        adjunto: file.adjunto,
        tipoAdjunto: TiposAdjunto.rolGarante,
        idPrestamo: idPrestamo,
      };
      if (action == "POST") {
        return this.dataService.newPostAdjunto(data, idEntidad).pipe(
          catchError((error) => {
            console.log("Se produjo un error:", error);
            return of({
              error: true,
              message:
                "Ocurrió un error al adjuntar el rol de pago del garante",
            });
          })
        );
      }

      if (action == "PUT") {
        return this.dataService
          .updateAdjunto(idEntidad, file.idAdjunto, data)
          .pipe(
            catchError((error) => {
              console.log("Se produjo un error:", error);
              return of({
                error: true,
                message:
                  "Ocurrió un error al actualizar el rol de pago del garante",
              });
            })
          );
      }
    } else {
      return of({});
    }
  }

  //TODO: CEDULA FRONTAL CONYUGE

  adjuntarCedulaFrontalConyuge(
    action,
    file,
    idEntidad,
    idPrestamo
  ): Observable<any> {
    if (file.adjunto) {
      let data = {
        name: file.name,
        mimeType: file.mimeType,
        adjunto: file.adjunto,
        tipoAdjunto: TiposAdjunto.CedulaConyugeFrontal,
        idPrestamo: idPrestamo,
      };

      if (action == "POST") {
        return this.dataService.newPostAdjunto(data, idEntidad).pipe(
          catchError((error) => {
            console.log("Se produjo un error:", error);
            return of({
              error: true,
              message:
                "Ocurrió un error al adjuntar la cédula frontal del conyugue",
            });
          })
        );
      }

      if (action == "PUT") {
        return this.dataService
          .updateAdjunto(idEntidad, file.idAdjunto, data)
          .pipe(
            catchError((error) => {
              console.log("Se produjo un error:", error);
              return of({
                error: true,
                message:
                  "Ocurrió un error al actualizar la cédula frontal del conyugue",
              });
            })
          );
      }
    } else {
      return of({});
    }
  }

  adjuntarCedulaPosteriorConyuge(
    action,
    file,
    idEntidad,
    idPrestamo
  ): Observable<any> {
    if (file.adjunto) {
      let data = {
        name: file.name,
        mimeType: file.mimeType,
        adjunto: file.adjunto,
        tipoAdjunto: TiposAdjunto.CedulaConyugePosterior,
        idPrestamo: idPrestamo,
      };

      if (action == "POST") {
        return this.dataService.newPostAdjunto(data, idEntidad).pipe(
          catchError((error) => {
            console.log("Se produjo un error:", error);
            return of({
              error: true,
              message:
                "Ocurrió un error al adjuntar la cédula posterior del conyugue",
            });
          })
        );
      }

      if (action == "PUT") {
        return this.dataService
          .updateAdjunto(idEntidad, file.idAdjunto, data)
          .pipe(
            catchError((error) => {
              console.log("Se produjo un error:", error);
              return of({
                error: true,
                message:
                  "Ocurrió un error al actualizar la cédula posterior del conyugue",
              });
            })
          );
      }
    } else {
      return of({});
    }
  }

  adjuntarRegistroPropiedad(
    action,
    file,
    idEntidad,
    idPrestamo
  ): Observable<any> {
    if (file.adjunto) {
      let data = {
        name: file.name,
        mimeType: file.mimeType,
        adjunto: file.adjunto,
        tipoAdjunto: TiposAdjunto.RegistroPropiedad,
        idPrestamo: idPrestamo,
      };

      if (action == "POST") {
        return this.dataService.newPostAdjunto(data, idEntidad).pipe(
          catchError((error) => {
            console.log("Se produjo un error:", error);
            return of({
              error: true,
              message: "Ocurrió un error al adjuntar el registro de propiedad",
            });
          })
        );
      }

      if (action == "PUT") {
        return this.dataService
          .updateAdjunto(idEntidad, file.idAdjunto, data)
          .pipe(
            catchError((error) => {
              console.log("Se produjo un error:", error);
              return of({
                error: true,
                message:
                  "Ocurrió un error al actualizar el registro de propiedad",
              });
            })
          );
      }
    } else {
      return of({});
    }
  }

  adjuntarCertificadoPredio(
    action,
    file,
    idEntidad,
    idPrestamo
  ): Observable<any> {
    if (file.adjunto) {
      let data = {
        name: file.name,
        mimeType: file.mimeType,
        adjunto: file.adjunto,
        tipoAdjunto: TiposAdjunto.CertificadoPredio,
        idPrestamo: idPrestamo,
      };

      if (action == "POST") {
        return this.dataService.newPostAdjunto(data, idEntidad).pipe(
          catchError((error) => {
            console.log("Se produjo un error:", error);
            return of({
              error: true,
              message: "Ocurrió un error al adjuntar el certificado predio",
            });
          })
        );
      }

      if (action == "PUT") {
        return this.dataService
          .updateAdjunto(idEntidad, file.idAdjunto, data)
          .pipe(
            catchError((error) => {
              console.log("Se produjo un error:", error);
              return of({
                error: true,
                message: "Ocurrió un error al actualizar el certificado predio",
              });
            })
          );
      }
    } else {
      return of({});
    }
  }

  adjuntarCroquis(action, file, idEntidad, idPrestamo): Observable<any> {
    if (file.adjunto) {
      let data = {
        name: file.name,
        mimeType: file.mimeType,
        adjunto: file.adjunto,
        tipoAdjunto: TiposAdjunto.croquis,
        idPrestamo: idPrestamo,
      };

      if (action == "POST") {
        return this.dataService.newPostAdjunto(data, idEntidad).pipe(
          catchError((error) => {
            console.log("Se produjo un error:", error);
            return of({
              error: true,
              message: "Ocurrió un error al adjuntar el croquis",
            });
          })
        );
      }

      if (action == "PUT") {
        return this.dataService
          .updateAdjunto(idEntidad, file.idAdjunto, data)
          .pipe(
            catchError((error) => {
              console.log("Se produjo un error:", error);
              return of({
                error: true,
                message: "Ocurrió un error al actualizar el croquis",
              });
            })
          );
      }
    } else {
      return of({});
    }
  }

  adjuntarProforma(action, file, idEntidad, idPrestamo): Observable<any> {
    if (file.adjunto) {
      let data = {
        name: file.name,
        mimeType: file.mimeType,
        adjunto: file.adjunto,
        tipoAdjunto: TiposAdjunto.Proforma,
        idPrestamo: idPrestamo,
      };

      if (action == "POST") {
        return this.dataService.newPostAdjunto(data, idEntidad).pipe(
          catchError((error) => {
            console.log("Se produjo un error:", error);
            return of({
              error: true,
              message: "Ocurrió un error al adjuntar la proforma",
            });
          })
        );
      }

      if (action == "PUT") {
        return this.dataService
          .updateAdjunto(idEntidad, file.idAdjunto, data)
          .pipe(
            catchError((error) => {
              console.log("Se produjo un error:", error);
              return of({
                error: true,
                message: "Ocurrió un error al actualizar la proforma",
              });
            })
          );
      }
    } else {
      return of({});
    }
  }

  adjuntarComentarioActividad(
    idEntidad,
    idPrestamo: number,
    comentarioActividad: string
  ) {
    if (comentarioActividad) {
      const data = {
        fecha: this.dataService.date,
        comentario: comentarioActividad,
        titulo: "",
        funcionario: this.authService.getFuncionario(),
        idTipoTarea: 1,
        idEntidad: idEntidad,
      };
      this.creditosService.postComentario(idPrestamo, data).subscribe(
        (res) => {},
        (error) => {
          error.tipoAdjunto = "comentario de actividad";
          throw new Error(error);
        }
      );
    } else {
      return of({});
    }
  }

  adjuntarLiquidacionBIESS(
    action,
    file,
    idEntidad,
    idPrestamo
  ): Observable<any> {
    if (file.adjunto) {
      let data = {
        name: file.name,
        mimeType: file.mimeType,
        adjunto: file.adjunto,
        tipoAdjunto: TiposAdjunto.LiquidacionBIESS,
        idPrestamo: idPrestamo,
      };
      if (action == "POST") {
        return this.dataService.newPostAdjunto(data, idEntidad).pipe(
          catchError((error) => {
            console.log("Se produjo un error:", error);
            return of({
              error: true,
              message: "Ocurrió un error al adjuntar la liquidación Biess",
            });
          })
        );
      }

      if (action == "PUT") {
        return this.dataService
          .updateAdjunto(idEntidad, file.idAdjunto, data)
          .pipe(
            catchError((error) => {
              console.log("Se produjo un error:", error);
              return of({
                error: true,
                message: "Ocurrió un error al actualizar la liquidación Biess",
              });
            })
          );
      }
    } else {
      return of({});
    }
  }

  adjuntarAutorizaciones(action, file, idEntidad, idPrestamo): Observable<any> {
    if (file.adjunto) {
      let data = {
        name: file.name,
        mimeType: file.mimeType,
        adjunto: file.adjunto,
        tipoAdjunto: TiposAdjunto.Autorizacion,
        idPrestamo: idPrestamo,
      };

      if (action == "POST") {
        return this.dataService.newPostAdjunto(data, idEntidad).pipe(
          catchError((error) => {
            console.log("Se produjo un error:", error);
            return of({
              error: true,
              message: "Ocurrió un error al adjuntar la autorización",
            });
          })
        );
      }

      if (action == "PUT") {
        return this.dataService
          .updateAdjunto(idEntidad, file.idAdjunto, data)
          .pipe(
            catchError((error) => {
              console.log("Se produjo un error:", error);
              return of({
                error: true,
                message: "Ocurrió un error al actualizar la autorización",
              });
            })
          );
      }
    } else {
      return of({});
    }
  }

  adjuntarPagare(action, file, idEntidad, idPrestamo): Observable<any> {
    if (file.adjunto) {
      let data = {
        name: file.name,
        mimeType: file.mimeType,
        adjunto: file.adjunto,
        tipoAdjunto: TiposAdjunto.Pagare,
        idPrestamo: idPrestamo,
      };

      if (action == "POST") {
        return this.dataService.newPostAdjunto(data, idEntidad).pipe(
          catchError((error) => {
            console.log("Se produjo un error:", error);
            return of({
              error: true,
              message: "Ocurrió un error al adjuntar el pagare",
            });
          })
        );
      }

      if (action == "PUT") {
        return this.dataService
          .updateAdjunto(idEntidad, file.idAdjunto, data)
          .pipe(
            catchError((error) => {
              console.log("Se produjo un error:", error);
              return of({
                error: true,
                message: "Ocurrió un error al actualizar el pagare",
              });
            })
          );
      }
    } else {
      return of({});
    }
  }

  adjuntarGeneral(
    action,
    file,
    idEntidad,
    idPrestamo,
    nombreAdjunto
  ): Observable<any> {
    if (file.adjunto) {
      let data = {
        name: file.name,
        mimeType: file.mimeType,
        adjunto: file.adjunto,
        tipoAdjunto: file.tipoAdjunto,
        idPrestamo: idPrestamo,
      };
      if (action == "POST") {
        return this.dataService.newPostAdjunto(data, idEntidad).pipe(
          catchError((error) => {
            console.log("Se produjo un error:", error);
            return of({
              error: true,
              message: "Ocurrió un error al adjuntar " + nombreAdjunto,
            });
          })
        );
      }

      if (action == "PUT") {
        return this.dataService
          .updateAdjunto(idEntidad, file.idAdjunto, data)
          .pipe(
            catchError((error) => {
              console.log("Se produjo un error:", error);
              return of({
                error: true,
                message: "Ocurrió un error al actualizar " + nombreAdjunto,
              });
            })
          );
      }
    } else {
      return of({});
    }
  }

  adjuntarDebitoPrestamo(action, file, idEntidad, idPrestamo): Observable<any> {
    if (file.adjunto) {
      let data = {
        name: file.name,
        mimeType: file.mimeType,
        adjunto: file.adjunto,
        tipoAdjunto: TiposAdjunto.DebitoPrestamo,
        idPrestamo: idPrestamo,
      };
      if (action == "POST") {
        return this.dataService.newPostAdjunto(data, idEntidad).pipe(
          catchError((error) => {
            console.log("Se produjo un error:", error);
            return of({
              error: true,
              message: "Ocurrió un error al adjuntar otros ingresos",
            });
          })
        );
      }

      if (action == "PUT") {
        return this.dataService
          .updateAdjunto(idEntidad, file.idAdjunto, data)
          .pipe(
            catchError((error) => {
              console.log("Se produjo un error:", error);
              return of({
                error: true,
                message: "Ocurrió un error al actualizar otros ingresos",
              });
            })
          );
      }
    } else {
      return of({});
    }
  }

  adjuntarOtrosIngresos(action, file, idEntidad, idPrestamo): Observable<any> {
    if (file.adjunto) {
      let data = {
        name: file.name,
        mimeType: file.mimeType,
        adjunto: file.adjunto,
        tipoAdjunto: TiposAdjunto.OtrosIngresos,
        idPrestamo: idPrestamo,
      };
      if (action == "POST") {
        return this.dataService.newPostAdjunto(data, idEntidad).pipe(
          catchError((error) => {
            console.log("Se produjo un error:", error);
            return of({
              error: true,
              message: "Ocurrió un error al adjuntar otros ingresos",
            });
          })
        );
      }

      if (action == "PUT") {
        return this.dataService
          .updateAdjunto(idEntidad, file.idAdjunto, data)
          .pipe(
            catchError((error) => {
              console.log("Se produjo un error:", error);
              return of({
                error: true,
                message: "Ocurrió un error al actualizar otros ingresos",
              });
            })
          );
      }
    } else {
      return of({});
    }
  }

  adjuntarRolPagos(action, file, idEntidad, idPrestamo): Observable<any> {
    if (file.adjunto) {
      let data = {
        name: file.name,
        mimeType: file.mimeType,
        adjunto: file.adjunto,
        tipoAdjunto: TiposAdjunto.RolPagos,
        idPrestamo: idPrestamo,
      };
      if (action == "POST") {
        return this.dataService.newPostAdjunto(data, idEntidad).pipe(
          catchError((error) => {
            console.log("Se produjo un error:", error);
            return of({
              error: true,
              message: "Ocurrió un error al adjuntar el rol de pagos",
            });
          })
        );
      }

      if (action == "PUT") {
        return this.dataService
          .updateAdjunto(idEntidad, file.idAdjunto, data)
          .pipe(
            catchError((error) => {
              console.log("Se produjo un error:", error);
              return of({
                error: true,
                message: "Ocurrió un error al actualizar el rol de pagos",
              });
            })
          );
      }
    } else {
      return of({});
    }
  }

  adjuntarSolicitud(action, file, idEntidad, idPrestamo): Observable<any> {
    if (file.adjunto) {
      let data = {
        name: file.name,
        mimeType: file.mimeType,
        adjunto: file.adjunto,
        tipoAdjunto: TiposAdjunto.Solicitud,
        idPrestamo: idPrestamo,
      };
      if (action == "POST") {
        return this.dataService.newPostAdjunto(data, idEntidad).pipe(
          catchError((error) => {
            console.log("Se produjo un error:", error);
            return of({
              error: true,
              message:
                "Ocurrió un error al adjuntar la solicitudRefinanciamiento",
            });
          })
        );
      }

      if (action == "PUT") {
        return this.dataService
          .updateAdjunto(idEntidad, file.idAdjunto, data)
          .pipe(
            catchError((error) => {
              console.log("Se produjo un error:", error);
              return of({
                error: true,
                message:
                  "Ocurrió un error al actualizar la solicitudRefinanciamiento",
              });
            })
          );
      }
    } else {
      return of({});
    }
  }

  adjuntarDocumentosGarante( idPrestamo, data) {
    let accion = "POST";
    //lista de garantes
    data.forEach((item) => {
      //cedulas del garante
      this.adjuntarCedulaFrontalGarante(
        accion,
        item.adjuntoFrontal,
        item.idPersona,
        idPrestamo
      ).subscribe((res) => {});
      this.updateEntidadCedulasGarante(
        item.adjuntoFrontal,
        item.idPersona,
        TiposAdjunto.cedulaFrontal
      ).subscribe((res) => {});
      
      this.adjuntarCedulaPosteriorGarante(
        accion,
        item.adjuntoPosterior,
        item.idPersona,
        idPrestamo
      ).subscribe((res) => {});

      this.updateEntidadCedulasGarante(
        item.adjuntoPosterior,
        item.idPersona,
        TiposAdjunto.cedulaPosterior
      ).subscribe((res) => {});

      this.adjuntarRolGarante(
        accion,
        item.adjuntoRol,
        item.idPersona,
        idPrestamo
      ).subscribe((res) => {});
    });
  }

  crearAdjuntosCredito(idEntidad, idPrestamo, data) {
    let accion = "POST";
    this.adjuntarLiquidacionBIESS(
      accion,
      data.base64Liquidacion,
      idEntidad,
      idPrestamo
    ).subscribe((res) => {});
    this.adjuntarAutorizaciones(
      accion,
      data.base64Autorizacion,
      idEntidad,
      idPrestamo
    ).subscribe((res) => {});
    this.adjuntarOtrosIngresos(
      accion,
      data.base64Prestamo,
      idEntidad,
      idPrestamo
    ).subscribe((res) => {});
    this.adjuntarRolPagos(
      accion,
      data.adjuntoRolPago,
      idEntidad,
      idPrestamo
    ).subscribe((res) => {});
  /*   this.adjuntarComentarioActividad(
      idEntidad,
      idPrestamo,
      data.comentarioActividad
    ); */
    if (data.Solicitud)
      this.adjuntarSolicitud(
        accion,
        data.Solicitud,
        idEntidad,
        idPrestamo
      ).subscribe((res) => {});
    if (data.buroCredito)
      this.adjuntarAutorizaciones(
        accion,
        data.buroCredito,
        idEntidad,
        idPrestamo
      ).subscribe((res) => {});
    if (data.producto)
      this.postAdjuntosByIdProducto(
        idEntidad,
        idPrestamo,
        data.productoFinanciero,
        data.producto
      );
  }

  // POST PRODUCTO FINANCIERO
  postAdjuntosByIdProducto(idEntidad, idPrestamo, productoFinanciero, data) {
    let accion = "POST";

    switch (productoFinanciero.idProducto) {
      case 2:
      // HIPOTECARIO DESA
      case 9:
        // HIPOTECARIO PROD
        this.adjuntarCedulaFrontalConyuge(
          accion,
          data.cedulaFrontalConyuge,
          idEntidad,
          idPrestamo
        ).subscribe((res) => {});
        this.adjuntarCedulaPosteriorConyuge(
          accion,
          data.cedulaPosteriorConyuge,
          idEntidad,
          idPrestamo
        ).subscribe((res) => {});
        this.adjuntarRegistroPropiedad(
          accion,
          data.proformaHipotecar,
          idEntidad,
          idPrestamo
        ).subscribe((res) => {});
        this.adjuntarCertificadoPredio(
          accion,
          data.certificadoInmueble,
          idEntidad,
          idPrestamo
        ).subscribe((res) => {});
        this.adjuntarCroquis(
          accion,
          data.croquisInmueble,
          idEntidad,
          idPrestamo
        ).subscribe((res) => {});
        this.adjuntarAutorizaciones(
          accion,
          data.buroCredito,
          idEntidad,
          idPrestamo
        ).subscribe((res) => {});

        break;

      case 3:
        // PRENDARIO
        this.adjuntarCedulaFrontalConyuge(
          accion,
          data.cedulaFrontalConyuge,
          idEntidad,
          idPrestamo
        ).subscribe((res) => {});
        this.adjuntarCedulaPosteriorConyuge(
          accion,
          data.cedulaPosteriorConyuge,
          idEntidad,
          idPrestamo
        ).subscribe((res) => {});
        this.adjuntarAutorizaciones(
          accion,
          data.buroCredito,
          idEntidad,
          idPrestamo
        ).subscribe((res) => {});
        this.adjuntarProforma(
          accion,
          data.proformaVehiculo,
          idEntidad,
          idPrestamo
        ).subscribe((res) => {});

        break;

      case 7:
        this.adjuntarProforma(
          accion,
          data.proformaExpress,
          idEntidad,
          idPrestamo
        ).subscribe((res) => {});
        break;
    }
  }
}
