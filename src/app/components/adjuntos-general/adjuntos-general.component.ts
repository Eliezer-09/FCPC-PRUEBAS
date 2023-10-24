import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AdjuntosGenerales } from "./ajuntos-general";

@Component({
  selector: "vex-adjuntos-general",
  templateUrl: "./adjuntos-general.component.html",
  styleUrls: ["./adjuntos-general.component.scss"],
})
export class AdjuntosGeneralComponent {
  loading = false;
  @Output() emitirAdjunto = new EventEmitter<any>();
  @Input() cargarAdjunto:boolean=true;
  @Input() id: any;
  @Input() adjuntosGenerales: AdjuntosGenerales;
 
  emitirAdjuntos(adjunto){
    this.emitirAdjunto.emit(adjunto)
  }

}
