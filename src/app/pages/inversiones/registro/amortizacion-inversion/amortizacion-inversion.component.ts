import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, ValidationErrors, Validators } from '@angular/forms';
import { createMask } from '@ngneat/input-mask';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { ToastAlertComponent } from 'src/app/components/alerts/toast-alert/toast-alert.component';
import { FormsService } from 'src/app/services/forms.service';
import { iconify } from 'src/static-data/icons';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS}       from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE}           from '@angular/material/core';
import * as _moment                                               from 'moment';
import {default as _rollupMoment }                                from 'moment';


const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
      dateInput: 'yyyy-MM-dd'
  },
  display: {
      dateInput: 'YYYY-MM-DD',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM-YYYY'
  }
};
@Component({
  selector: 'vex-amortizacion-inversion',
  templateUrl: './amortizacion-inversion.component.html',
  styleUrls: ['./amortizacion-inversion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ], 
})
export class AmortizacionInversionComponent implements OnInit, AfterViewChecked {
  formtablaAmortizacion = this.fb.group({})
  form: FormGroup;
  layoutCtrl = new FormControl('fullwidth');
  amortizacionColumns = ["numCuota", "fechaVencimiento","tiempoDias", "interes", "capital","total"];
  @Input()  RegistrarFormGroup: FormGroup;
  @Input()  dataRegistratForm;
  @Input()  tablaAmortizacionForm;
  @Input()  tablaSimulacionForm;
  @Output() tablaSimulacionEmit= new EventEmitter<any>();
  fechaEmision:string="";
  fechaVencimiento:string="";
  tablaSimulacion = [];
  icroundTableChart=iconify.icroundTableChart;

  DecimalInputMask = createMask({
    alias: 'numeric',
    groupSeparator: '.',
    digits: 2,
    digitsOptional: true,
    numericInput: true,
    placeholder: "0.00"
  });
  
  @ViewChild('toastAlertComponent') toastAlertComponent: ToastAlertComponent;
  constructor(
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private formsService: FormsService,
    private ctrlContainer: FormGroupDirective,) {
  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges()
  }

  ngOnInit() {
    this.creatFormRows(this.tablaAmortizacionForm);
  }
 
  noNegative(item){
     if(item.capital<0 || item.interes<0){
      if(item.capital<0) this.formtablaAmortizacion.controls['capital'+item.numCuota].setErrors({'especificError': "El valor no debe ser menor a 0"})
      if(item.interes<0)this.formtablaAmortizacion.controls['interes'+item.numCuota].setErrors({'especificError': "El valor no debe ser menor a 0"})
    } 
    return true;
  }

  creatFormRows(tablaAmortizacionForm){
    this.formtablaAmortizacion=this.fb.group({})
    this.formtablaAmortizacion = this.ctrlContainer.form;
    tablaAmortizacionForm.forEach(cuota => {
      let capital="capital"+cuota.numCuota;
      let interes="interes"+cuota.numCuota;
      let fecha="fechaVencimiento"+cuota.numCuota;
      this.formtablaAmortizacion.addControl(fecha, new FormControl(cuota.fechaVencimiento, [Validators.required]));
      this.formtablaAmortizacion.addControl(capital, new FormControl(cuota.capital, [Validators.required, Validators.min(0)]));
      this.formtablaAmortizacion.addControl(interes, new FormControl(cuota.interes, [Validators.required, Validators.min(0)]));
    });
  
  }
  
  getErrorMessage(element,add_error_messaje?){
    return this.formsService.getErrorMessage(element,add_error_messaje);
  }
 


  getElementErrors() {
    this.formtablaAmortizacion.markAllAsTouched();
    for (let value of Object.keys(this.formtablaAmortizacion.controls)) {
      let  key=value;
      const controlErrors: ValidationErrors = this.formtablaAmortizacion.get(key).errors;
      if (controlErrors != null) {
         let element=document.getElementById(key);
        if(element) element.scrollIntoView({  block: 'center',behavior: 'smooth'  }); 
        try{ new ToastAlertComponent("info", "Verifica los campos");}finally{ /*  */ }
        return true;
      }
    }
    return false;
  }
  
  buildFormAmortization() {
    let formData;
      formData=this.dataRegistratForm;
      formData["dividendo"]=this.tablaAmortizacionForm;
      formData["totalInteres"]=this.tablaSimulacionForm.totalInteres
      formData["totalCapital"]=this.tablaSimulacionForm.totalCapital
      formData["totalCobrar"]=this.tablaSimulacionForm.totalCobrar
  return formData;
  }


  recalculartotal(index, event, tipo,field) {
    this.tablaSimulacionForm.totalInteres = 0;
    this.tablaSimulacionForm.totalCapital = 0;
    this.tablaSimulacionForm.totalCobrar = 0;
 
    switch (tipo) {
      case "interes":
          this.tablaAmortizacionForm[index]["interes"] =this.setTwoNumberDecimalResult(event);
        break;
      case "capital":
          this.tablaAmortizacionForm[index]["capital"] =this.setTwoNumberDecimalResult(event);
        break;

      default:
        break;
    }
    const total = this.tablaAmortizacionForm[index]["interes"] + this.tablaAmortizacionForm[index]["capital"];
    this.tablaAmortizacionForm[index]["cobrar"] = total;
    this.tablaAmortizacionForm.forEach(res=>{
      this.tablaSimulacionForm.totalInteres = this.tablaSimulacionForm["totalInteres"] + res.interes
      this.tablaSimulacionForm.totalCapital = this.tablaSimulacionForm["totalCapital"] + res.capital
      this.tablaSimulacionForm.totalCobrar = this.tablaSimulacionForm["totalCobrar"]+ res.cobrar
    })
  }

  setTwoNumberDecimalResult(value) {
      if(value){
        let parseValue=value.toString().replaceAll(',', '')
        return parseFloat(this.formsService.setNumberDecimal(parseValue+'',2));
      }  
      return 0;
  }
}
