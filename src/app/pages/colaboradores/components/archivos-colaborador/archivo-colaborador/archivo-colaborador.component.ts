import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";
import { Component, EventEmitter, Input, Output } from "@angular/core";

import { DataService } from "src/app/services/data.service";
import { iconify } from "src/static-data/icons";
import { AdjuntosColaborador } from "../../../models/colaboradores";

import { ColaboradorService } from "../../../services/colaborador.service";

@Component({
  selector: "vex-archivo-colaborador",
  templateUrl: "./archivo-colaborador.component.html",
  styleUrls: ["./archivo-colaborador.component.scss"],
})
export class ArchivoColaboradorComponent {
  //Output
  @Output() callCargarAdjuntosChild = new EventEmitter<any>();
  @Output() emitirIdAdjunto = new EventEmitter<any>();

  @Input() idColaborador: any;
  @Input() archivo: any;
  @Input() tipoColaborador: any;
  @Input() controlView: any;
  @Input() nombreSeccion: string = "todos";
  @Input() idFormacionAcademica: any;
  @Input() idReferenciaPersonal: any;
  @Input() idReferenciaBancaria: any;
  @Input() idVehiculo: any;
  @Input() adjuntoColaborador: AdjuntosColaborador;
  @Input() visualizationMode: boolean = false;

  //iconos
  icCheck = iconify.icroundCheckCircle;
  icCancel = iconify.icroundCancel;
  icDownload = iconify.icroundFileDownload;
  icNoDownload = iconify.icroundFileDowloadOff;
  icUpload = iconify.icroundFileUpload;
  icDelete = iconify.icroundDelete;
  icPriority_high = iconify.icpriorityHigh;
  icLoading = iconify.ictwotoneDownloading;

  constructor(
    private colaboradorService: ColaboradorService,
    private dataService: DataService,
    private utilService: UtilsService
  ) {}

  loading = false;

  validarFormato(file) {
    if (
      file.type != "application/pdf" &&
      file.type != "application/msword" &&
      file.type !=
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
      file.type != "application/vnd.ms-excel" &&
      file.type !=
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      this.loading = false;

      this.utilService.alerta("error", "El archivo debe ser pdf, word o excel");
      return false;
    } else {
      return true;
    }
  }

  agregarArchivo(event: any, idTipoAdunto: number, numeroArchivos: number) {
    this.loading = true;
    if (numeroArchivos > 0) {
      this.loading = false;

      this.utilService.alerta(
        "warning",
        "Ya existe un archivo cargado, por favor elimine el archivo para cargar uno nuevo",
        3000
      );
    } else {
      let file = event.target.files[0];

      if (!this.validarFormato(file)) {
        return;
      }

      this.dataService.getBase64(file).then((base: string) => {
        let data = {
          tipoAdjunto: idTipoAdunto,
          name: file.name,
          mimeType: file.type,

          adjunto: base,
          observaciones: "adjunto",
          idFormacionAcademica: this.idFormacionAcademica,
          idReferenciaPersonal: this.idReferenciaPersonal,
          idReferenciaBancaria: this.idReferenciaBancaria,

          idVehiculo: this.idVehiculo,
        };

        this.dataService.newPostAdjunto(data,this.idColaborador ).subscribe(
          (res: any) => {
            this.callCargarAdjuntosChild.emit("complete");
            this.emitirIdAdjunto.emit(res.result.idAdjunto);
            this.loading = false;
          },
          (err) => {
            this.loading = false;

            this.utilService.alerta("error", "Error al cargar el archivo");
          }
        );
      });
    }
  }

  downloadFile(file: any) {
    window.open(file.url, "_blank");
  }

  agregarArchivosMultiples(event: any, idTipoAdunto: number) {
    this.loading = true;
    for (const element of event.target.files) {
      let file = element;

      if (!this.validarFormato(file)) {
        return;
      }
      this.dataService.getBase64(file).then((base: string) => {
        let data = {
          tipoAdjunto: idTipoAdunto,
          name: file.name,
          mimeType: file.type,

          adjunto: base,
          observaciones: "adjunto",
          idFormacionAcademica: this.idFormacionAcademica,
          idReferenciaPersonal: this.idReferenciaPersonal,
          idReferenciaBancaria: this.idReferenciaBancaria,
          idVehiculo: this.idVehiculo,
        };

        this.dataService.newPostAdjunto(data,this.idColaborador ).subscribe(
          (res: any) => {
            this.callCargarAdjuntosChild.emit(idTipoAdunto);

            let dataEmitir = {
              idAdjunto: res.result.idAdjunto,
              adjunto: {
                tipoAdjunto: idTipoAdunto,
                name: file.name,
                mimeType: file.type,

                adjunto: base,
                observaciones: "adjunto",
              },
            };
            this.emitirIdAdjunto.emit(dataEmitir);

            this.loading = false;
          },
          (err) => {
            this.loading = false;

            this.utilService.alerta("error", "Error al subir el archivo");
          }
        );
      });
    }
  }

  removerArchivosMultiples(idAdjunto: any) {
    this.loading = true;
/*     this.idColaborador */
    this.dataService
      .newDeleteAdjunto( idAdjunto)
      .subscribe(
        (res: any) => {
          this.callCargarAdjuntosChild.emit("complete");
          this.emitirIdAdjunto.emit("delete");
          this.loading = false;
        },
        (err) => {
          this.loading = false;

          this.utilService.alerta("error", "Error al eliminar el archivo");
        }
      );
  }
}
