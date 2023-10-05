import { Component, Input, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { Participe, Prestamo } from "src/app/model/models";
import { ComponentesService } from "src/app/services/componentes.service";
import { DataService } from "src/app/services/data.service";
import icDescription from "@iconify/icons-ic/twotone-description";

@Component({
  selector: "vex-adjuntos-participe",
  templateUrl: "./adjuntos-participe.component.html",
  styleUrls: ["./adjuntos-participe.component.scss"],
})
export class AdjuntosParticipeComponent implements OnInit {
  @Input() prestamo: Prestamo;
  @Input() participe: Participe;
  @Input() referenciaBancaria: any[] = [];
  @Input() cedulaFrontal: any;
  @Input() cedulaPosterior: any;

  icDescription = icDescription;
  isLoading = false;

  constructor(
    private spinner: NgxSpinnerService,
    private dataService: DataService,
    private componentService: ComponentesService
  ) {}

  ngOnInit(): void {}

  descargarCedulaFrontal() {
    window.open(this.cedulaFrontal);
  }

  descargarCedulaPosterior() {
    window.open(this.cedulaPosterior);
  }
  descargarCertificado(item) {
    if (item.url) {
      window.open(item.url);
    } else {
      this.spinner.show();
      this.dataService
        .getReferenciaBancaria(item.idReferenciaBancaria)
        .subscribe(
          (res) => {
            window.open(res["changingThisBreaksApplicationSecurity"]);
            this.spinner.hide();
          },
          (error) => {
            //si el error es 404
            if (error.status == 404) {
              //se muestra el mensaje de Se ha producido un error, por favor ingrese un adjunto nuevo
              this.componentService.alerta(
                "error",
                "Se ha producido un error al descargar el adjunto"
              );
            } else {
              //si no es 404 se muestra el mensaje de Se ha producido un error, por favor intente nuevamente
              this.componentService.alerta(
                "error",
                "Se ha producido un error, por favor intente nuevamente"
              );
            }
            this.spinner.hide();
          }
        );
    }
  }
}
