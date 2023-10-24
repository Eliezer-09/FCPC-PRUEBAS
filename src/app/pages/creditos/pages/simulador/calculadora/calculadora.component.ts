import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { createMask } from '@ngneat/input-mask';
import { PrestamosComponent } from '../prestamos/prestamos.component';
import { iconify } from 'src/static-data/icons';
import { ComponentesService } from 'src/app/services/componentes.service';
import { CreditoServiceComponent } from 'src/app/services/creditos.service';
import { EstadisticaComponent } from '../estadistica/estadistica.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalTableAmortizacionComponent } from '../../../components/modal-table-amortizacion/modal-table-amortizacion.component';
import { ModalValidacionSolicitudComponent } from '../modal-validacion-solicitud/modal-validacion-solicitud.component';
import { FormsService } from 'src/app/services/forms.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Identificacion } from 'src/app/model/models';
import { EstadisticasSimulacionCredito } from '../../../model/models-creditos';
import { TablaSimunacionAmortizacionConfigure, TablaSimunacionAmortizacionRestructuracionConfigure } from 'src/static-data/configure-table/creditos/configure-table-amortizacion';

@Component({
  selector: 'vex-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.scss']
})
export class CalculadoraComponent implements OnInit {
  @ViewChild(PrestamosComponent) prestamosComponent:PrestamosComponent;
  @ViewChild(EstadisticaComponent) estadisticaComponent:EstadisticaComponent;
  searchCtrl: FormControl = new FormControl();
  tipoAmortizaciones:any[]=[{label:"Francesa",value:"Francesa"},{label:"Alemana",value:"Alemana"}]
  buscar :string= "";
  simboloMoneda: string     ='$';
  hasPrestamos:boolean=false;
  hasSaldoNeto:boolean=false;
  hasInteres:boolean=false;
  hasFechaInicio:boolean=false;
  hasOnePrestamo:boolean=false;
  canSimular:boolean=true;
  readonlyMonto: boolean = true;
  today=  new Date();
  icroundSearch = iconify.icroundSearch;
  icroundAutoGraph =iconify.icroundAutoGraph;
  icroundRunningWithErrors=iconify.icroundRunningWithErrors
  showTablaAmoritizacion:boolean=false;
  showPagoMensual:boolean=false;
  showTotalMora:boolean=false;
  showValorDiferido:boolean=false;
  saldoNetoValid:boolean=true;
  @Input() isSimulacion:boolean=true;
  @Output() SimulacionEmit: EventEmitter<any> = new EventEmitter();
  @Output() AccionEmit: EventEmitter<any> = new EventEmitter();
  participe: Identificacion = {};
  DecimalMinusInputMask = createMask({
    alias: 'numeric',
    groupSeparator: '.',
    digits: 2,
    digitsOptional: false,
    placeholder: '0',
    allowMinus: true,
  });
  DecimalInputMask = createMask({
    alias: 'numeric',
    groupSeparator: '.',
    digits: 2,
    digitsOptional: false,
    placeholder: '0',
    allowMinus: false,
  });

  InputMask = createMask({
    alias: 'numeric',
    groupSeparator: '.',
    digits: 0,
    placeholder: '',
    digitsOptional: false,
    allowMinus: false,
  });

  PorcentInputMask = createMask({
    alias: 'numeric',
    groupSeparator: '.',
    digits: 2,
    digitsOptional: true,
    allowMinus: false,
    min: 0,
    max:100,
    numericInput: true
  });
  
