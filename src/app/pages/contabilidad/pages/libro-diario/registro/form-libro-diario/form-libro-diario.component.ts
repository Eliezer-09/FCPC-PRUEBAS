import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { FormsService } from 'src/app/services/forms.service';
import { iconify } from 'src/static-data/icons';
import * as _moment                                               from 'moment';
import {default as _rollupMoment }                                from 'moment';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS}       from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE}           from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ContabilidadService } from 'src/app/pages/contabilidad/services/contabilidad.service';
import { ToastAlertComponent } from 'src/app/components/alerts/toast-alert/toast-alert.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableAsientosContablesComponent } from '../../table-asientos-contables/table-asientos-contables.component';
import { createMask } from '@ngneat/input-mask';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';

import { estadoAsientoContable } from 'src/@vex/interfaces/enums';
import { ActivatedRoute, Router }        from '@angular/router';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';



const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
      dateInput: 'yyyy-MM-ddTHH:mm:ssZ'
  },
  display: {
      dateInput: 'YYYY-MM-DD',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM-YYYY'
  }
};

@Component({
  selector: 'vex-form-libro-diario',
  templateUrl: './form-libro-diario.component.html',
  styleUrls: ['./form-libro-diario.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ], 
  animations: [
    fadeInUp400ms,
    fadeInRight400ms
  ],
})


export class FormLibroDiarioComponent implements OnInit {
  layoutCtrl = new FormControl("fullwidth");
  icroundAutoStories = iconify.icroundAutoStories;
  titleHeader = "";
  idAsiento:any;
  currentDate =        moment();
  RequeredRule: any[]=[Validators.required];

  formLibroDiario = this.fb.group({
    idAsientoContable:[''],
    idTipoAsiento:['',this.RequeredRule],
    idTipoTransaccion:['',this.RequeredRule],
    numeroControl:['',this.RequeredRule],
    fecha:[this.currentDate,this.RequeredRule],
    estado:[0,this.RequeredRule],
    cerrado:[false,this.RequeredRule],
    observaciones:[''],
  })

  IntInputMask = createMask({
    alias: 'numeric',
    digits: 0,
    digitsOptional: false,
    numericInput: true,
    placeholder: "0"
  });

  filteredTipoDiario:   ReplaySubject<any[]>          = new ReplaySubject<any[]>(1);
  filteredTipoTransaccion:   ReplaySubject<any[]>     = new ReplaySubject<any[]>(1);

  displayedColumns: string[] = ['cuenta', 'descripcion', 'referencia', 'debe','haber'];
  detalleAsientos=[]
  tiposAsiento=[];
  tiposTransaccion=[];
  icroundChevronRight= iconify.icroundChevronRight;
  noAllow:boolean=false;
  edit:boolean=false;
  routers :any[]=[];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(TableAsientosContablesComponent) tableAsientosContablesComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(  private fb: FormBuilder,    
                private formsService:       FormsService,    
                private contabilidadService: ContabilidadService,
                private spinner: NgxSpinnerService,
                private routerActive: ActivatedRoute,
                private router: Router) { }
             
           
  setValue(){
    let valor=this.setNumberIntResult(this.formLibroDiario.value.numeroControl)
  }


  setNumberIntResult(value) {
    if(value){
      let parseValue=value.toString().replaceAll(',', '')
      return parseInt(this.formsService.setNumberDecimal(parseValue+'',0));
    }  
    return 0;
}


  ngOnInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getTipoTransaccion()
    this.getTipoAsiento()
    this.routerActive.queryParams.subscribe(params => {
          if(params.asiento){
            this.edit=true;
            this.formLibroDiario.controls.idAsientoContable.setValue(params.asiento)
            this.getAsientoContable(this.formLibroDiario.value.idAsientoContable)
          }
      
        }) 
  }

  getAsientoContable(idAsientoContable){
    this.spinner.show()
    this.contabilidadService.getAsientosContableById(idAsientoContable).subscribe(res=>{
      this.formLibroDiario.patchValue(res["result"])
      this.verifyAsientoForm();
      if(this.formLibroDiario.value.estado!=estadoAsientoContable.Cerrado){
        this.tableAsientosContablesComponent.getDetalleAsiento(this.formLibroDiario.value.idAsientoContable)
      }else{
        this.noAllow=true;
        try{new ToastAlertComponent("error", "No puedes editar un asiento cerrado")
      }finally{ this.spinner.hide(); }
    }
  
    }, error => {
      try{new ToastAlertComponent("error", error.error.message)
    }finally{ this.spinner.hide(); }
    }) 
  }


  changeTipoAsiento(event: any) {
    this.formLibroDiario.controls["idTipoAsiento"].setValue(event.value);
    let selectTipoDiario=this.tiposAsiento.filter(
      (tipoDiario) => tipoDiario.nombre == event.value
    );
    this.filteredTipoDiario.next( selectTipoDiario.slice());
    this.verifyAsientoForm()
  }


  changeTipoTransaccion(event: any) {
    this.formLibroDiario.controls["idTipoTransaccion"].setValue(event.value);
    let selectTipoTransaccion=this.tiposTransaccion.filter(
      (tipoTransaccion) => tipoTransaccion.nombre == event.value
    );
    this.filteredTipoTransaccion.next( selectTipoTransaccion.slice());
    this.verifyAsientoForm()
  }


  getErrorMessage(element,add_error_messaje?){
    return this.formsService.getErrorMessage(element,add_error_messaje);
  }


  getTipoTransaccion(term?:string){
    this.spinner.show();
    this.contabilidadService.getTransccacionByTerm(term).subscribe(res=>{
      this.tiposTransaccion=res["result"]
      this.spinner.hide();
    }, error => {
      try{new ToastAlertComponent("error", error.error.message)
    }finally{ this.spinner.hide(); }
  }) 
  }
  

  getTipoAsiento(term?:string){
    this.spinner.show();
    this.contabilidadService.getTipoAsientoByTerm(term).subscribe(res=>{
      this.tiposAsiento=res["result"]
      this.spinner.hide();
    }, error => {
      try{new ToastAlertComponent("error", error.error.message)
    }finally{ this.spinner.hide(); }
    }) 
  }

 
  saveDetalleAsiento(idAsiento,data){
    if(this.formLibroDiario.value.idAsientoContable){
      this.contabilidadService.postDetalleAsientosContable(idAsiento,data).subscribe((res:any)=>{
        data=res["result"]
        let detalleAsientos=data
        this.spinner.hide();
        this.tableAsientosContablesComponent.creatFormRows(detalleAsientos)
   
      }, error => {
        try{new ToastAlertComponent("error", error.error.message)
      }finally{ this.spinner.hide(); }
      })  
    }
  }


  actualizarDetalleAsiento(idAsiento,data){
    if(this.formLibroDiario.value.idAsientoContable){
      this.contabilidadService.putDetalleAsientosContable(data.idDetalleAsiento,data).subscribe((res:any)=>{
        this.spinner.hide();
        this.tableAsientosContablesComponent.getDetalleAsiento(idAsiento)
      }, error => {
        try{new ToastAlertComponent("error", error.error.message)
      }finally{ this.spinner.hide(); }
      })  
    }
  }


  saveHeadAsiento(data?,saveForm:boolean=false){
      this.contabilidadService.postAgregarAsientosContable(this.formLibroDiario.value).subscribe((res:any)=>{
        this.formLibroDiario.controls["idAsientoContable"].setValue(res["result"].idAsientoContable)
        this.tableAsientosContablesComponent.idAsientoContable=this.formLibroDiario.value.idAsientoContable
        if(data) this.saveDetalleAsiento(this.formLibroDiario.value.idAsientoContable,data)
        if(saveForm){
              try{new ToastAlertComponent("success", "Se ha Guardado el Asiento Contable")
            }finally{ 
              this.formLibroDiario.reset();
              this.tableAsientosContablesComponent.detalles=[]
            }
        }
      }, error => {
        try{new ToastAlertComponent("error", error.error.message)
      }finally{ this.spinner.hide(); }
      })  
   
  }


  actualizarHeadAsiento(idAsiento,dataAsiento,fin=false){
    this.contabilidadService.putActualizarAsientosContable(idAsiento,dataAsiento).subscribe((res:any)=>{
      try{new ToastAlertComponent("success", "Se ha Guardado el Asiento Contable")
      }finally{ 
        if(!this.edit){
          this.router.navigateByUrl(`/contabilidad/asiento-contable`); 
          this.tableAsientosContablesComponent.resetDetalles()
        }
        
        this.spinner.hide();
      }
      if(fin){
            this.router.navigateByUrl(`/contabilidad/ver-asiento-contable/${idAsiento}`); 
         }
    }, error => {
      try{new ToastAlertComponent("error", error.error.message)
    }finally{ this.spinner.hide(); }
    })  
 
}

  saveAsiento(data){
    this.spinner.show();
    if(!data.edit){
      if(!this.formLibroDiario.value.idAsientoContable){
        this.saveHeadAsiento(data.formData)
      }else{
        this.saveDetalleAsiento(this.formLibroDiario.value.idAsientoContable,data.formData)
      }
    }else{
        this.actualizarDetalleAsiento(this.formLibroDiario.value.idAsientoContable,data.formData)
    }
  }

  verifyAsientoForm(){
    this.tableAsientosContablesComponent.verifyAsientoForm(this.formLibroDiario)
  }

  finish(){
    if(this.formLibroDiario.valid){
      if( this.tableAsientosContablesComponent.verifyTotals()){
        this.formLibroDiario.controls.estado.setValue(estadoAsientoContable.Cerrado)
        this.actualizarHeadAsiento(this.formLibroDiario.value.idAsientoContable,this.formLibroDiario.value,true)
      }else{
        try{new ToastAlertComponent("error", "Los valores totales no coinciden")
        }finally{ this.spinner.hide(); }
      }
    }else{
      setTimeout(function () {
        try {
            new ToastAlertComponent("info", "Verifica los campos");
        } finally {/*  */}
    }, 300);
    }
  }

  save(){
    if(this.formLibroDiario.valid){
      if(!this.formLibroDiario.value.idAsientoContable){
        this.saveHeadAsiento(null,true)
      }else{
        this.actualizarHeadAsiento(this.formLibroDiario.value.idAsientoContable,this.formLibroDiario.value)
      }
    }else{
      setTimeout(function () {
        try {
            new ToastAlertComponent("info", "Verifica los campos");
        } finally {/*  */}
    }, 300);
    }
  }


  

}
