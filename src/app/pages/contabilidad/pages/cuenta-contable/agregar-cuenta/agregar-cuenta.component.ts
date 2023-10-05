import { Component, OnInit, Inject}           from '@angular/core';
import {  MAT_DIALOG_DATA }                   from '@angular/material/dialog';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef }                       from '@angular/material/dialog';
import {iconify, iconfa }                     from 'src/static-data/icons'
import {default as _rollupMoment}     from 'moment';
import { ContabilidadService } from 'src/app/pages/contabilidad/services/contabilidad.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormsService } from 'src/app/services/forms.service';
import { ToastAlertComponent } from 'src/app/components/alerts/toast-alert/toast-alert.component';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators';


@Component({
  selector: 'vex-agregar-cuenta',
  templateUrl: './agregar-cuenta.component.html',
  styleUrls: ['./agregar-cuenta.component.scss']
})

export class ModalAgregarCuentaComponent implements OnInit {
 
  selectCtrl: FormControl = new FormControl();
  detalle: any;
  icroundClose            = iconify.icroundClose;
  iconModal               = iconfa.faFileInvoice;
  icroundAccountBalance      = iconify.icroundAccountBalance ;
  RequeredRule:           any[]=[Validators.required];
  formModal              = this.fb.group({idCuentaContable:[null],
                                    idTipoCuentaContable: ["",this.RequeredRule],
                                    tipoCuentaContable: [""],
                                    descripcion: ["",this.RequeredRule],
                                    idCuentaSuperior:  [null],
                                    naturaleza:  ["",this.RequeredRule],
                                    idRegimenTributario: ["",this.RequeredRule],
                                    regimenTributario: [""],
                                    codigo: ["",this.RequeredRule],
                                    codigoSbs:  ["",this.RequeredRule],
                                    codigoFlujo:  ["",this.RequeredRule],
                                    codigoPresupuesto: ["",this.RequeredRule] });
  tipoAsientos: any[] = [{id:"D",nombre:"Debe"},{id:"H",nombre:"Haber"}];
  regimenTributario: any[] = [];
  regimenTributarioFilterCtrl:    FormControl = new FormControl();
  tipoCuenta: any[] = [];
  tipoCuentaFilterCtrl:    FormControl = new FormControl();
  searching: boolean;
  protected _onDestroy = new Subject<void>();
  constructor(public dialogRef: MatDialogRef<ModalAgregarCuentaComponent>,
      @Inject(MAT_DIALOG_DATA) public data : any,
      private fb : FormBuilder,
      private formsService:       FormsService,
      private contabilidadService: ContabilidadService,
      private spinner: NgxSpinnerService, 
  ) {
     this.resertForm()
      this.detalle     = data.data;
      if(data.edit){
        this.formModal.patchValue(this.detalle)
      }else{
        this.formModal.controls["idCuentaSuperior"].setValue(this.detalle.idCuentaContable || null)
        this.calculateCode(this.detalle.parent,this.detalle.countChildren)
      }
      
  }

  ngOnInit(): void {
    this.asingFilters()
    this.getTipoCuentaContable()
    this.getRegimenTributario() 
  }
 
  calculateCode(parent:any,sufijoCodigo:number){
    console.log(parent)
    let codigo=(parent?.codigo || '') +(sufijoCodigo+1)
    this.formModal.controls["codigo"].setValue(codigo)
  }

  save(edit:boolean) {
    const formData = this.formModal.value;
    const data={
        edit:edit,
        formData : formData
    }
    this.dialogRef.close(data); 
  }


  getErrorMessage(element,add_error_messaje?){
    return this.formsService.getErrorMessage(element,add_error_messaje);
  }


  resertForm(){
    this.formModal=this.fb.group({
      idCuentaContable:[null],
      idTipoCuentaContable: ["",this.RequeredRule],
      tipoCuentaContable: [""],
      descripcion: ["",this.RequeredRule],
      idCuentaSuperior:  [null],
      naturaleza:  ["",this.RequeredRule],
      idRegimenTributario: ["",this.RequeredRule],
      regimenTributario: [""],
      codigo: ["",this.RequeredRule],
      codigoSbs:  ["",this.RequeredRule],
      codigoFlujo:  ["",this.RequeredRule],
      codigoPresupuesto: ["",this.RequeredRule] 
 });
  }

  asingFilters(){
    //tipoCuenta
    this.tipoCuentaFilterCtrl.valueChanges
    .pipe(filter((search) => !!search),
    takeUntil(this._onDestroy),
    debounceTime(250), 
    distinctUntilChanged(),
    delay(500), tap(() => (this.searching = true)))
    .subscribe((filtered) => { this.filterTipoCuenta(filtered); });

    //regimen tributario
    this.regimenTributarioFilterCtrl.valueChanges
    .pipe(filter((search) => !!search),
    takeUntil(this._onDestroy),
    debounceTime(250), 
    distinctUntilChanged(),
    delay(500), tap(() => (this.searching = true)))
    .subscribe((filtered) => { this.filterRegimenTributario(filtered); });
    
  }

   getRegimenTributario(page=1,size=10,term?){
    this.contabilidadService.getRegimenTributario(page,size,term).subscribe(res=>{
      this.regimenTributario=res["result"]
      this.searching = false;
    }, error => {
      try{new ToastAlertComponent("error", error.error.message)
    }finally{  this.searching = false; }
    }) 
  }

  
  protected filterRegimenTributario(value) {
    this.regimenTributario = [];
    if (!value || value.length < 2 || value == " ") {
      this.regimenTributario = [];
      this.searching = false;
      return;
    }
    this.getRegimenTributario(1,10,value);
  }

  seleccionarRegimenTributario(regimenTributario){
    this.formModal.controls['regimenTributario'].setValue(regimenTributario.descripcion);
}

getTipoCuentaContable(page=1,size=10,term?){
  this.contabilidadService.getTipoCuentasContables(page,size,term).subscribe(res=>{
    this.tipoCuenta=res["result"]
    this.searching = false;
  }, error => {
    try{new ToastAlertComponent("error", error.error.message)
  }finally{this.searching = false;}
  }) 
}

protected filterTipoCuenta(value) {
  this.tipoCuenta = [];
  if (!value || value.length < 2 || value == " ") {
    this.tipoCuenta = [];
    this.searching = false;
    return;
  }

  this.contabilidadService.getTipoCuentasContables(1,10,value).subscribe(
    (data) => {
      this.tipoCuenta = data["result"];
      this.searching = false;
    },
    (error) => {
      try{new ToastAlertComponent("error", error.error.message)
    }finally{ this.spinner.hide(); }
      this.searching = false;
    }
  );
}

seleccionarTipoCuentaContable(regimenTributario){
  this.formModal.controls['tipoCuentaContable'].setValue(regimenTributario.descripcion);
}

  

}
