import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { NgxSpinnerService } from 'ngx-spinner';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ComponentesService } from 'src/app/services/componentes.service';
import { iconfa, iconify } from 'src/static-data/icons';
import { TTHHColaboradorService } from '../../../services/tthh-colaborador.service';
import { MatAccordion } from '@angular/material/expansion';
import { NominaNoProcesada } from '../../../models/nomina';
import { DataService } from 'src/app/services/data.service';
import * as FileSaver from "file-saver";
@UntilDestroy()
@Component({
  selector: 'vex-pagos-nomina',
  templateUrl: './pagos-nomina.component.html',
  styleUrls: ['./pagos-nomina.component.scss'],
  animations:[
    stagger80ms
  ]
})
export class PagoNominaComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  nominaNoProcesada:NominaNoProcesada[];
  listadoNominaNoProcesada=[];
  parameters = this.fb.group({
    code:['',Validators.required],
    idTipoColaborador:['',Validators.required],
    formato:['',Validators.required],
  });
  faSave              = iconfa.faSave;
  @Input() codeI:number;
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


  descargarPagoNomina() {
    this.spinner.show()
    const code=this.parameters.value.code;
    const formato=this.parameters.value.formato;
    const idTipoColaborador=this.parameters.value.idTipoColaborador;
    let data={code:code,
              tipoColaborador:idTipoColaborador,
              formato:formato};

    this.tthhColaboradorService.getPagoNominaReporte(data).subscribe((file) => {
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

  reset(){
    this.parameters.controls.codigoNomina.setValue(null);
    this.parameters.controls.idTipoColaborador.setValue(null);
  }


}

