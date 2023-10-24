import { ChangeDetectionStrategy, Component,  EventEmitter,  Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { ComponentesService } from 'src/app/services/componentes.service';
import { CreditosService } from '../../../creditos.service';
import { iconify } from 'src/static-data/icons';
import { FilesGaranteComponent } from './files-garante/files-garante.component';
import { createMask } from '@ngneat/input-mask';
import { FormsService } from 'src/app/services/forms.service';
import { Garantes, Identificacion } from 'src/app/model/models';
import { Garante, GaranteRequest } from '../../../model/models-creditos';
import { TablaGarantesComponent } from './tabla-garantes/tabla-garantes.component';
@Component({
  selector: 'vex-garante',
  templateUrl: './garante.component.html',
  styleUrls: ['./garante.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class GaranteComponent implements OnInit {
  @Input() participe: Identificacion = {};
  @Output() GaranteEmit: EventEmitter<any> = new EventEmitter();
  garanteSearch: GaranteRequest = {
    idEntidad: 0,
    idPrestamo: 0,
    cuentaIndividual: 0,
    identificacion: '',
    razonSocial: ''
  };
  icroundSearch = iconify.icroundSearch;
  searchCtrl: FormControl = new FormControl();
  buscar: string= "";
  simboloMoneda: string     ='$';
  canAgregar:boolean=true;
  DecimalInputMask = createMask({
    alias: 'numeric',
    groupSeparator: '.',
    digits: 2,
    digitsOptional: false,
    placeholder: '0',
    allowMinus: false,
  });

  garantes:Garante[]= [];
  NumberNoZeroNoNegative: any[]=[Validators.required,Validators.pattern(this.formsService.expNotZero)];
  garenteForm: FormGroup =this.fb.group({
    idPersona:[""],
    razonSocial:[""],
    identificacion:["",[Validators.required]],
    montoGarantia: ["",this.NumberNoZeroNoNegative],
    observaciones: [""],
    adjuntoFrontal: [""],
    adjuntoPosterior: [""],
    adjuntoRol:[""]
  });


  @ViewChild(FilesGaranteComponent) filesGaranteComponent:FilesGaranteComponent;
  @ViewChild(TablaGarantesComponent) tablaGarantesComponent:TablaGarantesComponent;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private componentService: ComponentesService,
    private creditoService: CreditosService,
    private formsService:  FormsService,
  ) { 

  }

  ngOnInit(): void {
  
  }

  buscarGarante() { 
   this.getElementErrors() ;
   if(!this.garenteForm.valid){
    this.componentService.alerta("info", "Debe completar todos los campos solicitados");
    return
   }
      this.spinner.show();
      this.garanteSearch=null
      const identificacion=this.garenteForm.value.identificacion
      const monto=this.garenteForm.value.montoGarantia
      this.creditoService.canGaranteByPrestamo(identificacion,monto).subscribe(
        (participe:any) => {
          this.garanteSearch=participe["result"]
          this.garenteForm.controls["razonSocial"].setValue(this.garanteSearch.razonSocial)
          this.garenteForm.controls["identificacion"].setValue(this.garanteSearch.identificacion)
          this.garenteForm.controls["idPersona"].setValue(this.garanteSearch.idEntidad)
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          this.componentService.alerta("error", error["error"]["message"]);
        }
      );
  }
 
  
  agregarGarante() {
    if(!this.garanteSearch.idEntidad){
      this.componentService.alerta(
        "error",
        "No se ha ingresado el partícipe a ser garante"
      );
      return;
    }


    if (this.garanteSearch.idEntidad == this.participe.idParticipe) {
      this.componentService.alerta(
        "info",
        "El partícipe no se puede garantizar a si mismo"
      );
      return;
    }
    this.getElementErrors() ;
    if (!this.garenteForm.valid || !this.filesGaranteComponent.adjuntoGarante.valid || !this.garenteForm.value.idPersona) {
      this.componentService.alerta(
        "info",
        "Debe llenar todos los campos solicitados"
      );
      return;
    }
 
    this.spinner.show();
    this.garenteForm.patchValue(this.filesGaranteComponent.adjuntoGarante.value)
    if(!this.canAgregar) return
    this.canAgregar=false; 
    this.tablaGarantesComponent.agregarGarante(this.garenteForm.value)
    this.spinner.hide();
    this.canAgregar=true;
  }

  getGarante(garantes){
    this.GaranteEmit.emit(garantes);
  }

  getErrorMessage(element,add_error_messaje?){
    return this.formsService.getErrorMessage(element,add_error_messaje);
  }

  setTwoNumberDecimal(parameter) {
    let value=this.garenteForm.value[parameter]
    if( !value || value<=0 ){
      this.garenteForm.controls[parameter].setErrors({'especificError': "El valor no debe ser 0 o menor."});
    }else{
      if(value){
        let parseValue =value
        if (typeof value!="number") {
          parseValue = value.replaceAll(',', '')
        }
         this.garenteForm.controls[parameter].setValue( parseFloat(this.formsService.setNumberDecimal(parseValue+'',2)));
         return  this.garenteForm.value[parameter] 
      }  
    }
  }

  getElementErrors() {
    this.garenteForm.markAllAsTouched();
    this.verifyInputNumber()
    for (let value of Object.keys(this.garenteForm.controls)) {
      let  key=value;
      const controlErrors: ValidationErrors = this.garenteForm.get(key).errors;
      if (controlErrors != null) {
         let element=document.getElementById(key);
        if(element) element.scrollIntoView({  block: 'center',behavior: 'smooth'  }); 
        return true;
      }
    }
    return false;
  }
  
  verifyInputNumber(){
    let controlsNumber=["montoGarantia"]
    controlsNumber.forEach(control => {
      let value=this.garenteForm.value[control]
      if((!value || value<=0 ) && this.garenteForm.controls[control].status!="DISABLED"){
        this.garenteForm.controls[control].setErrors({'especificError': "El valor no debe ser 0 o menor."});
      }
    });
  }

}