  NumberNoZeroNoNegative: any[]=[Validators.required,Validators.pattern(this.formsService.expNotZero)];
  PorcentRule:            any[]=[Validators.required,Validators.min(0),Validators.max(100),Validators.pattern(this.formsService.expNotZero)];
  simulacionFormGroup=this.fb.group({
    tipoAmortizacion:["Francesa",[Validators.required]],
    montoSolicitado:[0.00,this.NumberNoZeroNoNegative],
    plazo:['',this.NumberNoZeroNoNegative],
    interesVariable:[0.00,this.PorcentRule],
/*     intereses:[0.00,[Validators.required]], */
/*     descuento:[0,[Validators.required]], */
    prestamos:[null],
    idProducto:[1,[Validators.required]],
    tipoPrestamo:["Normal",[Validators.required]],
    idParticipe:[null],
    fechaInicio:[null,[Validators.required]],
    saldoCapital:[0.00],
    saldoNeto:[0.00],
    totalNovar:[0.00]
  });
  constructor( private fb: FormBuilder,
    private componentService: ComponentesService,
    private creditoServiceComponent: CreditoServiceComponent,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,  
    private formsService:  FormsService,
    private spinner: NgxSpinnerService) { }
    

  ngOnInit(): void {
    this.simulacionFormGroup.controls["fechaInicio"].disable()
    this.simulacionFormGroup.controls["interesVariable"].disable()
  }

  changeParticipe(participe){
    this.participe=participe
    this.simulacionFormGroup.controls["idParticipe"].setValue(participe.idParticipe);
    if( !this.participe.idParticipe &&  this.hasPrestamos ){
      this.componentService.alerta( "warning","Busca un partícipe para ver sus préstamos.");
      this.prestamosComponent?.clearPrestamos();
      return
    }
    this.prestamosComponent?.getPrestamos(participe.idParticipe,this.simulacionFormGroup.value.tipoPrestamo);
  }

  clearSimulator(){
    this.simulacionFormGroup.controls["montoSolicitado"].setValue(0.00)
    this.simulacionFormGroup.controls["plazo"].setValue("")
/*     this.simulacionFormGroup.controls["intereses"].setValue(0.00) */
    this.simulacionFormGroup.controls["prestamos"].setValue(null)
    this.simulacionFormGroup.controls["saldoCapital"].setValue(0.00)
     this.simulacionFormGroup.controls["saldoNeto"].setValue(0.00)
     this.simulacionFormGroup.controls["totalNovar"].setValue(0.00)
     this.simulacionFormGroup.controls["interesVariable"].setValue(0.00)
    this.dataSimulacion=null
  }

  simular() {
    this.simulacionFormGroup.controls["saldoCapital"].disable()
    this.simulacionFormGroup.controls["saldoNeto"].disable()
    this.simulacionFormGroup.controls["totalNovar"].disable()
    
    this.spinner.show();
      let solicitudCreditoRequest= this.creditoServiceComponent.simulacionCreditoRequest(this.simulacionFormGroup.value.tipoPrestamo, this.simulacionFormGroup.value)
      solicitudCreditoRequest.subscribe( (res: any) => {
        this.simulacionFormGroup.controls["saldoCapital"].enable()
        this.simulacionFormGroup.controls["saldoNeto"].enable()
        this.simulacionFormGroup.controls["totalNovar"].enable()
        if(res.error){
          this.spinner.hide();
          this.canSimular=true; 
          this.componentService.alerta("error", res.message || "Hubo un error al generar la simulación");
          return;
        }

           this.dataSimulacion=res.data;
           this.detectarCambios()
           this.cambiarDataGrafico()
          this.chooseValidaciones()
           this.canSimular=true; 
           this.spinner.hide();
           if(!this.isSimulacion) this.SimulacionEmit.emit(res)
         }
      )
  }

  chooseValidaciones(){
    if(this.isSimulacion){
      this.validarSimulacionSolicitud()
     }else{
      this.validarSolicitud()
     } 
  }

  dataSimulacion:EstadisticasSimulacionCredito;

  estadisticasCredito={
    totalPrestamo:0,
    totalInteres:0,
    totalCapital:0,
    pagoMensual:0,
    tasaNominal:0,
    tasaefectiva:0,
    totalDesgravamen:0,
    descuentoInteres:0,
    valorDiferido:0
  }

  detectarCambios() {
    this.changeDetectorRefs.detectChanges(); 
  }

