import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { NgxSpinnerService } from "ngx-spinner";
import { ComponentesService } from "src/app/services/componentes.service";
import { DataService } from "src/app/services/data.service";
import { CreditosService } from "../../creditos.service";
import icPdf from "@iconify/icons-ic/picture-as-pdf";
import { PostAdjunto, Prestamo } from "src/app/model/models";
import { TiposAdjunto } from "src/@vex/interfaces/enums";
import { AdjuntosService } from "src/app/services/adjuntos.service";

@Component({
  selector: "vex-adjuntos",
  templateUrl: "./adjuntos.component.html",
  styleUrls: ["./adjuntos.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdjuntosComponent implements OnInit, AfterViewChecked {
  @Input() idProducto: any;
  @Input() idEntidad: any;
  @Input() estado;
  @Input() idPrestamo: any;
  @Input() reestructurado: boolean;
  @Input() refinanciado: boolean;
  @Input() prestamo: Prestamo;
  hipotecario = false;
  prendario = false;
  creditoExpress = false;
  fileToUpload: File = null;
  cedulaConyugeFrontal: any;
  cedulaConyugePosterior: any;
  nombreAutorizacion: String;
  nombreTablaCostos: string;
  nombreDeclaracionSeguro: string;
  nombreDebitoPrestamo: string;
  nombrePagare: String;
  nombreSolicitud: String;
  nombrePagoProveedor: string;
  icPdf = icPdf;

  nombreOtrosIngresos: String;
  nombreCroquis: String;
  nombreAutorizaciones: string;
  nombreCedulaConyugePosterior: String;
  nombreCedulaConyugeFrontal: String;
  nombreCertificadoPredio: String;
  nombreRegistroPropiedad: String;
  nombreProforma: String;
  nombreLiquidacion: String;
  nombreProformaVehiculo: string;
  adjuntoPagare;
  adjuntoDebitoPrestamo: {
    nombreTipoAdjunto: any;
    tipoAdjunto: any;
    nombre: string;
    idAdjunto: any;
    innerHtml: SafeHtml;
  };
  adjuntoTablaInformativa: {
    nombreTipoAdjunto: any;
    tipoAdjunto: any;
    nombre: string;
    idAdjunto: any;
    innerHtml: SafeHtml;
  };
  adjuntoResumenCredito: {
    nombreTipoAdjunto: any;
    tipoAdjunto: any;
    nombre: string;
    idAdjunto: any;
    innerHtml: SafeHtml;
  };
  nombrereResumenCredito: any;
  adjuntoDeclaracionSeguro: {
    nombreTipoAdjunto: any;
    tipoAdjunto: any;
    nombre: string;
    idAdjunto: any;
    innerHtml: SafeHtml;
  };
  adjuntoPagoProveedor: {
    nombreTipoAdjunto: any;
    tipoAdjunto: any;
    nombre: string;
    idAdjunto: any;
    innerHtml: SafeHtml;
  };
  adjuntoSolicitudCredito: {
    nombreTipoAdjunto: any;
    tipoAdjunto: any;
    nombre: string;
    idAdjunto: any;
    innerHtml: SafeHtml;
  };
  nombreSolicitudCredito: any;
  nombreSolicitudCreditoNovacion: any;
  adjuntoSolicitudCreditoNovacion: {
    nombreTipoAdjunto: any;
    tipoAdjunto: any;
    nombre: string;
    idAdjunto: any;
    innerHtml: SafeHtml;
  };
  constructor(
    private spinner: NgxSpinnerService,
    private creditoService: CreditosService,
    private componentService: ComponentesService,
    private dataService: DataService,
    private sanitizer: DomSanitizer,
    private changeDetector: ChangeDetectorRef,
    private adjuntosService: AdjuntosService
  ) {}

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnInit() {
    this.adjuntosByProducto();
  }

  adjuntoOtrosIngresos: any = {};
  adjuntoCedulaConyugePosterior: any = {};
  adjuntoCedulaConyugeFrontal: any = {};
  adjuntoRegistroPropiedad: any = {};
  adjuntoCertificadoPredio: any = {};
  adjuntoCroquis: any = {};
  adjuntoAutorizacion: any = {};
  adjuntoRolPagos: any = {};
  adjuntoLiquidacionBIESS: any = {};
  adjuntoProformaVehiculo: any = {};
  adjuntofirmaSolicitud: any = {};

  showAdjuntosTipoCredito = {
    CedulaConyugeFrontal: false,
    CedulaConyugePosterior: false,
    RegistroPropiedad: false,
    CertificadoPredio: false,
    croquis: false,
    Autorizacion: false,
    OtrosIngresos: false,
    RolPagos: false,
    LiquidacionBIESS: false,
    AutorizacionBuro: false,
    Proforma: false,
    firmaSolicitud: false,
  };
  /*   tipoAdjuntosCreditoHipotecario=[TiposAdjunto.CedulaConyugeFrontal,
                                  TiposAdjunto.CedulaConyugePosterior, 
                                  TiposAdjunto.RegistroPropiedad,
                                  TiposAdjunto.CertificadoPredio,
                                  TiposAdjunto.croquis,
                                  TiposAdjunto.Autorizacion,
                                  TiposAdjunto.OtrosIngresos,
                                  TiposAdjunto.RolPagos
                                ] */

  generarAdjunto(adjunto) {
    let adjuntoSeguro = this.sanitizer.bypassSecurityTrustUrl(adjunto.url);

    const dataReturn = {
      nombreTipoAdjunto: adjunto.nombreTipoAdjunto,
      tipoAdjunto: adjunto.tipoAdjunto,
      nombre: "",
      idAdjunto: adjunto.idAdjunto,
      innerHtml: this.setInnerHtmlAdjunto(
        adjuntoSeguro["changingThisBreaksApplicationSecurity"]
      ),
    };

    return dataReturn;
  }
  tipoAdjunto(adjuntos) {
    adjuntos.forEach(async (adjunto) => {
      switch (adjunto.tipoAdjunto) {
        case TiposAdjunto.CedulaConyugeFrontal:
          this.adjuntoCedulaConyugeFrontal = this.generarAdjunto(adjunto);
          break;
        case TiposAdjunto.CedulaConyugePosterior:
          this.adjuntoCedulaConyugePosterior = this.generarAdjunto(adjunto);
          break;
        case TiposAdjunto.RegistroPropiedad:
          this.adjuntoRegistroPropiedad = this.generarAdjunto(adjunto);
          break;
        case TiposAdjunto.CertificadoPredio:
          this.adjuntoCertificadoPredio = this.generarAdjunto(adjunto);
          break;
        case TiposAdjunto.croquis:
          this.adjuntoCroquis = this.generarAdjunto(adjunto);
          break;
        case TiposAdjunto.Autorizacion:
          this.adjuntoAutorizacion = this.generarAdjunto(adjunto);
          break;
        case TiposAdjunto.OtrosIngresos:
          this.adjuntoOtrosIngresos = this.generarAdjunto(adjunto);
          break;
        case TiposAdjunto.RolPagos:
          this.adjuntoRolPagos = this.generarAdjunto(adjunto);
          break;
        case TiposAdjunto.LiquidacionBIESS:
          this.adjuntoLiquidacionBIESS = this.generarAdjunto(adjunto);
          break;
        case TiposAdjunto.Proforma:
          this.adjuntoProformaVehiculo = this.generarAdjunto(adjunto);
          break;
        case TiposAdjunto.Solicitud:
          this.adjuntofirmaSolicitud = this.generarAdjunto(adjunto);
          break;
        case TiposAdjunto.Pagare:
          this.adjuntoPagare = this.generarAdjunto(adjunto);
          break;
        case TiposAdjunto.DebitoPrestamo:
          this.adjuntoDebitoPrestamo = this.generarAdjunto(adjunto);
          break;
        case TiposAdjunto.TablaInformativa:
          this.adjuntoTablaInformativa = this.generarAdjunto(adjunto);
          break;

        case TiposAdjunto.ResumenCredito:
          this.adjuntoResumenCredito = this.generarAdjunto(adjunto);
          break;

        case TiposAdjunto.PagoProveedorExpress:
          this.adjuntoPagoProveedor = this.generarAdjunto(adjunto);
          break;

        case TiposAdjunto.SolicitudCredito:
          this.adjuntoSolicitudCredito = this.generarAdjunto(adjunto);
          break;
        case TiposAdjunto.SolicitudCreditoNovacion:
          this.adjuntoSolicitudCreditoNovacion = this.generarAdjunto(adjunto);
          break;
      }
    });
  }

  updateAdjuntoCedulaConyugeFrontal(data, tipo = "PUT") {
    this.adjuntosService
      .adjuntarCedulaFrontalConyuge(
        tipo,
        data,
        this.prestamo.idParticipe,
        this.idPrestamo
      )
      .subscribe((res) => {
        this.spinner.hide();
        if (res["error"]) {
          return this.componentService.alerta("error", res["message"]);
        }
        this.getAdjuntosPrestamo();
      });
  }

  buildCedulaConyugeFrontal(files) {
    if (!this.creditoService.validarPesoArchivo(files.item(0))) {
      return;
    }
    this.fileToUpload = files.item(0);
    this.nombreCedulaConyugeFrontal = files.item(0).name;
    this.spinner.show();
    this.dataService.getBase64(this.fileToUpload).then(async (res: any) => {
      let data = {
        adjunto: res,
        name: this.nombreCedulaConyugeFrontal,
        mimeType: files[0].type,
        idAdjunto: this.adjuntoCedulaConyugeFrontal?.idAdjunto,
      };
      if (this.adjuntoCedulaConyugeFrontal?.idAdjunto == null) {
        this.updateAdjuntoCedulaConyugeFrontal(data, "POST");
      } else {
        this.updateAdjuntoCedulaConyugeFrontal(data);
      }
    }),
      (error) => {
        this.spinner.hide();
        this.componentService.alerta(
          "error",
          "Ocurrió un error al traer el adjunto"
        );
      };
  }

  updateAdjuntoCedulaConyugePosterior(data, tipo = "PUT") {
    this.adjuntosService
      .adjuntarCedulaPosteriorConyuge(
        tipo,
        data,
        this.prestamo.idParticipe,
        this.idPrestamo
      )
      .subscribe((res) => {
        this.spinner.hide();
        if (res["error"]) {
          return this.componentService.alerta("error", res["message"]);
        }
        this.getAdjuntosPrestamo();
      });
  }

  buildCedulaConyugePosterior(files) {
    if (!this.creditoService.validarPesoArchivo(files.item(0))) {
      return;
    }
    this.fileToUpload = files.item(0);
    this.nombreCedulaConyugePosterior = files.item(0).name;
    this.spinner.show();
    this.dataService.getBase64(this.fileToUpload).then(async (res: any) => {
      let data = {
        adjunto: res,
        name: this.nombreCedulaConyugePosterior,
        mimeType: files[0].type,
        idAdjunto: this.adjuntoCedulaConyugePosterior?.idAdjunto,
      };
      if (this.adjuntoCedulaConyugePosterior?.idAdjunto == null) {
        this.updateAdjuntoCedulaConyugePosterior(data, "POST");
      } else {
        this.updateAdjuntoCedulaConyugePosterior(data);
      }
    }),
      (error) => {
        this.spinner.hide();
        this.componentService.alerta(
          "error",
          "Ocurrió un error al traer el adjunto"
        );
      };
  }

  updateAdjuntoCroquis(data, tipo = "PUT") {
    this.adjuntosService
      .adjuntarCroquis(tipo, data, this.prestamo.idParticipe, this.idPrestamo)
      .subscribe((res) => {
        this.spinner.hide();
        if (res["error"]) {
          return this.componentService.alerta("error", res["message"]);
        }
        this.getAdjuntosPrestamo();
      });
  }

  buildCroquis(files) {
    if (!this.creditoService.validarPesoArchivo(files.item(0))) {
      return;
    }
    this.fileToUpload = files.item(0);
    this.nombreCroquis = files.item(0).name;
    this.spinner.show();
    this.dataService.getBase64(this.fileToUpload).then(async (res: any) => {
      let data = {
        adjunto: res,
        name: this.nombreCroquis,
        mimeType: files[0].type,
        idAdjunto: this.adjuntoCroquis?.idAdjunto,
      };
      if (this.adjuntoCroquis?.idAdjunto == null) {
        this.updateAdjuntoCroquis(data, "POST");
      } else {
        this.updateAdjuntoCroquis(data);
      }
    }),
      (error) => {
        this.spinner.hide();
        this.componentService.alerta(
          "error",
          "Ocurrió un error al traer el adjunto"
        );
      };
  }

  updateCertificadoPredio(data, tipo = "PUT") {
    this.adjuntosService
      .adjuntarCertificadoPredio(
        tipo,
        data,
        this.prestamo.idParticipe,
        this.idPrestamo
      )
      .subscribe((res) => {
        this.spinner.hide();
        if (res["error"]) {
          return this.componentService.alerta("error", res["message"]);
        }
        this.getAdjuntosPrestamo();
      });
  }

  buildCertificadoPredio(files) {
    if (!this.creditoService.validarPesoArchivo(files.item(0))) {
      return;
    }
    this.fileToUpload = files.item(0);
    this.nombreCertificadoPredio = files.item(0).name;
    this.spinner.show();
    this.dataService.getBase64(this.fileToUpload).then(async (res: any) => {
      let data = {
        adjunto: res,
        name: this.nombreCertificadoPredio,
        mimeType: files[0].type,
        idAdjunto: this.adjuntoCertificadoPredio?.idAdjunto,
      };
      if (this.adjuntoCertificadoPredio?.idAdjunto == null) {
        this.updateCertificadoPredio(data, "POST");
      } else {
        this.updateCertificadoPredio(data);
      }
    }),
      (error) => {
        this.spinner.hide();
        this.componentService.alerta(
          "error",
          "Ocurrió un error al traer el adjunto"
        );
      };
  }

  updateRegistroPropiedad(data, tipo = "PUT") {
    this.adjuntosService
      .adjuntarRegistroPropiedad(
        tipo,
        data,
        this.prestamo.idParticipe,
        this.idPrestamo
      )
      .subscribe((res) => {
        this.spinner.hide();
        if (res["error"]) {
          return this.componentService.alerta("error", res["message"]);
        }
        this.getAdjuntosPrestamo();
      });
  }

  buildRegistroPropiedad(files) {
    if (!this.creditoService.validarPesoArchivo(files.item(0))) {
      return;
    }
    this.fileToUpload = files.item(0);
    this.nombreRegistroPropiedad = files.item(0).name;
    this.spinner.show();
    this.dataService.getBase64(this.fileToUpload).then(async (res: any) => {
      let data = {
        adjunto: res,
        name: this.nombreRegistroPropiedad,
        mimeType: files[0].type,
        idAdjunto: this.adjuntoRegistroPropiedad?.idAdjunto,
      };
      if (this.adjuntoRegistroPropiedad?.idAdjunto == null) {
        this.updateRegistroPropiedad(data, "POST");
      } else {
        this.updateRegistroPropiedad(data);
      }
    }),
      (error) => {
        this.spinner.hide();
        this.componentService.alerta(
          "error",
          "Ocurrió un error al traer el adjunto"
        );
      };
  }

  updateadjuntoPagare(data, tipo = "PUT") {
    this.adjuntosService
      .adjuntarPagare(tipo, data, this.prestamo.idParticipe, this.idPrestamo)
      .subscribe((res) => {
        this.spinner.hide();
        if (res["error"]) {
          return this.componentService.alerta("error", res["message"]);
        }
        this.getAdjuntosPrestamo();
      });
  }

  updateadjuntoAutorizacion(data, tipo = "PUT") {
    this.adjuntosService
      .adjuntarAutorizaciones(
        tipo,
        data,
        this.prestamo.idParticipe,
        this.idPrestamo
      )
      .subscribe((res) => {
        this.spinner.hide();
        if (res["error"]) {
          return this.componentService.alerta("error", res["message"]);
        }
        this.getAdjuntosPrestamo();
      });
  }

  buildadjuntoAutorizacion(files) {
    if (!this.creditoService.validarPesoArchivo(files.item(0))) {
      return;
    }
    this.fileToUpload = files.item(0);
    this.nombreAutorizacion = files.item(0).name;
    this.spinner.show();
    this.dataService.getBase64(this.fileToUpload).then(async (res: any) => {
      let data = {
        adjunto: res,
        name: this.nombreAutorizacion,
        mimeType: files[0].type,
        idAdjunto: this.adjuntoAutorizacion?.idAdjunto,
      };
      if (this.adjuntoAutorizacion?.idAdjunto == null) {
        this.updateadjuntoAutorizacion(data, "POST");
      } else {
        this.updateadjuntoAutorizacion(data);
      }
    }),
      (error) => {
        this.spinner.hide();
        this.componentService.alerta(
          "error",
          "Ocurrió un error al traer el adjunto"
        );
      };
  }

  buildadjuntoPagare(files) {
    if (!this.creditoService.validarPesoArchivo(files.item(0))) {
      return;
    }
    this.fileToUpload = files.item(0);
    this.nombrePagare = files.item(0).name;
    this.spinner.show();
    this.dataService.getBase64(this.fileToUpload).then(async (res: any) => {
      let data = {
        adjunto: res,
        name: this.nombrePagare,
        mimeType: files[0].type,
        idAdjunto: this.adjuntoPagare?.idAdjunto,
      };
      if (this.adjuntoPagare?.idAdjunto == null) {
        this.updateadjuntoPagare(data, "POST");
      } else {
        this.updateadjuntoPagare(data);
      }
    }),
      (error) => {
        this.spinner.hide();
        this.componentService.alerta(
          "error",
          "Ocurrió un error al traer el adjunto"
        );
      };
  }

  buildadjuntoDebito(files) {
    if (!this.creditoService.validarPesoArchivo(files.item(0))) {
      return;
    }
    this.fileToUpload = files.item(0);
    this.nombreDebitoPrestamo = files.item(0).name;
    this.spinner.show();
    this.dataService.getBase64(this.fileToUpload).then(async (res: any) => {
      let data: any = {
        adjunto: res,
        name: this.nombreDebitoPrestamo,
        mimeType: files[0].type,
        idAdjunto: this.adjuntoDebitoPrestamo?.idAdjunto,
        tipoAdjunto: TiposAdjunto.DebitoPrestamo,
      };
      if (this.adjuntoDebitoPrestamo?.idAdjunto == null) {
        this.updateadjuntoDebito(data, "POST");
      } else {
        this.updateadjuntoDebito(data);
      }
    }),
      (error) => {
        this.spinner.hide();
        this.componentService.alerta(
          "error",
          "Ocurrió un error al traer el adjunto"
        );
      };
  }

  updateadjuntoTabla(data, tipo = "PUT") {
    this.adjuntosService
      .adjuntarGeneral(
        tipo,
        data,
        this.prestamo.idParticipe,
        this.idPrestamo,
        "Tabla informativa"
      )
      .subscribe((res) => {
        this.spinner.hide();
        if (res["error"]) {
          return this.componentService.alerta("error", res["message"]);
        }
        this.getAdjuntosPrestamo();
      });
  }

  updateadjuntoDebito(data, tipo = "PUT") {
    this.adjuntosService
      .adjuntarGeneral(
        tipo,
        data,
        this.prestamo.idParticipe,
        this.idPrestamo,
        "Debito"
      )
      .subscribe((res) => {
        this.spinner.hide();
        if (res["error"]) {
          return this.componentService.alerta("error", res["message"]);
        }
        this.getAdjuntosPrestamo();
      });
  }

  buildadjuntoDeclaracionSeguro(files) {
    if (!this.creditoService.validarPesoArchivo(files.item(0))) {
      return;
    }
    this.fileToUpload = files.item(0);
    this.nombreDeclaracionSeguro = files.item(0).name;
    this.spinner.show();
    this.dataService.getBase64(this.fileToUpload).then(async (res: any) => {
      let data = {
        adjunto: res,
        name: this.nombreDeclaracionSeguro,
        mimeType: files[0].type,
        idAdjunto: this.adjuntoDeclaracionSeguro?.idAdjunto,
        tipoAdjunto: TiposAdjunto.DeclaracionSeguro,
      };
      if (this.adjuntoDeclaracionSeguro?.idAdjunto == null) {
        this.updateadjuntoDeclaracion(data, "POST");
      } else {
        this.updateadjuntoDeclaracion(data);
      }
    }),
      (error) => {
        this.spinner.hide();
        this.componentService.alerta(
          "error",
          "Ocurrió un error al traer el adjunto"
        );
      };
  }

  updateadjuntoDeclaracion(data, tipo = "PUT") {
    this.adjuntosService
      .adjuntarGeneral(
        tipo,
        data,
        this.prestamo.idParticipe,
        this.idPrestamo,
        "Declaracion seguro"
      )
      .subscribe((res) => {
        this.spinner.hide();
        if (res["error"]) {
          return this.componentService.alerta("error", res["message"]);
        }
        this.getAdjuntosPrestamo();
      });
  }

  buildadjuntoPagoProveedor(files) {
    if (!this.creditoService.validarPesoArchivo(files.item(0))) {
      return;
    }
    this.fileToUpload = files.item(0);
    this.nombrePagoProveedor = files.item(0).name;
    this.spinner.show();
    this.dataService.getBase64(this.fileToUpload).then(async (res: any) => {
      let data = {
        adjunto: res,
        name: this.nombrePagoProveedor,
        mimeType: files[0].type,
        idAdjunto: this.adjuntoPagoProveedor?.idAdjunto,
        tipoAdjunto: TiposAdjunto.PagoProveedorExpress,
      };
      if (this.adjuntoPagoProveedor?.idAdjunto == null) {
        this.updateadjuntoPagoProveedor(data, "POST");
      } else {
        this.updateadjuntoPagoProveedor(data);
      }
    }),
      (error) => {
        this.spinner.hide();
        this.componentService.alerta(
          "error",
          "Ocurrió un error al traer el adjunto"
        );
      };
  }

  updateadjuntoPagoProveedor(data, tipo = "PUT") {
    this.adjuntosService
      .adjuntarGeneral(
        tipo,
        data,
        this.prestamo.idParticipe,
        this.idPrestamo,
        "Autorizacion pago proveedor"
      )
      .subscribe((res) => {
        this.spinner.hide();
        if (res["error"]) {
          return this.componentService.alerta("error", res["message"]);
        }
        this.getAdjuntosPrestamo();
      });
  }

  buildadjuntoSolicitudCredito(files) {
    if (!this.creditoService.validarPesoArchivo(files.item(0))) {
      return;
    }
    this.fileToUpload = files.item(0);
    this.nombreSolicitudCredito = files.item(0).name;
    this.spinner.show();
    this.dataService.getBase64(this.fileToUpload).then(async (res: any) => {
      let data = {
        adjunto: res,
        name: this.nombreSolicitudCredito,
        mimeType: files[0].type,
        idAdjunto: this.adjuntoSolicitudCredito?.idAdjunto,
        tipoAdjunto: TiposAdjunto.SolicitudCredito,
      };
      if (this.adjuntoSolicitudCredito?.idAdjunto == null) {
        this.updatedGeneral(data, "Soliciud de credito", "POST");
      } else {
        this.updatedGeneral(data, "Soliciud de credito");
      }
    }),
      (error) => {
        this.spinner.hide();
        this.componentService.alerta(
          "error",
          "Ocurrió un error al traer el adjunto"
        );
      };
  }

  buildadjuntoSolicitudCreditoNovacion(files) {
    if (!this.creditoService.validarPesoArchivo(files.item(0))) {
      return;
    }
    this.fileToUpload = files.item(0);
    this.nombreSolicitudCreditoNovacion = files.item(0).name;
    this.spinner.show();
    this.dataService.getBase64(this.fileToUpload).then(async (res: any) => {
      let data = {
        adjunto: res,
        name: this.nombreSolicitudCreditoNovacion,
        mimeType: files[0].type,
        idAdjunto: this.adjuntoSolicitudCreditoNovacion?.idAdjunto,
        tipoAdjunto: TiposAdjunto.SolicitudCreditoNovacion,
      };
      if (this.adjuntoSolicitudCreditoNovacion?.idAdjunto == null) {
        this.updatedGeneral(data, "Soliciud de credito de novación", "POST");
      } else {
        this.updatedGeneral(data, "Soliciud de credito de novación");
      }
    }),
      (error) => {
        this.spinner.hide();
        this.componentService.alerta(
          "error",
          "Ocurrió un error al traer el adjunto"
        );
      };
  }

  updatedGeneral(data, nombre, tipo = "PUT") {
    this.adjuntosService
      .adjuntarGeneral(
        tipo,
        data,
        this.prestamo.idParticipe,
        this.idPrestamo,
        nombre
      )
      .subscribe((res) => {
        this.spinner.hide();
        if (res["error"]) {
          return this.componentService.alerta("error", res["message"]);
        }
        this.getAdjuntosPrestamo();
      });
  }

  buildadjuntoTabla(files) {
    if (!this.creditoService.validarPesoArchivo(files.item(0))) {
      return;
    }
    this.fileToUpload = files.item(0);
    this.nombreTablaCostos = files.item(0).name;
    this.spinner.show();
    this.dataService.getBase64(this.fileToUpload).then(async (res: any) => {
      let data = {
        adjunto: res,
        name: this.nombreTablaCostos,
        mimeType: files[0].type,
        idAdjunto: this.adjuntoTablaInformativa?.idAdjunto,
        tipoAdjunto: TiposAdjunto.TablaInformativa,
      };
      if (this.adjuntoTablaInformativa?.idAdjunto == null) {
        this.updateadjuntoTabla(data, "POST");
      } else {
        this.updateadjuntoTabla(data);
      }
    }),
      (error) => {
        this.spinner.hide();
        this.componentService.alerta(
          "error",
          "Ocurrió un error al traer el adjunto"
        );
      };
  }

  buildadjuntoResumenCredito(files) {
    if (!this.creditoService.validarPesoArchivo(files.item(0))) {
      return;
    }
    this.fileToUpload = files.item(0);
    this.nombrereResumenCredito = files.item(0).name;
    this.spinner.show();
    this.dataService.getBase64(this.fileToUpload).then(async (res: any) => {
      let data = {
        adjunto: res,
        name: this.nombrereResumenCredito,
        mimeType: files[0].type,
        idAdjunto: this.adjuntoResumenCredito?.idAdjunto,
        tipoAdjunto: TiposAdjunto.ResumenCredito,
      };
      if (this.adjuntoResumenCredito?.idAdjunto == null) {
        this.updateadjuntoResumen(data, "POST");
      } else {
        this.updateadjuntoResumen(data);
      }
    }),
      (error) => {
        this.spinner.hide();
        this.componentService.alerta(
          "error",
          "Ocurrió un error al traer el adjunto"
        );
      };
  }

  updateadjuntoResumen(data, tipo = "PUT") {
    this.adjuntosService
      .adjuntarGeneral(
        tipo,
        data,
        this.prestamo.idParticipe,
        this.idPrestamo,
        "Resumen de credito"
      )
      .subscribe((res) => {
        this.spinner.hide();
        if (res["error"]) {
          return this.componentService.alerta("error", res["message"]);
        }
        this.getAdjuntosPrestamo();
      });
  }

  updateadjuntoOtrosIngresos(data, tipo = "PUT") {
    this.adjuntosService
      .adjuntarOtrosIngresos(
        tipo,
        data,
        this.prestamo.idParticipe,
        this.idPrestamo
      )
      .subscribe((res) => {
        this.spinner.hide();
        if (res["error"]) {
          return this.componentService.alerta("error", res["message"]);
        }
        this.getAdjuntosPrestamo();
      });
  }

  buildadjuntoOtrosIngresos(files) {
    if (!this.creditoService.validarPesoArchivo(files.item(0))) {
      return;
    }
    this.fileToUpload = files.item(0);
    this.nombreOtrosIngresos = files.item(0).name;
    this.spinner.show();
    this.dataService.getBase64(this.fileToUpload).then(async (res: any) => {
      let data = {
        adjunto: res,
        name: this.nombreOtrosIngresos,
        mimeType: files[0].type,
        idAdjunto: this.adjuntoOtrosIngresos?.idAdjunto,
      };
      if (this.adjuntoOtrosIngresos?.idAdjunto == null) {
        this.updateadjuntoOtrosIngresos(data, "POST");
      } else {
        this.updateadjuntoOtrosIngresos(data);
      }
    }),
      (error) => {
        this.spinner.hide();
        this.componentService.alerta(
          "error",
          "Ocurrió un error al traer el adjunto"
        );
      };
  }

  updateadjuntoLiquidacionBIESS(data, tipo = "PUT") {
    this.adjuntosService
      .adjuntarLiquidacionBIESS(
        tipo,
        data,
        this.prestamo.idParticipe,
        this.idPrestamo
      )
      .subscribe((res) => {
        this.spinner.hide();
        if (res["error"]) {
          return this.componentService.alerta("error", res["message"]);
        }
        this.getAdjuntosPrestamo();
      });
  }

  buildadjuntoLiquidacionBIESS(files) {
    if (!this.creditoService.validarPesoArchivo(files.item(0))) {
      return;
    }
    this.fileToUpload = files.item(0);
    this.nombreLiquidacion = files.item(0).name;
    this.spinner.show();
    this.dataService.getBase64(this.fileToUpload).then(async (res: any) => {
      let data = {
        adjunto: res,
        name: this.nombreLiquidacion,
        mimeType: files[0].type,
        idAdjunto: this.adjuntoLiquidacionBIESS?.idAdjunto,
      };
      if (this.adjuntoLiquidacionBIESS?.idAdjunto == null) {
        this.updateadjuntoLiquidacionBIESS(data, "POST");
      } else {
        this.updateadjuntoLiquidacionBIESS(data);
      }
    }),
      (error) => {
        this.spinner.hide();
        this.componentService.alerta(
          "error",
          "Ocurrió un error al traer el adjunto"
        );
      };
  }

  updateadjuntoProforma(data, tipo = "PUT") {
    this.adjuntosService
      .adjuntarProforma(tipo, data, this.prestamo.idParticipe, this.idPrestamo)
      .subscribe((res) => {
        this.spinner.hide();
        if (res["error"]) {
          return this.componentService.alerta("error", res["message"]);
        }
        this.getAdjuntosPrestamo();
      });
  }

  buildadjuntoProforma(files) {
    if (!this.creditoService.validarPesoArchivo(files.item(0))) {
      return;
    }
    this.fileToUpload = files.item(0);
    this.nombreProformaVehiculo = files.item(0).name;
    this.spinner.show();
    this.dataService.getBase64(this.fileToUpload).then(async (res: any) => {
      let data = {
        adjunto: res,
        name: this.nombreProformaVehiculo,
        mimeType: files[0].type,
        idAdjunto: this.adjuntoProformaVehiculo?.idAdjunto,
      };
      if (this.adjuntoProformaVehiculo?.idAdjunto == null) {
        this.updateadjuntoProforma(data, "POST");
      } else {
        this.updateadjuntoProforma(data);
      }
    }),
      (error) => {
        this.spinner.hide();
        this.componentService.alerta(
          "error",
          "Ocurrió un error al traer el adjunto"
        );
      };
  }

  updateadjuntofirmaSolicitud(data, tipo = "PUT") {
    this.adjuntosService
      .adjuntarSolicitud(tipo, data, this.prestamo.idParticipe, this.idPrestamo)
      .subscribe((res) => {
        this.spinner.hide();
        if (res["error"]) {
          return this.componentService.alerta("error", res["message"]);
        }
        this.getAdjuntosPrestamo();
      });
  }

  buildadjuntofirmaSolicitud(files) {
    if (!this.creditoService.validarPesoArchivo(files.item(0))) {
      return;
    }
    this.fileToUpload = files.item(0);
    this.nombreSolicitud = files.item(0).name;
    this.spinner.show();
    this.dataService.getBase64(this.fileToUpload).then(async (res: any) => {
      let data = {
        adjunto: res,
        name: this.nombreSolicitud,
        mimeType: files[0].type,
        idAdjunto: this.adjuntofirmaSolicitud?.idAdjunto,
      };
      if (this.adjuntofirmaSolicitud?.idAdjunto == null) {
        this.updateadjuntofirmaSolicitud(data, "POST");
      } else {
        this.updateadjuntofirmaSolicitud(data);
      }
    }),
      (error) => {
        this.spinner.hide();
        this.componentService.alerta(
          "error",
          "Ocurrió un error al traer el adjunto"
        );
      };
  }

  public setInnerHtmlAdjunto(pdfurl: string) {
    return this.sanitizer.bypassSecurityTrustHtml(
      "<object data='" +
        pdfurl +
        "' type='application/pdf' class='embed-responsive-item' style='width: 100%; height: 100% !important;'>" +
        "Object " +
        pdfurl +
        " failed" +
        "</object>"
    );
  }

  getAdjuntosPrestamo() {
    this.dataService.newGetAdjuntoIdPrestamo(this.idPrestamo).subscribe(
      (res) => {
        if (res["result"].length > 0) {
          this.tipoAdjunto(res["result"]);
        } else {
          /*   this.componentes.errorHandler("No se ha encontrado el archivo"); */
        }
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        /*    this.componentes.errorHandler(error); */
      }
    );
  }
  adjuntosByProducto() {
    //DATOS DEL PRESTAMO
    /*    this.getAdjuntos(this.idPrestamo); */
    this.getAdjuntosPrestamo();

    this.getDeclaracionSeguro();
    switch (this.idProducto) {
      case 4:
        this.hipotecario = true;
        this.showAdjuntosTipoCredito = {
          CedulaConyugeFrontal: false,
          CedulaConyugePosterior: false,
          RegistroPropiedad: false,
          CertificadoPredio: false,
          croquis: false,
          AutorizacionBuro: false,
          Autorizacion: false,
          OtrosIngresos: true,
          RolPagos: false,
          LiquidacionBIESS: false,
          Proforma: false,
          firmaSolicitud: false,
        };
        break;
      case 9:
        this.hipotecario = true;
        this.showAdjuntosTipoCredito = {
          CedulaConyugeFrontal: true,
          CedulaConyugePosterior: true,
          RegistroPropiedad: true,
          CertificadoPredio: true,
          croquis: true,
          AutorizacionBuro: true,
          Autorizacion: false,
          OtrosIngresos: true,
          RolPagos: false,
          LiquidacionBIESS: false,
          Proforma: false,
          firmaSolicitud: false,
        };
        /*  this.getAdjuntosHipotecario(this.idPrestamo); */

        break;

      case 3:
        this.prendario = true;
        this.showAdjuntosTipoCredito = {
          CedulaConyugeFrontal: true,
          CedulaConyugePosterior: true,
          RegistroPropiedad: false,
          CertificadoPredio: false,
          croquis: false,
          Autorizacion: false,
          OtrosIngresos: true,
          RolPagos: false,
          LiquidacionBIESS: false,
          AutorizacionBuro: true,
          Proforma: true,
          firmaSolicitud: false,
        };
        break;
      case 7:
        this.creditoExpress = true;
        this.showAdjuntosTipoCredito = {
          CedulaConyugeFrontal: false,
          CedulaConyugePosterior: false,
          RegistroPropiedad: false,
          CertificadoPredio: false,
          croquis: false,
          Autorizacion: false,
          OtrosIngresos: false,
          RolPagos: false,
          LiquidacionBIESS: false,
          AutorizacionBuro: false,
          Proforma: true,
          firmaSolicitud: false,
        };
        break;
      default:
        this.showAdjuntosTipoCredito = {
          Autorizacion: true,
          OtrosIngresos: true,
          LiquidacionBIESS: true,
          CedulaConyugeFrontal: false,
          CedulaConyugePosterior: false,
          RegistroPropiedad: false,
          CertificadoPredio: false,
          croquis: false,
          AutorizacionBuro: false,
          RolPagos: false,
          Proforma: false,
          firmaSolicitud: false,
        };
        break;
    }
  }
  getDeclaracionSeguro() {
    this.dataService
      .newGetAdjuntoById(this.idEntidad, TiposAdjunto.DeclaracionSeguro)
      .subscribe(
        (res) => {
          if (res["result"].length > 0) {
            let adjunto = res["result"][0];

            this.adjuntoDeclaracionSeguro = this.generarAdjunto(adjunto);
          } else {
            /*   this.componentes.errorHandler("No se ha encontrado el archivo"); */
          }
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          /*    this.componentes.errorHandler(error); */
        }
      );
  }
  /*   
  // TRAER LOS ARCHIVOS ADJUNTOS
  getAdjuntos(idPrestamo) {
    console.log("ESTADO = ", this.estado);
    console.log("DATA = ", this.prestamo);
    // RESUMEN DE CREDITO
    if(this.prestamo.electronica){
      if (this.estado? == "firmado" || this.estado == 'pagado' || this.estado == "completado" || this.estado == "legalizado" || this.estado == "transferido") {
        this.creditoService
          .getAdjuntosByIdPrestamo(idPrestamo, "ResumenCredito")
          .subscribe(
            (resumenCredito) => {
              this.setInnerHtmlResumen(
                resumenCredito["changingThisBreaksApplicationSecurity"]
              );
              this.spinner.hide();
            },
            (error) => {}
          );
      }
    }
    // PAGARE
    if (this.estado? == "firmado" || this.estado == 'pagado' || this.estado == "completado" || this.estado == "legalizado" || this.estado == "transferido") {
      this.creditoService
        .getAdjuntosByIdPrestamo(idPrestamo, "Pagare")
        .subscribe(
          (pagare) => {
            this.setInnerHtmlPagare(
              pagare["changingThisBreaksApplicationSecurity"]
            );
            this.spinner.hide();
          },
          (error) => {}
        );
    }
    // AUTORIZACION DE DEBITO
    if (this.estado? == "firmado" || this.estado == 'pagado' || this.estado == "completado" || this.estado == "legalizado" || this.estado == "transferido") {
      this.spinner.show();
      this.creditoService
        .getAdjuntosByIdPrestamo(idPrestamo, "DebitoPrestamo")
        .subscribe(
          (autorizacion) => {
            this.setInnerHtmlAutorizacion(
              autorizacion["changingThisBreaksApplicationSecurity"]
            );
          },
          (error) => {}
        );
    }

    // TABLA INFORMATIVA COSTOS
    if (this.estado? == "firmado" || this.estado == 'pagado' || this.estado == "completado" || this.estado == "legalizado" || this.estado == "transferido") {
      this.spinner.show();
      this.creditoService
        .getAdjuntosByIdPrestamo(idPrestamo, "TablaCostos")
        .subscribe(
          (autorizacion) => {
            this.setInnerHtmlTabla(
              autorizacion["changingThisBreaksApplicationSecurity"]
            );
          },
          (error) => {}
        );
    }

   
    // DCLARACIÓN DE ASEGURABILIDAD
    this.creditoService
      .getAdjuntosByIdPrestamo(idPrestamo, "DeclaracionSeguro")
      .subscribe(
        (declaracion) => {
          this.setInnerHtmlDeclaracion(
            declaracion["changingThisBreaksApplicationSecurity"]
          );
        },
        (error) => {}
      );

  }

  // SUBIR - POST
  cargarArchivo(files: FileList, tipo) {
    switch (tipo) {
      case "Pagare":
        this.fileToUpload = files.item(0);
        this.nombrePagare = files.item(0).name;
        this.spinner.show();
        this.dataService.getBase64(this.fileToUpload).then(
          (res: any) => {
            const data = {
              tipoAdjunto: tipo,
              adjunto: res,
            };
            this.creditoService
              .postPrestamoAdjuntos(this.idPrestamo, data)
              .subscribe(
                (ress) => {
                  this.getAdjuntos(this.idPrestamo);
                },
                (error) => {}
              );
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
            this.componentService.alerta(
              "error",
              "Ocurrió un error al traer el adjunto"
            );
          }
        );

        break;
      case "DebitoPrestamo":
        this.fileToUpload = files.item(0);
        this.nombreDebitoPrestamo = files.item(0).name;
        this.spinner.show();
        this.dataService.getBase64(this.fileToUpload).then(
          (res: any) => {
            const data = {
              tipoAdjunto: tipo,
              adjunto: res,
            };
            this.creditoService
              .postPrestamoAdjuntos(this.idPrestamo, data)
              .subscribe(
                (ress) => {
                  this.getAdjuntos(this.idPrestamo);
                },
                (error) => {}
              );
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
            this.componentService.alerta(
              "error",
              "Ocurrió un error al traer el adjunto"
            );
          }
        );

        case "PagoProveedorExpress":
          this.fileToUpload = files.item(0);
          this.nombrePagoProveedor = files.item(0).name;
          this.spinner.show();
          this.dataService.getBase64(this.fileToUpload).then(
            (res: any) => {
              const data = {
                tipoAdjunto: tipo,
                adjunto: res,
              };
              this.creditoService
                .postPrestamoAdjuntos(this.idPrestamo, data)
                .subscribe(
                  (ress) => {
                    this.getAdjuntos(this.idPrestamo);
                  },
                  (error) => {}
                );
              this.spinner.hide();
            },
            (error) => {
              this.spinner.hide();
              this.componentService.alerta(
                "error",
                "Ocurrió un error al traer el adjunto"
              );
            }
          );

        break;
      case "DeclaracionSeguro":
        this.fileToUpload = files.item(0);
        this.nombreDeclaracionSeguro = files.item(0).name;
        this.spinner.show();
        this.dataService.getBase64(this.fileToUpload).then(
          (res: any) => {
            const data = {
              tipoAdjunto: tipo,
              adjunto: res,
            };
            this.creditoService
              .postPrestamoAdjuntos(this.idPrestamo, data)
              .subscribe(
                (res) => {
                  this.getAdjuntos(this.idPrestamo);
                },
                (error) => {}
              );
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
            this.componentService.alerta(
              "error",
              "Ocurrio un error al traer el adjunto"
            );
          }
        );

        break;

      case "TablaCostos":
        this.fileToUpload = files.item(0);
        this.nombreTablaCostos = files.item(0).name;
        this.spinner.show();
        this.dataService.getBase64(this.fileToUpload).then(
          (res: any) => {
            const data = {
              tipoAdjunto: tipo,
              adjunto: res,
            };
            this.creditoService
              .postPrestamoAdjuntos(this.idPrestamo, data)
              .subscribe(
                (res) => {
                  this.getAdjuntos(this.idPrestamo);
                },
                (error) => {}
              );
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
            this.componentService.alerta(
              "error",
              "Ocurrio un error al traer el adjunto"
            );
          }
        );

        break;


      default:
        break;
    }
  }


   
    


  getAdjuntosExpress(idPrestamo) {

    // AUTORIZACION PAGO PROVEEDORES
    this.spinner.show();
    this.creditoService
      .getAdjuntosByIdPrestamo(idPrestamo, "PagoProveedorExpress")
      .subscribe(
        (pagoProveedor) => {
          this.setHtmlPagoProveedores(
            pagoProveedor["changingThisBreaksApplicationSecurity"]
          );
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }




  public innerHtml: SafeHtml;
  public setInnerHtml(pdfurl: string) {
    this.innerHtml = this.sanitizer.bypassSecurityTrustHtml(
      "<object data='" +
        pdfurl +
        "' type='application/pdf' class='embed-responsive-item' style='width: 100%; height: 100% !important;'>" +
        "Object " +
        pdfurl +
        " failed" +
        "</object>"
    );
  }

  public innerHtmlResumen: SafeHtml;
  public setInnerHtmlResumen(pdfurl: string) {
    this.innerHtmlResumen = this.sanitizer.bypassSecurityTrustHtml(
      "<object data='" +
        pdfurl +
        "' type='application/pdf' class='embed-responsive-item' style='width: 100%; height: 100% !important;'>" +
        "Object " +
        pdfurl +
        " failed" +
        "</object>"
    );
  }
  
  public innerHtmlPagare: SafeHtml;
  public setInnerHtmlPagare(pdfurl: string) {
    this.innerHtmlPagare = this.sanitizer.bypassSecurityTrustHtml(
      "<object data='" +
        pdfurl +
        "' type='application/pdf' class='embed-responsive-item' style='width: 100%; height: 100% !important;'>" +
        "Object " +
        pdfurl +
        " failed" +
        "</object>"
    );
  }

  public innerHtmlAutorizacion: SafeHtml;
  public setInnerHtmlAutorizacion(pdfurl: string) {
    this.innerHtmlAutorizacion = this.sanitizer.bypassSecurityTrustHtml(
      "<object data='" +
        pdfurl +
        "' type='application/pdf' class='embed-responsive-item' style='width: 100%; height: 100% !important;'>" +
        "Object " +
        pdfurl +
        " failed" +
        "</object>"
    );
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


  public innerHtmlCreditosUniformados: SafeHtml;
  public setHtmlCreditosUniformados(pdfurl: string) {
    this.innerHtmlCreditosUniformados = this.sanitizer.bypassSecurityTrustHtml(
      "<object data='" +
        pdfurl +
        "' type='application/pdf' class='embed-responsive-item' style='width: 100%; height: 100% !important;'>" +
        "Object " +
        pdfurl +
        " failed" +
        "</object>"
    );
  }

  public innerHtmlPagoProveedores: SafeHtml;
  public setHtmlPagoProveedores(pdfurl: string) {
    this.innerHtmlPagoProveedores = this.sanitizer.bypassSecurityTrustHtml(
      "<object data='" +
        pdfurl +
        "' type='application/pdf' class='embed-responsive-item' style='width: 100%; height: 100% !important;'>" +
        "Object " +
        pdfurl +
        " failed" +
        "</object>"
    );
  } */
}
