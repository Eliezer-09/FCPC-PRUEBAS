import { LocalService } from "./../../../../services/local.service";
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ComponentesService } from "src/app/services/componentes.service";
import { CreditosService } from "../../creditos.service";
import icDoneAll from "@iconify/icons-ic/twotone-done-all";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { DataService } from "src/app/services/data.service";
import moment from "moment";
import { AuthService } from "src/app/pages/auth/auth.service";
import { Prestamo } from "src/app/model/models";
import { ReportesService } from "src/app/pages/reportes/reportes.service";
import { finalize } from "rxjs/operators";
import { forkJoin } from "rxjs";

@Component({
  selector: "vex-legalizar",
  templateUrl: "./legalizar.component.html",
  styleUrls: ["./legalizar.component.scss"],
})
export class LegalizarComponent implements OnInit, AfterViewChecked {
  icDoneAll = icDoneAll;

  idPrestamo: any = this.route.snapshot.paramMap.get("idPrestamo");
  nombreArchivoDebito: string;
  nombreArchivoDeclaracion: string;
  nombreArchivoProveedor: string;
  comentarios: string = "";
  pagare = false;
  pagareFirmado = false;
  solicitud = false;
  declaracion = false;
  declaracionAsegurabilidad = false;
  autorizaciondebito = false;
  autorizaciondebitoFirmado = false;
  informativa = false;
  tablaInformativa = false;
  pagoProveedorFirmado = false;
  pagoProveedor = false;
  prestamo: Prestamo;
  valorDescontado = 0;
  documentos = {
    pagare: {},
    cartaDebito: {},
    declaracionSeguro: {},
    tablaInformativa: {},
    pagoProveedor: {},
    solicitud: {},
  };
  fileToUpload: any;
  nombreArchivoPagare: string;
  nombreSolicitud: any;
  solicitudFirmado: boolean;
  urlPagare: any;
  informativaUp: boolean;
  declaracionUp: boolean;
  autorizaciondebitoUp: boolean;

  constructor(
    private route: ActivatedRoute,
    private component: ComponentesService,
    private spinner: NgxSpinnerService,
    private creditoService: CreditosService,
    private sanitizer: DomSanitizer,
    private changeDetectorRefs: ChangeDetectorRef,
    private dataService: DataService,
    private router: Router,
    private authService: AuthService,
    private reportService: ReportesService,
    private localServiceS: LocalService
  ) {}

  ngAfterViewChecked(): void {
    this.changeDetectorRefs.detectChanges();
  }

  ngOnInit(): void {
    this.detallesCredito();
  }

  detallesCredito() {
    this.creditoService
      .getPrestamoById(this.idPrestamo)
      .subscribe((response) => {
        this.prestamo = response["result"];
        this.valorDescontado =
          this.prestamo.moraAnterior * (this.prestamo.descuentoMora / 100);

        this.obtenerAdjuntos();
      });
  }

  getPagare() {
    this.spinner.show();
    this.reportService.getPrestamosPagareById(this.idPrestamo).subscribe(
      (res) => {
        this.spinner.hide();
        let link = document.createElement("a");
        link.setAttribute("download", "pagare");
        link.style.display = "none";
        document.body.appendChild(link);
        window.open(res["changingThisBreaksApplicationSecurity"]);
        document.body.removeChild(link);
        this.pagare = true;
      },
      (error) => {
        this.spinner.hide();
        this.component.alerta(
          "error",
          "Ocurrio un error al descargar el documento"
        );
      }
    );
  }

  getPagoProveedor() {
    this.spinner.show();
    this.creditoService.getPagoProveedor(this.idPrestamo).subscribe(
      (res) => {
        this.spinner.hide();
        let link = document.createElement("a");
        link.setAttribute("download", "Autorización pago proveedor");
        link.style.display = "none";
        document.body.appendChild(link);
        window.open(res["changingThisBreaksApplicationSecurity"]);
        document.body.removeChild(link);
        this.pagoProveedor = true;
      },
      (error) => {
        this.spinner.hide();
        this.component.alerta(
          "error",
          "Ocurrio un error al descargar el documento"
        );
      }
    );
  }

  getDebito() {
    this.spinner.show();
    this.creditoService
      .getPrestamoAutorizacionDebitoById(this.idPrestamo)
      .subscribe(
        (res) => {
          this.spinner.hide();
          let link = document.createElement("a");
          link.setAttribute("download", "debitos");
          link.style.display = "none";
          document.body.appendChild(link);
          window.open(res["changingThisBreaksApplicationSecurity"]);
          document.body.removeChild(link);
          this.autorizaciondebito = true;
        },
        (error) => {
          this.spinner.hide();
          this.component.alerta(
            "error",
            "Ocurrio un error al descargar el documento: " + error
          );
        }
      );
  }

