import { Component, OnInit, Inject, ChangeDetectorRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { DataService } from "../../../services/data.service";
import { ComponentesService } from "../../../services/componentes.service";
import moment from "moment";
import { FormGroup } from "@angular/forms";
import { CreditosService } from "../creditos.service";
import { AuthService } from "../../auth/auth.service";
import { ReportesService } from "../../reportes/reportes.service";

@Component({
  selector: "vex-modal-pagare-firmado",
  templateUrl: "./modal-pagare-firmado.component.html",
  styleUrls: ["./modal-pagare-firmado.component.scss"],
})
export class ModalPagareFirmadoComponent implements OnInit {
  datosCreditoFormGroup: FormGroup;

  idPrestamo;
  pagare = false;
  pagareFirmado = false;
  declaracion = false;
  declaracionAsegurabilidad = false;
  autorizaciondebito = false;
  autorizaciondebitoFirmado = false;
  informativa = false;
  tablaInformativa = false;
  pagoProveedorFirmado = false;
  pagoProveedor = false;
  fileToUpload;
  date = moment().format();

  firmarPagare = false;
  alertaTransferir = false;

  documentos = {
    comentarios: "",
    funcionario: "",
    fecha: "",
    pagare: "",
    cartaDebito: "",
    declaracionSeguro: "N/A",
    tablaInformativa: "",
    pagoProveedor: "",
  };

  constructor(
    public dialogRef: MatDialogRef<ModalPagareFirmadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner: NgxSpinnerService,
    private dataService: DataService,
    private changeDetectorRefs: ChangeDetectorRef,
    private component: ComponentesService,
    private creditoService: CreditosService,
    private authService: AuthService,
    private reportService: ReportesService
  ) {}

  ngOnInit(): void {
    this.detectarCambios();
    this.idPrestamo = this.data["data"];
    this.documentos.funcionario = this.authService.getFuncionario();
    this.documentos.fecha = this.date;
  }

  detectarCambios() {
    this.changeDetectorRefs.detectChanges();
  }

  getPagare() {
    this.spinner.show();
    this.reportService.getPrestamosPagareById(this.idPrestamo).subscribe(
      (res) => {
        this.spinner.hide();
        var link = document.createElement("a");
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
        var link = document.createElement("a");
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
      .getPrestamoAutorizacionDebitoById(this.data["data"])
      .subscribe(
        (res) => {
          this.spinner.hide();
          var link = document.createElement("a");
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
            "Ocurrio un error al descargar el documento"
          );
        }
      );
  }

  getDeclaracionAsegurabilidad() {
    this.spinner.show();
    this.spinner.hide();
    var link = document.createElement("a");
    link.setAttribute("download", "debitos");
    link.style.display = "none";
    document.body.appendChild(link);
    window.open(
      "https://api.fcpc-cte.com/files/DECLARACION_DE_ASEGURABILIDAD_COMPLETA.pdf"
    );
    document.body.removeChild(link);
    this.declaracionAsegurabilidad = true;
  }

  getTablaInformativa() {
    this.spinner.show();
    this.spinner.hide();
    var link = document.createElement("a");
    link.setAttribute("download", "tabla");
    link.style.display = "none";
    document.body.appendChild(link);
    window.open(
      "http://api.fcpc-cte.com/files/TABLA_INFORMATIVA_DE_COSTOS.pdf"
    );
    document.body.removeChild(link);
    this.informativa = true;
  }

  async handleFileInput(files: FileList, tipo) {
    switch (tipo) {
      case "pagare":
        this.fileToUpload = files.item(0);
        this.spinner.show();
        this.dataService.getBase64(this.fileToUpload).then(
          (res: any) => {
            this.documentos.pagare = res;
            this.pagareFirmado = true;
            this.spinner.hide();
            this.detectarCambios();
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
            this.spinner.hide();
            this.documentos.cartaDebito = res;
            this.autorizaciondebitoFirmado = true;
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
            this.spinner.hide();
            this.documentos.declaracionSeguro = res;
            this.declaracionAsegurabilidad = true;
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
            this.spinner.hide();
            this.documentos.tablaInformativa = res;
            this.tablaInformativa = true;
          },
          (error) => {
            this.spinner.hide();
          }
        );
        break;

      case "proveedor":
        this.fileToUpload = files.item(0);
        this.spinner.show();
        this.dataService.getBase64(this.fileToUpload).then(
          (res: any) => {
            this.spinner.hide();
            this.documentos.pagoProveedor = res;
            this.pagoProveedorFirmado = true;
          },
          (error) => {
            this.spinner.hide();
          }
        );
        break;

      default:
        this.detectarCambios();
        break;
    }
  }

  subirDatos(comentarios) {
    if (comentarios != "") {
      this.documentos.comentarios = comentarios;
    }
    this.spinner.show();
    if (this.pagareFirmado && this.autorizaciondebitoFirmado) {
      this.creditoService
        .postPrestamoPagare(this.idPrestamo, this.documentos)
        .subscribe(
          (item) => {
            this.spinner.hide();
            this.detectarCambios();
            if (item["success"]) {
              this.component
                .alerta("success", "Documentos subidos exitosamente")
                .then(() => {
                  location.reload();
                });
            } else {
              this.component.alerta(
                "error",
                `Ocurrió un error al intentar subir los documentos ${item["message"]} `
              );
            }
          },
          (error) => {
            this.spinner.hide();
            this.component.alerta("error", error["message"]);
          }
        );
    } else {
      this.spinner.hide();
      this.component.alerta("info", "Debe subir los documentos firmados");
    }
  }
}
