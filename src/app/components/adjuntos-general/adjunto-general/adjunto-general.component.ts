import { DataSave } from "./../ajuntos-general";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from "@angular/core";
import { AdjuntoGeneral, AdjuntosList } from "../ajuntos-general";
import { DataService } from "src/app/services/data.service";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";
import { iconify } from "src/static-data/icons";
import { catchError, finalize } from "rxjs/operators";
import { PostAdjunto } from "src/app/model/models";
import { AdjuntosService } from "src/app/services/adjuntos.service";
import { forkJoin, of } from "rxjs";
import { CreditosService } from "src/app/pages/creditos/creditos.service";

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
  @Input() deleteMode: boolean = true;
  adjuntoArray: AdjuntosList;
  idEntidad:any;
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
    private changeDetectorRef: ChangeDetectorRef,
    private adjuntosService:AdjuntosService,
    private creditoService: CreditosService,
  ) {
   
  }

  ngOnInit(): void {
    this.adjuntoArray={ ...this.adjuntoList };
    this.idEntidad=this.id;
     this.getAdjuntos();
    
  }

  getAdjuntos() {
    this.loading = true;
    this.dataService
      .newGetAdjuntoById(
        this.idEntidad,
       this. adjuntoArray.idTipoAdjunto,
       this. adjuntoArray.idPrestamo
      )
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe(
        (res: any) => {
      /*     if (
            this. adjuntoArray.idTipoAdjunto == 1 ||
            this. adjuntoArray.idTipoAdjunto == 2
          ) {
            res.result = res.result.filter((x) => x.idPrestamo == null);
          } */
          this. adjuntoArray.adjuntos=res.result
          this.adjuntoList=this. adjuntoArray; 
        },
        (err) => {
          this. adjuntoArray.adjuntos=[];
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
        if (this.adjuntoArray.idPrestamo) {
          dataSave.idPrestamo = this.adjuntoArray.idPrestamo;
        }
        this.dataService
          .newPostAdjunto(dataSave, this.idEntidad)
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

    if (!this.creditoService.validarPesoArchivo(file)) {
      return;
    }

    this.dataService.getBase64(file).then((base: string) => {
      dataSave.name = file.name;
      dataSave.mimeType = file.type;
      dataSave.adjunto = base;
      dataSave.observaciones = "adjunto";
      if (this.adjuntoArray.idPrestamo) {
        dataSave.idPrestamo = this.adjuntoArray.idPrestamo;
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
        .newPostAdjunto(dataSave, this.idEntidad)
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
    let idAdjunto = this.adjuntoArray.adjuntos[0].idAdjunto;
    this.idEntidad = this.adjuntoArray.adjuntos[0].idEntidad;
    if (this.adjuntoArray.idPrestamo) {
      dataSave.idPrestamo = this.adjuntoArray.idPrestamo;
    }

    let dataSavecopy=JSON.parse(JSON.stringify(dataSave));

    forkJoin([
      this.dataService.newUpdateAdjunto(this.idEntidad, idAdjunto, dataSave)
      .pipe(
        catchError((error) => {
        /*   this.utilService.alerta("error", "Error al actualizar el archivo"); */
          return of(error);
        })
      ),
       this.actualizarEntidades(dataSavecopy,this.idEntidad) .pipe(
        catchError((error) => {
          /* this.utilService.alerta("error", "Error al actualizar el archivo"); */
          return of(error);
        })
      ) 
      
    ]).subscribe({
      next: (res) => {
        this.utilService.alerta("success", "Archivo actualizado con éxito");
        this.getAdjuntos();  
      },
      error: (error) => {
        console.log(error);
        this.utilService.alerta("error", error.error.message);
      },
      complete: () => {
        this.loading = false;
          this.changeDetectorRef.detectChanges();
      },
    });
  
  }

  actualizarEntidades(dataSave,idEntidad){
    if (( dataSave.tipoAdjunto == 1 || dataSave.tipoAdjunto == 2) && dataSave.idPrestamo!=null ) {
      dataSave.idPrestamo=null;
      return this.adjuntosService.updateEntidadCedulasGarante(dataSave, idEntidad, dataSave.tipoAdjunto)
    }else{
      return of([]);
    }
  }

}