  getDeclaracionAsegurabilidad() {
    this.spinner.show();
    this.spinner.hide();
    let link = document.createElement("a");
    link.setAttribute("download", "debitos");
    link.style.display = "none";
    document.body.appendChild(link);
    window.open(
      "https://api.fcpc-cte.com/files/DECLARACION_DE_ASEGURABILIDAD_COMPLETA.pdf"
    );
    document.body.removeChild(link);
    this.declaracion = true;
  }

  getTablaInformativa() {
    this.spinner.show();
    this.creditoService.getTablaInformativaCostos(this.idPrestamo).subscribe(
      (data: any) => {
        const fileURL = URL.createObjectURL(data);
        window.open(fileURL);
        this.informativa = true;
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.component.alerta(
          "error",
          "Ocurrio un error al descargar el documento: " + error
        );
      }
    );
  }

  colorCalificacionPrestamo(calificacion) {
    var color = "grey";
    if (calificacion) {
      var categoria = calificacion.substring(0, 1);

      if (categoria == "A") {
        color = "green";
      } else if (categoria == "B") {
        color = "lightskyblue";
      } else if (categoria == "C") {
        color = "orange";
      } else if (categoria == "D") {
        color = "pink";
      } else if (categoria == "E") {
        color = "red";
      }
    }
    return color;
  }

  async handleFileInput(files: FileList, tipo) {
    switch (tipo) {
      case "pagare":
        this.fileToUpload = files.item(0);
        this.spinner.show();
        this.dataService.getBase64(this.fileToUpload).then(
          (res: any) => {
            const data = {
              adjunto: res,
              name: this.fileToUpload.name,
              mimeType: this.fileToUpload.type,
              idPrestamo: this.idPrestamo,
              tipoAdjunto: 30,
            };
            this.documentos.pagare = data;
            this.pagareFirmado = true;
            let fileUrl = URL.createObjectURL(this.fileToUpload);
            this.setInnerHtmlpagare(fileUrl);
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
            this.component.alerta(
              "error",
              "Ocurrio un error al traer el adjunto"
            );
          }
        );
        break;
      case "debito":
        this.fileToUpload = files.item(0);
        this.spinner.show();
        this.dataService.getBase64(this.fileToUpload).then(
          (res: any) => {
            const data = {
              adjunto: res,
              name: this.fileToUpload.name,
              mimeType: this.fileToUpload.type,
              idPrestamo: this.idPrestamo,
              tipoAdjunto: 29,
            };

            this.documentos.cartaDebito = data;
            this.autorizaciondebitoFirmado = true;
            let fileUrl = URL.createObjectURL(this.fileToUpload);
            this.setInnerHtmlDebito(fileUrl);
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
          }
        );
        break;

      case "declaracion":
        this.fileToUpload = files.item(0);
        this.spinner.show();
        this.dataService.getBase64(this.fileToUpload).then(
          (res: any) => {
            const data = {
              adjunto: res,
              name: this.fileToUpload.name,
              mimeType: this.fileToUpload.type,
              idPrestamo: this.idPrestamo,
              tipoAdjunto: 28,
            };

            this.documentos.declaracionSeguro = data;
            this.declaracionUp = true;
            let fileUrl = URL.createObjectURL(this.fileToUpload);
            this.setInnerHtmlDeclaracion(fileUrl);
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
          }
        );
        break;

      case "tabla":
        this.fileToUpload = files.item(0);
        this.spinner.show();
        this.dataService.getBase64(this.fileToUpload).then(
          (res: any) => {
            const data = {
              adjunto: res,
              name: this.fileToUpload.name,
              mimeType: this.fileToUpload.type,
              idPrestamo: this.idPrestamo,
              tipoAdjunto: 44,
            };

            this.documentos.tablaInformativa = data;
            this.informativaUp = true;
            let fileUrl = URL.createObjectURL(this.fileToUpload);
            this.setInnerHtmlTabla(fileUrl);
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
          }
        );
        break;

      case "tablaAmortizacion":
        this.fileToUpload = files.item(0);
        this.spinner.show();
        this.creditoService
          .postActualizarTablaAmortizacion(this.idPrestamo)
          .subscribe(
            (res) => {
              this.component.alerta(
                "success",
                "Se ha actualizado la tabla de amortización"
              );
            },
            (error) => {
              this.component.alerta(
                "error",
                "Ocurrió un error al actualizar la tabla de amortización"
              );
            }
          );
        break;

      case "proveedor":
        this.fileToUpload = files.item(0);
        this.spinner.show();
        this.dataService.getBase64(this.fileToUpload).then(
          (res: any) => {
            const data = {
              adjunto: res,
              name: this.fileToUpload.name,
              mimeType: this.fileToUpload.type,
              idPrestamo: this.idPrestamo,
              tipoAdjunto: 109,
            };

            this.documentos.pagoProveedor = data;
            this.pagoProveedorFirmado = true;
            let fileUrl = URL.createObjectURL(this.fileToUpload);
            this.setInnerHtmlProveedor(fileUrl);
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
          }
        );
        break;

      case "solicitud":
        this.fileToUpload = files.item(0);
        this.spinner.show();
        this.dataService.getBase64(this.fileToUpload).then(
          (res: any) => {
            const data = {
              adjunto: res,
              name: this.fileToUpload.name,
              mimeType: this.fileToUpload.type,
              idPrestamo: this.idPrestamo,
              tipoAdjunto: this.prestamo.esNovacion ? 108 : 107,
            };

            this.documentos.solicitud = data;
            let fileUrl = URL.createObjectURL(this.fileToUpload);
            this.setInnerHtmlSolicitud(fileUrl);

            this.solicitudFirmado = true;
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
          }
        );
        break;

      default:
        break;
    }
  }

