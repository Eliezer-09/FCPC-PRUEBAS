import { Component, OnInit, ViewChild, Input, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { NgxSpinnerService } from 'ngx-spinner';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ComponentesService } from 'src/app/services/componentes.service';
import { iconfa, iconify } from 'src/static-data/icons';
import { ToastAlertComponent } from 'src/app/components/alerts/toast-alert/toast-alert.component';
import { DataService } from 'src/app/services/data.service';
import { TTHHColaboradorService } from '../../../services/tthh-colaborador.service';
import { MatAccordion } from '@angular/material/expansion';
import { NominaNoProcesada } from '../../../models/nomina';
import * as FileSaver from "file-saver";
import { UtilsService } from '../../../utils/utils.service';
import { ListadoNominaColaboradorComponent } from '../components/listado-nomina-colaborador/listado-nomina-colaborador.component';

@UntilDestroy()
@Component({
  selector: 'vex-listado-nomina',
  templateUrl: './listado-nomina.component.html',
  styleUrls: ['./listado-nomina.component.scss'],
  animations:[
    stagger80ms
  ]
})
export class ListadoNominaComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('ListadoNominaHonorarioComponent') ListadoNominaHonorarioComponent: ListadoNominaColaboradorComponent;
  @ViewChild('ListadoNominaREDEPComponent') ListadoNominaREDEPComponent: ListadoNominaColaboradorComponent;
  @Input() nominaNoProcesada:NominaNoProcesada[];
  @Input() codigoNomina:number;
  @Input() mes:number;
  @Input() anio:number;
  faSave              = iconfa.faSave;
  anioNomina:number;
  mesNomina:number;
  habilitarGuardar:boolean=false;
  displayedColumns: string[] = ['rubro', 'monto'];
  templateDiasIngreso = [
    { label: "Días trabajados", value: "diasTrabajo", pre:'' },
    { label: "Días vacaciones", value: "diasVacaciones", pre:''},
    { label: "Días subsidio", value: "diasSubsidio", pre:'' },
    { label: "Días décimo cuarto mensual", value: "diasdecimocuarto", pre:'' },
    { label: "Días décimo tercero mensual", value: "diastercero", pre:'' },
    { label: "Días fondo reserva", value: "diasFondoReserva", pre:'' },
  ];
  listNominaId:number[]=[];
  taskHonorarios:NominaNoProcesada[]=[]
  taskREDEP:NominaNoProcesada[]=[]
  allComplete: boolean = false;

  
  layoutCtrl = new FormControl('fullwidth');
  
  constructor(
    private spinner: NgxSpinnerService,
    private componentesService: ComponentesService,
    public utils: UtilsService,
    private tthhColaboradorService: TTHHColaboradorService,
    private componentService: ComponentesService,
    private dataServices: DataService,
  ) { }

  ngOnInit(): void {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.codigoNomina?.currentValue) {
      this.codigoNomina=this.codigoNomina;
      this.taskHonorarios=this.nominaNoProcesada.filter( (nominaColaborador) => nominaColaborador.idTipoColaborador == 2)
      this.taskREDEP=this.nominaNoProcesada.filter( (nominaColaborador) => nominaColaborador.idTipoColaborador == 1)
    }
    if (changes.anio?.currentValue)  this.anioNomina=this.anio;
    if (changes.mes?.currentValue)   this.mesNomina=this.mes;

  }


  descargarNomina(datosEvento){
    this.spinner.show()
    let data={
      code:this.codigoNomina,
      tipoColaborador:datosEvento.tipoColaborador,
      anio:this.anioNomina,
      mes:this.mesNomina,
      valido:false,
      formato:datosEvento.formato
    }
    
    this.tthhColaboradorService.getNominaNoProcesadaReporte(data).subscribe((file) => {
       const result=file["result"]
       const filebase64=result["content"]
       const mimeType = result["mimeType"];
       let filename = result["reportName"] || "Nomina-"+datosEvento.origin+'-';
       if(this.codigoNomina) filename+=this.codigoNomina;
       if(this.anioNomina) filename+=this.anioNomina;
       if(this.mesNomina) filename+=this.mesNomina;
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


 guardarNominaNoProcesada(){
  this.listNominaId=[];
  this.ListadoNominaHonorarioComponent.task.forEach(element => {
    if(element.completed) this.listNominaId.push(element.idNominaCabecera)
  }); 

  this.ListadoNominaREDEPComponent.task.forEach(element => {
    if(element.completed) this.listNominaId.push(element.idNominaCabecera)
  });
 
  if(this.listNominaId.length==0){
    try{new ToastAlertComponent("error",  "Debes seleccionar almenos un colaborador");}finally{ this.spinner.hide();}
  }else{


  this.spinner.show()
  this.utils
        .confirmar(
          "Guardar Nómina",
          "¿Está seguro de guardar los cambios?"
        )
        .then((result) => {
          if (result.isConfirmed) {
           
             const data={idNominaCabecera:this.listNominaId}
            this.tthhColaboradorService.postVerificaCargaBatchIngresoEgreso(data).subscribe((res: any) => {
              this.componentesService.alerta(
                "success", "Se ha guardado los Rubros de los colaboradores seleccionados"
              ).then((result) => {
                this.codigoNomina=null;
                this.listNominaId=[];
                location.reload()
                this.spinner.hide();
                });
           }, error => {
             try{new ToastAlertComponent("error",  error.error.message);}finally{ this.spinner.hide();}
           }) 
          }else{
            this.spinner.hide();
          }
        });
      }  

 
 }
 

}

