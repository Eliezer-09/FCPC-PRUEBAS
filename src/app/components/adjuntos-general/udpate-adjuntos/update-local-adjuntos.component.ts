import { AdjuntosLocal, DataSave } from "../ajuntos-general";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { AdjuntosList } from "../ajuntos-general";
import { DataService } from "src/app/services/data.service";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";
import { iconify } from "src/static-data/icons";
import { ViewAdjuntosComponent } from "../view-adjuntos/view-adjuntos.component";

@Component({
  selector: "vex-update-local-adjuntos",
  templateUrl: "./update-local-adjuntos.component.html",
  styleUrls: ["./update-local-adjuntos.component.scss"],
})
export class UdpateAdjuntosComponent implements OnInit {
  @Input() id: any;
  @Input() idTipoAdjunto: any = null;
  @Input() adjuntoList: AdjuntosLocal;
  @Input() visualizationMode: boolean = false;
  @Output() emitirAdjunto = new EventEmitter<any>();
  icCheck = iconify.icroundCheckCircle;
  icCancel = iconify.icroundCancel;
  icDownload = iconify.icroundFileDownload;
  icNoDownload = iconify.icroundFileDowloadOff;
  icUpload = iconify.icroundFileUpload;
  icDelete = iconify.icroundDelete;
  icPriority_high = iconify.icpriorityHigh;
  icLoading = iconify.ictwotoneDownloading;
  loading = false;
  @ViewChild(ViewAdjuntosComponent) viewAdjuntosComponent:ViewAdjuntosComponent;
  constructor(
    private dataService: DataService,
    private utilService: UtilsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log(this.adjuntoList)

  }

  removerArchivo() {
    this.utilService
      .confirmar("Eliminar adjunto", "¿Está seguro de eliminar el adjunto?")
      .then((result) => {
        if (result.isConfirmed) {
          this.loading = true;
          this.adjuntoList.adjuntos=[]
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        }
      });
  }


  downloadFile(file: any) {
     this.viewAdjuntosComponent.loadDocument('blob',file.blob);  
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



  agregarArchivo(event: any) {   
    let file = event.target.files[0];
    if (!this.validarFormato(file)) {
      return;
    }

    this.dataService.getBase64(file).then((base: string) => {
      let dataSave: DataSave={
      name : file.name,
      mimeType : file.type,
      adjunto : base,
      observaciones : "adjunto",
      blob:file
      }
      if (this.adjuntoList.idPrestamo) {
        dataSave.idPrestamo = this.adjuntoList.idPrestamo;
      }    
      this.adjuntoList.adjuntos= [{
        dataSave: dataSave,
        adjunto: event.target.files,
      }]
        this.emitirAdjunto.emit({idTipoAdjunto:this.adjuntoList.idTipoAdjunto,data:dataSave})
        event.target.value = '';
    })
  }

}
