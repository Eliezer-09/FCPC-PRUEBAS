import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { NgxSpinnerService } from 'ngx-spinner';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ComponentesService } from 'src/app/services/componentes.service';
import { iconfa, iconify } from 'src/static-data/icons';
import { TTHHColaboradorService } from '../../../services/tthh-colaborador.service';
import { MatAccordion } from '@angular/material/expansion';
import moment from 'moment';
import { NominaNoProcesada } from '../../../models/nomina';
import { DataService } from 'src/app/services/data.service';
import * as FileSaver from "file-saver";
@UntilDestroy()
@Component({
  selector: 'vex-history-ingresos-egresos',
  templateUrl: './history-ingresos-egresos.component.html',
  styleUrls: ['./history-ingresos-egresos.component.scss'],
  animations:[
    stagger80ms
  ]
})
export class HistoryIngresosEgresosComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  nominaNoProcesada:NominaNoProcesada[];
  listadoNominaNoProcesada=[];
  parameters = this.fb.group({
    mes: [],
    anio: [],
    codigoNomina: [],
    idTipoColaborador:['',Validators.required],
    formato:['Excel',Validators.required],
  });
  faSave              = iconfa.faSave;
  @Input() codigoNominaI:number;
  @Output() guardar= new EventEmitter();
  idSearch=1221
  icroundFileUpload= iconify.icroundFileUpload;
  habilitarGuardar:boolean=false;
  icroundSearch=iconify.icroundSearch;
  date = new FormControl();
  

  layoutCtrl = new FormControl('fullwidth');
  
  constructor(
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private tthhColaboradorService: TTHHColaboradorService,
    private componentService: ComponentesService,
    private dataServices: DataService
  ) { }

  ngOnInit(): void {
    this.reset()
  }


 descargarNomina() {
    this.spinner.show()
    const codigoNomina=this.parameters.value.codigoNomina;
    const mes=this.parameters.value.mes;
    const anio=this.parameters.value.anio;
    const formato=this.parameters.value.formato;
    const idTipoColaborador=this.parameters.value.idTipoColaborador;
    let data={ tipoColaborador:idTipoColaborador,
      valido:true,
      formato:'Excel',
      mes:mes,
      anio:anio};

    this.tthhColaboradorService.getNominaNoProcesadaReporte(data).subscribe((file) => {
       const result=file["result"]
       const filebase64=result["content"]
       const mimeType = result["mimeType"];
       let filename = result["reportName"];
       const fileblob: Blob = this.dataServices.getBlobFromBase64(
        filebase64,
         mimeType
       );
       FileSaver.saveAs(fileblob, filename);

         this.spinner.hide() 
       },
       (error) => {
         this.spinner.hide();
         this.componentService.alerta("error", error.error.message)
     })
    }


    setMonthAndYear(event): void {
      if (event) {
          this.date.setValue(event)
          this.parameters.controls.mes.setValue(event.month() + 1);
          this.parameters.controls.anio.setValue(event.year());
          this.parameters.controls.codigoNomina.setValue(null);
      } else {
        this.parameters.controls.mes.setValue(null);
        this.parameters.controls.anio.setValue(null);
      }
  }

  
  reset(){
    this.parameters.controls.codigoNomina.setValue(null);
    this.date.setValue(moment());
    this.parameters.controls.mes.setValue(this.date.value.month() + 1);
    this.parameters.controls.anio.setValue(this.date.value.year());
  }


}