  cambiarDataGrafico(){
    this.estadisticasCredito={totalPrestamo : this.dataSimulacion.totalPrestamo,
                              totalInteres : this.dataSimulacion.totalInteres,
                              totalCapital : this.dataSimulacion.totalCapital,
                              pagoMensual : this.dataSimulacion.cuotas[0].total,
                              totalDesgravamen:this.dataSimulacion.totalDesgravamen,
                              tasaNominal : parseFloat(this.dataSimulacion.tasa.toFixed(2)),
                              tasaefectiva : parseFloat(this.dataSimulacion.tasaEfectiva.toFixed(2)),
                              descuentoInteres:this.dataSimulacion.descuentoInteres,
                              valorDiferido:this.dataSimulacion.valorDiferido,
    }
    this.estadisticaComponent. loadGraphic(this.estadisticasCredito);
    this.showTablaAmoritizacion=true;
   }

   cambiarProducto(idProducto){
      this.simulacionFormGroup.controls["idProducto"].setValue(idProducto)
      this.dataSimulacion=null;
      if( idProducto == 7 ){
        this.simulacionFormGroup.controls["plazo"].setValue(null)
      }
      this.detectarCambios()
   }

   cambiarPrestamo(TipoPrestamo){
    this.readonlyMonto = false;
    this.simulacionFormGroup.controls["tipoPrestamo"].setValue(TipoPrestamo)
    this.dataSimulacion=null;
    this.simulacionFormGroup.controls["saldoNeto"].setValue(0)
    this.simulacionFormGroup.controls["totalNovar"].setValue(0)
    
    if( this.simulacionFormGroup.value.tipoPrestamo=="Normal"){
      this.simulacionFormGroup.controls["saldoCapital"].setValue(0)
    }
    if(  this.simulacionFormGroup.value.tipoPrestamo=="Restructuracion"){
/*       this.simulacionFormGroup.controls["descuento"].enable()
      this.simulacionFormGroup.controls["descuento"].setValue(50) */
      this.simulacionFormGroup.controls["interesVariable"].enable()
      this.prestamosComponent?.clearToggle()
    }else{
      this.simulacionFormGroup.controls["interesVariable"].disable()
      this.simulacionFormGroup.controls["interesVariable"].setValue(0.00)
    /*   this.simulacionFormGroup.controls["descuento"].disable() */
/*       this.simulacionFormGroup.controls["intereses"].setValue(0.00) */
    } 
    if(TipoPrestamo!="Refinanciamiento"){
       this.simulacionFormGroup.controls["fechaInicio"].disable()
    } else{
     this.simulacionFormGroup.controls["fechaInicio"].enable()
      this.simulacionFormGroup.controls['fechaInicio'].setValue(new Date)
    }     
    this.detectarCambios()
   } 

   
  tablaAmortizacion() {
    let tableColumns=TablaSimunacionAmortizacionConfigure
    if(this.simulacionFormGroup.value.tipoPrestamo=="Restructuracion")  tableColumns=TablaSimunacionAmortizacionRestructuracionConfigure
      const dialogRef = this.dialog.open(ModalTableAmortizacionComponent, {
        width: "100%",
        autoFocus: false,
        maxHeight: "90vh",
        data: { data: this.dataSimulacion, isRestructuracion:  this.simulacionFormGroup.value.tipoPrestamo=="Restructuracion", tableColumns:tableColumns},
      });
      dialogRef.afterClosed().subscribe((result) => {});
  }

  reemplaceTotal(totales){
    /*   this.simulacionFormGroup.controls["intereses"].setValue(totales.interes) */
      this.simulacionFormGroup.controls["saldoCapital"].setValue(totales.capital)
      if( this.simulacionFormGroup.value.tipoPrestamo=="Restructuracion" ||  this.simulacionFormGroup.value.tipoPrestamo=="Refinanciamiento"){
        this.simulacionFormGroup.controls["montoSolicitado"].setValue(totales.capital)
        this.readonlyMonto = true;
      } 
      this.simulacionFormGroup.controls["totalNovar"].setValue(totales.totalSaldoCancelacion)
      if(this.hasSaldoNeto ) this.calcularSaldoNeto('totalNovar')
  }

