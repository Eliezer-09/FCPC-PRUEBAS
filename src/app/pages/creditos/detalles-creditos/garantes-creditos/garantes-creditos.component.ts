import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { Prestamo } from "src/app/model/models";
import { CreditosService } from "../../creditos.service";
import icSave from "@iconify/icons-fa-solid/save";
import icPrint from "@iconify/icons-fa-solid/print";
import icDescription from "@iconify/icons-ic/twotone-description";
import { NgxSpinnerService } from "ngx-spinner";
import { ComponentesService } from "src/app/services/componentes.service";
import { DataService } from "src/app/services/data.service";
import { EstadoCreditos, TiposAdjunto } from "src/@vex/interfaces/enums";
import { DomSanitizer } from "@angular/platform-browser";
import { AdjuntosGenerales, AdjuntosList, DataSave } from "src/app/components/adjuntos-general/ajuntos-general";

@Component({
  selector: "vex-garantes-creditos",
  templateUrl: "./garantes-creditos.component.html",
  styleUrls: ["./garantes-creditos.component.scss"],
})
export class GarantesCreditoComponent {
  @Input() garantes: any[] = [];
  @Input() prestamo: Prestamo = {};
  idPrestamo:number;
  adjuntosGarantes: AdjuntosGenerales = {
    nombreSeccion: "",
    adjuntosList: [],
  };
  panelOpenState = false;

  visualizationMode:boolean=false;
  constructor() {
  
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.prestamo?.currentValue){
      if(this.garantes.length>0) this.idPrestamo=this.garantes[0].idPrestamo;
      this.visualizationModeGarantes();
      this.cargarAdjuntos()
    }
  }


visualizationModeGarantes(){
  //estados de creditos en los que se puede editar loas adjunto
  this.visualizationMode=this.prestamo.estado==(EstadoCreditos.Pendiente
                                                 || EstadoCreditos.Aprobado
                                                 || EstadoCreditos.Revalidacion
                                                 || EstadoCreditos.Legalizado)
}

  cargarAdjuntos() {
    const dataSaveList: DataSave[] = [
      {
        tipoAdjunto: TiposAdjunto.cedulaFrontal,
        observaciones: "Cédula frontal del Garante",
        idPrestamo:this.idPrestamo
      },
      {
        tipoAdjunto: TiposAdjunto.cedulaPosterior,
        observaciones: "Cédula posterior del Garante",
        idPrestamo:this.idPrestamo
      },
      {
        tipoAdjunto: TiposAdjunto.rolGarante,
        observaciones: "Rol de pago del Garante",
        idPrestamo:this.idPrestamo
      },
    ];

    const adjuntosList: AdjuntosList[] = dataSaveList.map((dataSave) => ({
      dataSave,
      nombreAdjunto: dataSave.observaciones,
      esRequerido: false,
      multiple: false,
      visualizationMode: !this.visualizationMode,
      deleteMode: false,
      idTipoAdjunto: dataSave.tipoAdjunto,
      idPrestamo: dataSave.idPrestamo,
    }));
    this.adjuntosGarantes = {
      nombreSeccion: null,
      adjuntosList,
    };
  }




}
