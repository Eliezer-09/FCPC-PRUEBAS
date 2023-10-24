import { Component, OnInit, Inject}           from '@angular/core';
import {  MAT_DIALOG_DATA }                   from '@angular/material/dialog';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef }                       from '@angular/material/dialog';
import {iconify, iconfa }                     from 'src/static-data/icons'
import {default as _rollupMoment}     from 'moment';
import { FormsService } from 'src/app/services/forms.service';
import { createMask } from '@ngneat/input-mask';
import { ContabilidadService } from 'src/app/pages/contabilidad/services/contabilidad.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastAlertComponent } from 'src/app/components/alerts/toast-alert/toast-alert.component';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { CuentasContables } from 'src/app/model/models';


@Component({
  selector: 'vex-modal-asiento-contable',
  templateUrl: './modal-asiento-contable.component.html',
  styleUrls: ['./modal-asiento-contable.component.scss']
})

export class ModalAsientoContableComponent implements OnInit {
  selectCtrl: FormControl = new FormControl();
  detalle: any;
  icroundClose            = iconify.icroundClose;
  iconModal               = iconfa.faFileInvoice;
  icroundAccountBalanceWallet =iconify.icroundAccountBalanceWallet;
  RequeredRule:           any[]=[Validators.required];
  filterform              = this.fb.group({idDetalleAsiento:[''],
                                          idCuentaContable:['',this.RequeredRule],
                                          cuentaContable:['',this.RequeredRule],
                                          referencia:[''],
                                          idReferencia:['',this.RequeredRule],
                                          tipoAsiento:['',this.RequeredRule],
                                          detalle:[''],
                                          valor:['',this.RequeredRule],
                                          debe:[0],
                                          haber:[0],
                                        
                                          });
  formatControl = this.fb.control(null);
  cuentas: TreeviewItem[] = [];
  tipoAsientos: any[] = [{id:"debe",nombre:"Debe"},{id:"haber",nombre:"Haber"}];
  auxiliarVistas: any[] = [];
  referencias: any[] = [];
  myControlCuenta = new FormControl();
  isLoading = false;
  simboloMoneda: string='$';

  DecimalInputMask = createMask({
    alias: 'numeric',
    groupSeparator: '.',
    digits: 2,
    digitsOptional: true,
    allowMinus: false,
    min: 0.00,
    numericInput: true,
    placeholder: "0.00"
  });
  config = TreeviewConfig.create({
    hasFilter: true,
    hasCollapseExpand: true
  });
  value;
  items: TreeviewItem[];
  selecteCuenta;
  cuentasFilterCtrl:       FormControl = new FormControl();
  referenciaFilterCtrl:    FormControl = new FormControl();
  filteredCuentas:         ReplaySubject<any[]>       = new ReplaySubject<any[]>(1);
  filteredReferencia:      ReplaySubject<any[]>       = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();


  subject$: ReplaySubject<CuentasContables[]> = new ReplaySubject<CuentasContables[]>(1);
  data$: Observable<CuentasContables[]> = this.subject$.asObservable();
  constructor(public dialogRef: MatDialogRef<ModalAsientoContableComponent>,
      @Inject(MAT_DIALOG_DATA) public data : any,
      private fb : FormBuilder,
      private formsService:       FormsService,
      private contabilidadService: ContabilidadService,
      private spinner: NgxSpinnerService, 
  ) {
      this.detalle     = data;
  }

  ngOnInit(): void {
    this.loadContablesTree()

    if(this.detalle.data){
      this.value=this.detalle.data["idCuentaContable"]
      console.log(this.value)
      this.filterform.patchValue(this.detalle.data)
      this.filterform.controls["valor"].setValue(this.detalle.data["valor"])
      this.filterform.controls["cuentaContable"].setValue(this.detalle.data["cuentaContable"])
      if(this.detalle.data.debe>0){
        this.filterform.controls["tipoAsiento"].setValue("debe")
        this.filterform.controls["valor"].setValue(this.detalle.data.debe)
      } 
      if(this.detalle.data.haber>0){
        this.filterform.controls["tipoAsiento"].setValue("haber")
        this.filterform.controls["valor"].setValue(this.detalle.data.haber)
      }
    
      this.getReferenciasContables(this.detalle.data.idVista)
    }else{
      this.resertForm();
    }
  }



  save(edit:boolean) {
    const formData = this.filterform.value;
    const data={
        edit:edit,
        formData : formData
    }
    this.dialogRef.close(data); 
  }


  getErrorMessage(element,add_error_messaje?){
    return this.formsService.getErrorMessage(element,add_error_messaje);
  }

  seleccionarCuenta(cuenta){
    this.selecteCuenta=cuenta.value
    this.value=cuenta.value
    console.log(cuenta)
      this.filterform.controls['idCuentaContable'].setValue(cuenta.value);
      this.filterform.controls["cuentaContable"].setValue(cuenta.text)
       this.loadReferenciasContables(cuenta.idVista); 
  }

  seleccionarReferencia(referencia){
      this.filterform.controls['idReferencia'].setValue(referencia.idReferencia);
  }