  validarSolicitud(){
    const dialogRef = this.dialog.open(ModalValidacionSolicitudComponent, {
      width: "60%",
      autoFocus: false,
      maxHeight: "90vh",
      disableClose: true,
      data: { data: this.dataSimulacion["validaciones"] },
    });
    dialogRef.afterClosed().subscribe((result) => {
      let action=""
      if (result.garante) {
        action="garante"
      }
      this.AccionEmit.emit(action)
    });
  }

  validarSimulacionSolicitud(){
    const dialogRef = this.dialog.open(ModalValidacionSolicitudComponent, {
      width: "60%",
      autoFocus: false,
      maxHeight: "90vh",
      disableClose: true,
      data: { data: this.dataSimulacion["validaciones"] },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.valido) {
        this.componentService.alerta("success", "Tu crédito podrá ser procesado con éxito");
      }
    });
  }

  changeCanSimular(){
    this.spinner.hide();
    this.canSimular=true; 
  }
  PreSimulacion(){
    this.spinner.show();
    this.canSimular=false; 
    this.showTablaAmoritizacion=false;
    this.getElementErrors() ;
    if(!this.simulacionFormGroup.valid){
      this.componentService.alerta("info",  "Debes completar los campos solicitados");
      this.changeCanSimular()
      return;
    }

    if(this.hasPrestamos){

      if(this.prestamosComponent.idPrestamos.length>1 && this.hasOnePrestamo){
        this.componentService.alerta("info",  "Solo puedes elegir un préstamo");
        this.changeCanSimular()
        return;
      }
    
      this.simulacionFormGroup.controls["prestamos"].setValue(this.prestamosComponent.idPrestamos)
    }else{
      this.simulacionFormGroup.controls["prestamos"].setValue([])
    }

    let hasPrestamos=this.simulacionFormGroup.value.prestamos.length>0;
    if (this.hasPrestamos && !hasPrestamos) {
        this.componentService.alerta(
          "error",
          "Debe seleccionar por lo menos un préstamo para continuar"
        );
        this.changeCanSimular()
        return;
      } 
      
      if (this.simulacionFormGroup.value.plazo > 300) {
        this.componentService.alerta(
          "info",
          "El plazo no puede superar los 300 meses"
        );
        this.changeCanSimular()
        return;
      } 

      const valMonto=this.simulacionFormGroup.value.tipoPrestamo=="Restructuracion" ||  this.simulacionFormGroup.value.tipoPrestamo=="Refinanciamiento"
      if(!this.hasSaldoNeto && this.simulacionFormGroup.value.montoSolicitado != this.simulacionFormGroup.value.saldoCapital && valMonto) {
        this.componentService.alerta(
          "info",
          "El monto debe igual al saldo capital total"
        );
        this.changeCanSimular()
        return;
      }

      if(!this.hasSaldoNeto && this.simulacionFormGroup.value.montoSolicitado <= this.simulacionFormGroup.value.saldoCapital && !valMonto) {
        this.componentService.alerta(
          "info",
          "El monto debe ser mayor a el saldo capital total"
        );
        this.changeCanSimular()
        return;
      }

      
      if(this.hasSaldoNeto && this.simulacionFormGroup.value.montoSolicitado <= this.simulacionFormGroup.value.totalNovar) {
        this.componentService.alerta(
          "info",
          "El monto debe ser mayor al total al Novar"
        );
        this.changeCanSimular()
        return;
      }


      if(this.simulacionFormGroup.value.idProducto == 7 && this.simulacionFormGroup.value.montoSolicitado > 1500) {
          this.componentService.alerta(
            "info",
            "El monto debe ser menor o igual a 1500"
          );
          this.changeCanSimular()
          return;
        }

      
      if(this.simulacionFormGroup.value.tipoAmortizacion=="Francesa"){
        this.showPagoMensual=true;
      } else{
        this.showPagoMensual=false;
      }

      if(this.simulacionFormGroup.value.tipoPrestamo=="Restructuracion"){
        this.showTotalMora=true;
        this.showValorDiferido=true;
      } else{
        this.showTotalMora=false;
        this.showValorDiferido=false;
      }

  
      
      this.simular()
  }

  getElementErrors() {
    this.simulacionFormGroup.markAllAsTouched();
    this.verifyInputNumber()
    for (let value of Object.keys(this.simulacionFormGroup.controls)) {
      let  key=value;
      const controlErrors: ValidationErrors = this.simulacionFormGroup.get(key).errors;
      if (controlErrors != null) {
         let element=document.getElementById(key);
        if(element) element.scrollIntoView({  block: 'center',behavior: 'smooth'  }); 
        return true;
      }
    }
    return false;
  }

  verifyInputNumber(){
    let controlsNumber=["montoSolicitado","plazo"]
    controlsNumber.forEach(control => {
      let value=this.simulacionFormGroup.value[control]
      if((!value || value<=0 ) && this.simulacionFormGroup.controls[control].status!="DISABLED"){
        this.simulacionFormGroup.controls[control].setErrors({'especificError': "El valor no debe ser 0 o menor."});
      }
    });
  }

  setTwoNumberDecimal(parameter) {
    let value=this.simulacionFormGroup.value[parameter]
    if( !value || value<=0 ){
      this.simulacionFormGroup.controls[parameter].setErrors({'especificError': "El valor no debe ser 0 o menor."});
    }else{
      if(value){
        let parseValue =value
        if (typeof value!="number") {
          parseValue = value.replaceAll(',', '')
        }
         this.simulacionFormGroup.controls[parameter].setValue( parseFloat(this.formsService.setNumberDecimal(parseValue+'',2)));
         return  this.simulacionFormGroup.value[parameter] 
      }  
    }
  }

  setTwoNumberDecimalAllowedZero(parameter) {
    let value=this.simulacionFormGroup.value[parameter]
    if( !value || value<0 ){
      this.simulacionFormGroup.controls[parameter].setErrors({'especificError': "El valor no debe ser menor a 0"});
    }else{
      if(value){
        let parseValue =value
        if (typeof value!="number") {
          parseValue = value.replaceAll(',', '')
        }
         this.simulacionFormGroup.controls[parameter].setValue( parseFloat(this.formsService.setNumberDecimal(parseValue+'',2)));
         return  this.simulacionFormGroup.value[parameter]
      }  
    }
  }


  calcularSaldoNeto(controler){

    let monto=this.simulacionFormGroup.value.montoSolicitado
    if(controler=="montoSolicitado"){
      monto=monto? this.setTwoNumberDecimal("montoSolicitado"):0;
      this.simulacionFormGroup.controls["montoSolicitado"].setValue(monto) 
    }  
    if(this.hasSaldoNeto){
      let saldo=this.simulacionFormGroup.value.totalNovar
      if(controler=="totalNovar"){
        saldo=saldo? this.setTwoNumberDecimal('totalNovar'): 0
      }
      let saldoNeto=monto-saldo;
      saldoNeto=saldoNeto?  parseFloat(parseFloat(saldoNeto + '').toFixed(2)):0;
      this.simulacionFormGroup.controls["saldoNeto"].setValue(monto-saldo)
    if(saldoNeto<0 ){
        this.saldoNetoValid=false
      }else{
        this.saldoNetoValid=true
      } 
  }
  }

  
  getErrorMessage(element,add_error_messaje?){
    return this.formsService.getErrorMessage(element,add_error_messaje);
  }

  changeTipoProducto(idProducto){
    this.simulacionFormGroup.controls["idProducto"].setValue(idProducto);
  }

}