  handleAdjunto(
    tipoAdjunto: number,
    documento: any,
    setInnerHtmlFunction: (res: any) => void
  ) {
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        const data = {
          adjunto: res,
          name: this.fileToUpload.name,
          mimeType: this.fileToUpload.type,
          idPrestamo: this.idPrestamo,
          tipoAdjunto: tipoAdjunto,
        };
        documento = data;
        setInnerHtmlFunction(res);
      },
      (error) => {
        this.component.alerta("error", "Ocurrio un error al traer el adjunto");
      }
    );
  }
  obtenerNovacion() {
    this.spinner.show();
    this.reportService
      .postSolicitudNovacion(this.prestamo.idPrestamo)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(
        (res: any) => {
          let link = document.createElement("a");
          link.setAttribute("download", "pagare");
          link.style.display = "none";
          document.body.appendChild(link);
          window.open(res["changingThisBreaksApplicationSecurity"]);
          document.body.removeChild(link);
          this.solicitud = true;
        },
        (error) => {
          this.component.alerta(
            "error",
            "Ocurrió un error al obtener la solicitud"
          );
        }
      );
  }

  obtenerSolicitud() {
    this.spinner.show();
    this.reportService.postSolictudCredito(this.prestamo.idPrestamo).subscribe(
      (res) => {
        this.spinner.hide();
        let link = document.createElement("a");
        link.setAttribute("download", "Solicitud");
        link.style.display = "none";
        document.body.appendChild(link);
        window.open(res["changingThisBreaksApplicationSecurity"]);
        document.body.removeChild(link);
        this.solicitud = true;
      },
      (error) => {
        this.spinner.hide();
        this.component.alerta(
          "error",
          "Ocurrio un error al descargar el documento"
        );
      }
    );
  }

  obtenerAdjuntos() {
    this.spinner.show();

    this.reportService
      .getAdjuntoByIdAdjunto(
        this.prestamo.idParticipe,

        this.prestamo.idPrestamo
      )
      .subscribe((res: any) => {
        if (res.success) {
          const tipoAdjuntoCredito = this.prestamo.esNovacion ? 108 : 107;

          //recorrer
          res.result.forEach((element) => {
            if (element.tipoAdjunto == 30) {
              this.setInnerHtmlpagare(element.url);

              this.pagareFirmado = true;
            }
            if (element.tipoAdjunto == 29) {
              this.setInnerHtmlDebito(element.url);
              this.autorizaciondebitoFirmado = true;
            }

            if (element.tipoAdjunto == 28) {
              this.setInnerHtmlDeclaracion(element.url);
              this.declaracionUp = true;
            }

            if (element.tipoAdjunto == 44) {
              this.setInnerHtmlTabla(element.url);
              this.informativaUp = true;
            }

            if (element.tipoAdjunto == 109) {
              this.pagoProveedorFirmado = true;
              this.setInnerHtmlProveedor(element.url);
            }

            if (element.tipoAdjunto == tipoAdjuntoCredito) {
              this.setInnerHtmlSolicitud(element.url);

              this.solicitudFirmado = true;
            }

            /*   if (element.tipoAdjunto == 21) {
              this.setrol(element.adjunto);
              this.solicitudFirmado = true;
            } */
          });
        }
      })
      .add(() => {
        this.spinner.hide();
      });
  }

  actualizarTablaAmortizacion() {
    this.creditoService
      .postActualizarTablaAmortizacion(this.idPrestamo)
      .subscribe(
        (res: any) => {
          if (res.success) {
            this.component.alerta("success", res.message);
          }
        },
        (error) => {
          this.component.alerta(
            "error",
            "Ocurrió un error al actualizar la tabla de amortización"
          );
        }
      );
  }

  actualizarTablaNoMsg() {
    this.creditoService
      .postActualizarTablaAmortizacion(this.idPrestamo)
      .subscribe(
        (res: any) => {},
        (error) => {
          this.component.alerta(
            "error",
            "Ocurrió un error al actualizar la tabla de amortización"
          );
        }
      );
  }

  enviar() {
    //si no hay comentarios, enviar alerta
    if (this.comentarios == "" || this.comentarios == undefined) {
      this.component.alerta("info", "Debes agregar un comentario");
      return;
    }

    if (!this.pagareFirmado && !this.autorizaciondebitoFirmado) {
      this.component.alerta("info", "Debe subir los documentos firmados");
      return;
    }

    this.saveDocumentos();
  }

  postPrestamoPagare() {
    const data = {
      comentarios: this.comentarios,
      funcionario: this.authService.getFuncionario(),
      fecha: moment().format(),
    };

    this.spinner.show();
    this.creditoService.postPrestamoPagare(this.idPrestamo, data).subscribe(
      (item: any) => {
        this.spinner.hide();
        this.router.navigateByUrl("creditos/legalizacion");
      },
      (error) => {
        this.spinner.hide();
        this.component.alerta("error", error["message"]);
      }
    );
  }
  saveDocumentos() {
    this.spinner.show();
    //si las propiedades no son vacias, guardarlas

    const documentosObservables = [];
    for (const key in this.documentos) {
      if (Object.keys(this.documentos[key]).length !== 0) {
        documentosObservables.push(this.guardarDocumento(this.documentos[key]));
      }
    }

    if (documentosObservables.length != 0) {
      forkJoin(documentosObservables).subscribe(
        (resultados) => {
          this.component.alerta(
            "success",
            "Los documentos se han guardado correctamente"
          );

          this.postPrestamoPagare();
          this.spinner.hide();
        },
        (error) => {
          this.component.alerta("error", "Error al guardar los documentos");
          this.spinner.hide();
        }
      );
    } else {
      this.postPrestamoPagare();
    }
  }
  guardarDocumento(documento: any) {
    console.log(documento);
    return this.reportService.postAdjuntos(
      this.prestamo.idParticipe,
      documento
    );
  }

  public innerHtmlPagare: SafeHtml = "";

  public setInnerHtmlpagare(pdfurl: string) {
    console.log(pdfurl);
    this.innerHtmlPagare = this.sanitizer.bypassSecurityTrustHtml(
      "<object data='" +
        pdfurl +
        "' type='application/pdf' class='embed-responsive-item' style='width: 100%; height: 100% !important;'>" +
        "Object " +
        pdfurl +
        " failed" +
        "</object>"
    );

    this.changeDetectorRefs.detectChanges();
  }

  public innerHtmlDeclaracion: SafeHtml;
  public setInnerHtmlDeclaracion(pdfurl: string) {
    this.innerHtmlDeclaracion = this.sanitizer.bypassSecurityTrustHtml(
      "<object data='" +
        pdfurl +
        "' type='application/pdf' class='embed-responsive-item' style='width: 100%; height: 100% !important;'>" +
        "Object " +
        pdfurl +
        " failed" +
        "</object>"
    );
  }

  public innerHtmlProveedor: SafeHtml;
  public setInnerHtmlProveedor(pdfurl: string) {
    this.innerHtmlProveedor = this.sanitizer.bypassSecurityTrustHtml(
      "<object data='" +
        pdfurl +
        "' type='application/pdf' class='embed-responsive-item' style='width: 100%; height: 100% !important;'>" +
        "Object " +
        pdfurl +
        " failed" +
        "</object>"
    );
  }

  public innerHtmlTabla: SafeHtml;
  public setInnerHtmlTabla(pdfurl: string) {
    this.innerHtmlTabla = this.sanitizer.bypassSecurityTrustHtml(
      "<object data='" +
        pdfurl +
        "' type='application/pdf' class='embed-responsive-item' style='width: 100%; height: 100% !important;'>" +
        "Object " +
        pdfurl +
        " failed" +
        "</object>"
    );
  }

  public innerHtmlDebito: SafeHtml;
  public setInnerHtmlDebito(pdfurl: string) {
    this.innerHtmlDebito = this.sanitizer.bypassSecurityTrustHtml(
      "<object data='" +
        pdfurl +
        "' type='application/pdf' class='embed-responsive-item' style='width: 100%; height: 100% !important;'>" +
        "Object " +
        pdfurl +
        " failed" +
        "</object>"
    );
  }

  public innerHtmlSolicitud: SafeHtml;
  public setInnerHtmlSolicitud(pdfurl: string) {
    this.innerHtmlSolicitud = this.sanitizer.bypassSecurityTrustHtml(
      "<object data='" +
        pdfurl +
        "' type='application/pdf' class='embed-responsive-item' style='width: 100%; height: 100% !important;'>" +
        "Object " +
        pdfurl +
        " failed" +
        "</object>"
    );
  }
}