  setTwoNumberDecimal(parameter) {
    let value=this.filterform.value[parameter]
    if( !value || value<=0 ){
      this.filterform.controls[parameter].setErrors({'especificError': "El valor no debe ser 0 o menor."});
    }else{
     
      if(value ){
        let type=typeof value=="string"
        let parseValue=type?parseFloat(value.replaceAll(',', '')):value
        this.filterform.value[parameter] = parseFloat(this.formsService.setNumberDecimal(parseValue+'',2));
        return  this.filterform.value[parameter]
      }  
    }
  }

  setValueTipoAsiento(){
   let tipoAsiento= this.filterform.value.tipoAsiento
   let valor=this.filterform.value.valor

    if(tipoAsiento=="debe"){
      this.filterform.controls["debe"].setValue( valor)
      this.filterform.controls["haber"].setValue( 0)
    } else if(tipoAsiento=="haber"){
      this.filterform.controls["haber"].setValue(valor)
      this.filterform.controls["debe"].setValue( 0)
    } 
  }

  changeValue(){
    this.setTwoNumberDecimal('valor')
    this. setValueTipoAsiento()
  }
  
  getData(cuentas) {
    let cuentasSelect=JSON.parse(sessionStorage.getItem('cuentasContablesSelect'))
    if(cuentasSelect){
      cuentas=cuentasSelect
      return cuentas;
    }
   
    cuentas=cuentas.map(cuentas => new CuentasContables(cuentas));
    sessionStorage.setItem("cuentasContablesSelect",JSON.stringify(cuentas))
    return cuentas
  } 

  
  loadContablesTree(update=false){
    let cuentas=sessionStorage.getItem('cuentasContables')
    if(cuentas){
      this.cuentas=this.getData(JSON.parse(sessionStorage.getItem('cuentasContables')))
     return;
    }  
  
  
    this.spinner.show();
    this.contabilidadService.getCuentasContablesTree(update).subscribe(res=>{
      this.cuentas=this.getData(res["result"])
      sessionStorage.setItem("cuentasContables",JSON.stringify(res["result"]))
      this.spinner.hide();
    }, error => {
      try{new ToastAlertComponent("error", error.error.message)
    }finally{ this.spinner.hide(); }
    }) 
  }

/*   loadContablesTree(){
    this.contabilidadService.getCuentasContablesTree(false).subscribe(res=>{
      this.cuentas=this.getData(res["result"])
     
      sessionStorage.setItem("cuentasContables",JSON.stringify(this.cuentas))
      
      console.log( this.cuentas) 
      this.spinner.hide();
    }, error => {
      try{new ToastAlertComponent("error", error.error.message)
    }finally{ this.spinner.hide(); }
    }) 
  } */



/*   loadContables(){
    this.contabilidadService.getCuentasContables(1,20).subscribe(res=>{
      this.cuentas=res["result"]
      this.filteredCuentas.next(this.cuentas.slice());
      this.cuentasFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterCuentas();
        });
      this.spinner.hide();
    }, error => {
      try{new ToastAlertComponent("error", error.error.message)
    }finally{ this.spinner.hide(); }
    }) 
  }
 */
  getCuentasContables(term?){
    this.contabilidadService.getCuentasContables(1,20,term).subscribe(res=>{
      this.cuentas=res["result"]
      this.filteredCuentas.next(this.cuentas.slice());
      this.spinner.hide();
    }, error => {
      try{new ToastAlertComponent("error", error.error.message)
    }finally{ this.spinner.hide(); }
    }) 
  }


  protected filterCuentas() {
    if (!this.cuentas) {
      return;
    }
    let search = this.cuentasFilterCtrl.value;
    if (!search) {
      this.filteredCuentas.next(this.cuentas.slice());
      return;
    } else {
      search = search.toLowerCase();
      this.filterform.value.cuenta = search;
    }

    this.getCuentasContables(search)
  }


  loadReferenciasContables(idVista:number){
    this.contabilidadService.getAuxiliarByTerm(idVista,1,20 ).subscribe(res=>{
      this.referencias=res["result"]
    
      this.filteredReferencia.next(this.referencias.slice());
      this.referenciaFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterReferencia();
        });
      this.spinner.hide();
    }, error => {
      try{new ToastAlertComponent("error", error.error.message)
    }finally{ this.spinner.hide(); }
    }) 
  }

  getReferenciasContables(idVista:number,term?){
    this.contabilidadService.getAuxiliarByTerm(idVista,1,20,term ).subscribe(res=>{
      this.referencias=res["result"]
      this.filteredReferencia.next(this.referencias.slice());
      this.spinner.hide();
    }, error => {
      try{new ToastAlertComponent("error", error.error.message)
    }finally{ this.spinner.hide(); }
    }) 
  }


  protected filterReferencia() {
    if (!this.referencias) {
      return;
    }
    let search = this.referenciaFilterCtrl.value;
    if (!search) {
      this.filteredReferencia.next(this.referencias.slice());
      return;
    } else {
      search = search.toLowerCase();
      this.filterform.value.referencia = search;
    }

    this.getReferenciasContables(this.selecteCuenta.idVista,search)
  }


  resertForm(){
    this.filterform=this.fb.group({idDetalleAsiento:[''],
    idCuentaContable:['',this.RequeredRule],
    cuentaContable:['',this.RequeredRule],
    referencia:[''],
    idReferencia:['',this.RequeredRule],
    tipoAsiento:['',this.RequeredRule],
    detalle:[''],
    valor:['',this.RequeredRule],
    debe:[0],
    haber:[0],
 });
  }
}
