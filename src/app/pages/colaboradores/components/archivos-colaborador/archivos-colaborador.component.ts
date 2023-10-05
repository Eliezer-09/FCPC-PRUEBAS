import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  SimpleChanges,
} from "@angular/core";
import { iconify } from "src/static-data/icons";
import { AdjuntosColaborador } from "../../models/colaboradores";

@Component({
  selector: "vex-archivos-colaborador",
  templateUrl: "./archivos-colaborador.component.html",
  styleUrls: ["./archivos-colaborador.component.scss"],
})
export class ArchivosColaboradorComponent implements OnChanges {
  loading = false;
  //Output
  @Output() callCargarAdjuntos = new EventEmitter<string>();
  @Output() callCargarAdjuntosChild = new EventEmitter<string>();
  @Output() emitirIdAdjunto = new EventEmitter<any>();
  //input
  @Input() tipoColaborador: any;
  @Input() idColaborador: any;
  @Input() idFormacionAcademica: number;
  @Input() idReferenciaPersonal: number;
  @Input() idReferenciaBancaria: number;
  @Input() idVehiculo: number;

  @Input() controlView: string = "todos";
  @Input() adjuntosColaborador: AdjuntosColaborador[]=[];
  @Input() visualizationMode: boolean = false;
  cantidadAdjuntos: number = 0;

  //iconos
  icCheck = iconify.icroundCheckCircle;
  icCancel = iconify.icroundCancel;
  icDownload = iconify.icroundFileDownload;
  icNoDownload = iconify.icroundFileDowloadOff;
  icUpload = iconify.icroundFileUpload;
  icDelete = iconify.icroundDelete;

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.adjuntosColaborador?.currentValue) {
   /*    this.contadorAdjuntos(); */
    }
  }

  contadorAdjuntos() {
    this.cantidadAdjuntos = this.adjuntosColaborador?.filter(
      (adjunto) => adjunto.nombreSeccion == this.controlView
    ).length;
  }

  emitirCargarAdjuntos(event) {
    this.callCargarAdjuntos.emit(event);
  }

  /*   emitirIdAdjuntos(idAdjunto) {
    this.emitirIdAdjunto.emit(idAdjunto);
  } */
}
