import { DataSave } from "./../ajuntos-general";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AdjuntoGeneral, AdjuntosList } from "../ajuntos-general";
import { DataService } from "src/app/services/data.service";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";
import { iconify } from "src/static-data/icons";
import { finalize } from "rxjs/operators";
import { PostAdjunto } from "src/app/model/models";

@Component({
  selector: "vex-adjunto-general",
  templateUrl: "./adjunto-general.component.html",
  styleUrls: ["./adjunto-general.component.scss"],
})
export class AdjuntoGeneralComponent implements OnInit {
  @Input() id: any;
  @Input() idTipoAdjunto: any = null;
  @Input() adjuntoList: AdjuntosList;
  @Input() visualizationMode: boolean = false;
  icCheck = iconify.icroundCheckCircle;
  icCancel = iconify.icroundCancel;
  icDownload = iconify.icroundFileDownload;
  icNoDownload = iconify.icroundFileDowloadOff;
  icUpload = iconify.icroundFileUpload;
  icDelete = iconify.icroundDelete;
  icPriority_high = iconify.icpriorityHigh;
  icLoading = iconify.ictwotoneDownloading;
  loading = false;

  constructor(
    private dataService: DataService,
    private utilService: UtilsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    //get adjuntos
    this.getAdjuntos();
  
  }

  getAdjuntos() {
    this.loading = true;
    this.dataService
      .newGetAdjuntoById(
        this.id,
        this.adjuntoList.idTipoAdjunto,
        this.adjuntoList.idPrestamo
      )
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe(
        (res: any) => {
          if (
            this.adjuntoList.idTipoAdjunto == 1 ||
            this.adjuntoList.idTipoAdjunto == 2
          ) {
            res.result = res.result.filter((x) => x.idPrestamo == null);
          }

          this.adjuntoList.adjuntos = res.result;
        },
        (err) => {
          this.utilService.alerta("error", "Error al obtener los archivos");
        }
      );
  }

  removerArchivosMultiples(idAdjunto: any) {
    this.utilService
      .confirmar("Eliminar adjunto", "¿Está seguro de eliminar el adjunto?")
      .then((result) => {
        if (result.isConfirmed) {
          this.loading = true;
          this.changeDetectorRef.detectChanges();
          this.eliminarAdjunto(idAdjunto);
        }
      });
  }

  eliminarAdjunto(idAdjunto: any) {
    this.dataService
      .newDeleteAdjunto(idAdjunto)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe(
        (res: any) => {
          this.getAdjuntos();
          this.utilService.alerta("success", "Archivo eliminado con éxito");
        },
        (err) => {
          this.utilService.alerta("error", "Error al eliminar el archivo");
        }
      );
  }

  downloadFile(file: any) {
    window.open(file.url, "_blank");
  }

  validarFormato(file) {
    if (
      file.type != "application/pdf" &&
      file.type != "application/msword" &&
      file.type !=
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
      file.type != "application/vnd.ms-excel" &&
      file.type !=
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      file.type != "image/png" &&
      file.type != "image/jpeg" &&
      file.type != "image/jpg"
    ) {
      this.loading = false;

      this.utilService.alerta(
        "error",
        "El archivo debe ser pdf, word, excel o imagen"
      );
      return false;
    } else {
      return true;
    }
  }

  agregarArchivosMultiples(event: any, dataSave: DataSave) {
    this.loading = true;
    for (const element of event.target.files) {
      let file = element;

      if (!this.validarFormato(file)) {
        return;
      }
      this.dataService.getBase64(file).then((base: string) => {
        dataSave.name = file.name;
        dataSave.mimeType = file.type;
        dataSave.adjunto = base;
        dataSave.observaciones = "adjunto";
        if (this.adjuntoList.idPrestamo) {
          dataSave.idPrestamo = this.adjuntoList.idPrestamo;
        }
        this.dataService
          .newPostAdjunto(dataSave, this.id)
          .pipe(
            finalize(() => {
              this.loading = false;
              this.changeDetectorRef.detectChanges();
            })
          )
          .subscribe(
            (res: any) => {
              this.getAdjuntos();
            },
            (err) => {
              this.utilService.alerta("error", "Error al subir el archivo");
            }
          );
      });
    }
  }

  agregarArchivo(event: any, dataSave: DataSave, numeroArchivos: number) {
    let file = event.target.files[0];
    if (!this.validarFormato(file)) {
      return;
    }

    this.dataService.getBase64(file).then((base: string) => {
      dataSave.name = file.name;
      dataSave.mimeType = file.type;
      dataSave.adjunto = base;
      dataSave.observaciones = "adjunto";
      if (this.adjuntoList.idPrestamo) {
        dataSave.idPrestamo = this.adjuntoList.idPrestamo;
      }

      if (numeroArchivos > 0) {
        this.utilService
          .confirmar(
            "Actualizar adjunto",
            "¿Está seguro de actualizar el adjunto?"
          )
          .then((result) => {
            if (result.isConfirmed) {
              this.loading = true;
              this.changeDetectorRef.detectChanges();
              this.updateAdjunto(dataSave);
            } else {
              this.loading = false;
              this.changeDetectorRef.detectChanges();
            }
          });

        return;
      }
      this.loading = true;
      this.changeDetectorRef.detectChanges();
      this.dataService
        .newPostAdjunto(dataSave, this.id)
        .pipe(
          finalize(() => {
            this.loading = false;
            this.changeDetectorRef.detectChanges();
          })
        )
        .subscribe(
          (res: any) => {
            this.getAdjuntos();
            this.loading = false;
          },
          (err) => {
            this.loading = false;

            this.utilService.alerta("error", "Error al cargar el archivo");
          }
        );
    });
  }

  private updateAdjunto(dataSave: DataSave) {
    let idAdjunto = this.adjuntoList.adjuntos[0].idAdjunto;

    if (this.adjuntoList.idPrestamo) {
      dataSave.idPrestamo = this.adjuntoList.idPrestamo;
    }

    this.dataService
      .newUpdateAdjunto(this.id, idAdjunto, dataSave)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe(
        (res: any) => {
          this.utilService.alerta("success", "Archivo actualizado con éxito");
          this.getAdjuntos();
        },
        (err) => {
          this.utilService.alerta("error", "Error al actualizar el archivo");
        }
      );
  }
}
