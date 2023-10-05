import { Component, Input, OnInit } from "@angular/core";
import { Prestamo } from "src/app/model/models";
import { CreditosService } from "../../creditos.service";
import icSave from "@iconify/icons-fa-solid/save";
import icPrint from "@iconify/icons-fa-solid/print";
import icDescription from "@iconify/icons-ic/twotone-description";
import { NgxSpinnerService } from "ngx-spinner";
import { ComponentesService } from "src/app/services/componentes.service";
import { DataService } from "src/app/services/data.service";
import { TiposAdjunto } from "src/@vex/interfaces/enums";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "vex-info-credito",
  templateUrl: "./info-credito.component.html",
  styleUrls: ["./info-credito.component.scss"],
})
export class InfoCreditoComponent implements OnInit {
  @Input() prestamo: Prestamo = {};
  @Input() validaciones: any;
  @Input() garantes: any[] = [];
  @Input() idPrestamo: number;

  prestamosRelacionados = [];

  icSave = icSave;
  icPrint = icPrint;
  icDescription = icDescription;
  pdfprueba: any;

  constructor(
    private creditoService: CreditosService,
    private componentes: ComponentesService,
    private spinner: NgxSpinnerService,
    private dataService: DataService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.creditoService
      .getPrestamosRelacionados(this.idPrestamo)
      .subscribe((res: any) => {
        this.prestamosRelacionados = res["result"];
      });
  }

  getResumenCredito() {
    this.spinner.show();
    this.creditoService.getResumenCreditoById(this.idPrestamo).subscribe(
      (res) => {
        this.spinner.hide();
        let link = document.createElement("a");
        link.setAttribute("download", "Resumen Crédito");
        link.style.display = "none";
        document.body.appendChild(link);
        window.open(res["changingThisBreaksApplicationSecurity"]);
        document.body.removeChild(link);
      },
      (error) => {
        this.spinner.hide();
        console.log("ERROR AL DESCARGAR EL RESUMEN");
      }
    );
  }

  openFile(tipo, res) {
    let link = document.createElement("a");
    link.setAttribute("download", tipo);
    link.style.display = "none";
    window.open(res["changingThisBreaksApplicationSecurity"]);
    document.body.appendChild(link);
    document.body.removeChild(link);
  }

  descargarAdjuntosGarante(idParticipe, tipo: number) {
    this.spinner.show();
    if (tipo == 22) {
      this.dataService.newGetAdjunto(this.idPrestamo, tipo).subscribe(
        (res) => {
          if (res["result"].length > 0) {
            let link = document.createElement("a");
            link.setAttribute("download", "rol de pagos");
            link.style.display = "none";
            document.body.appendChild(link);
            window.open(res["result"][0]["url"]);
            document.body.removeChild(link);
          } else {
            this.componentes.alerta("info", "No se encontró el rol de pagos");
          }
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          this.componentes.errorHandler(error);
        }
      );
    } else {
      console.log("idParticipe", idParticipe);
      this.dataService.newGetAdjuntoById(idParticipe, tipo).subscribe(
        (res: any) => {
          this.spinner.hide();
          if (res["result"].length > 0) {
            window.open(res.result[0]["url"]);
          } else {
            this.componentes.alerta("info", "No se encontró el adjunto");
          }
        },
        (error) => {
          this.spinner.hide();
          this.componentes.errorHandler(error);
        }
      );
    }
  }
}
