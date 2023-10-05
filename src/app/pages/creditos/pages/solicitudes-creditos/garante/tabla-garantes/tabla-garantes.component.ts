import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { ComponentesService } from 'src/app/services/componentes.service';
import { iconify } from 'src/static-data/icons';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { Garante, GaranteCreditos } from 'src/app/pages/creditos/model/models-creditos';

import icDelete from "@iconify/icons-ic/twotone-delete";
import { MatTableDataSource } from '@angular/material/table';
import { ViewAdjuntosComponent } from 'src/app/components/adjuntos-general/view-adjuntos/view-adjuntos.component';
@Component({
  selector: 'vex-tabla-garantes',
  templateUrl: './tabla-garantes.component.html',
  styleUrls: ['./tabla-garantes.component.scss'],
  animations: [fadeInUp400ms, stagger80ms],
})
export class TablaGarantesComponent implements OnInit {
  icDelete = icDelete;
  @Output() GaranteEmit: EventEmitter<any> = new EventEmitter();
  infoMessage:string="No has agregado garantes";
  icroundPerson=iconify.icroundPerson;
  icroundAttachFile=iconify.icroundAttachFile;
  garantesdataSource: MatTableDataSource<Garante> | null;
  columnasGarante = [
    "identificacion",
    "montoGarantia",
    "observaciones",
    "documento",
    "accion",
  ];

  @ViewChild(ViewAdjuntosComponent) viewAdjuntosComponent:ViewAdjuntosComponent;
  constructor(    private componentService: ComponentesService,
                  private changeDetectorRefs: ChangeDetectorRef,
                 ) { }

  ngOnInit(): void {
    this.garantesdataSource = new MatTableDataSource();
  }
  detectarCambios() {
    this.changeDetectorRefs.detectChanges();
  }

  agregarGarante(garanteSelecccionado:Garante){
    if(this.garantesdataSource.data.length<2){
      let index=this.garantesdataSource.data.findIndex(garante => garante.idPersona==garanteSelecccionado.idPersona)
      if(index!=-1){
        this.componentService.alerta("error", "Ya has agregado este garante");
        return;
      }
      this.garantesdataSource.data.push(garanteSelecccionado);
      this.garantesdataSource.data = [...this.garantesdataSource.data];
      this.getGarante(this.garantesdataSource.data)
      this.detectarCambios()
  }else{
    this.componentService.alerta("error", "No puedes exceder el límite de garantes");
    return;
  }
  }

  eliminarGarante(garanteSelecccionado) {
    let index=this.garantesdataSource.data.findIndex(garante => garante.idPersona==garanteSelecccionado.idPersona)
    if(index!=-1){
      this.garantesdataSource.data.splice(index, 1);
      this.garantesdataSource.data = [...this.garantesdataSource.data];
      this.getGarante(this.garantesdataSource.data)
      this.detectarCambios()
    }

  }

  viewFile(adjunto){
    this.viewAdjuntosComponent.loadDocument('blob',adjunto.blob); 
  }
  
  getGarante(garantes){
    this.GaranteEmit.emit(garantes);
  }
}
