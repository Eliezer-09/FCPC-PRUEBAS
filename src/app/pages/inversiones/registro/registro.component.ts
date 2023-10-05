import { AfterViewChecked, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { stagger80ms }                                     from 'src/@vex/animations/stagger.animation';
import { fadeInRight400ms }                                from '../../../../@vex/animations/fade-in-right.animation';
import { scaleIn400ms }                                    from '../../../../@vex/animations/scale-in.animation';
import { fadeInUp400ms }                                   from 'src/@vex/animations/fade-in-up.animation';
import { MatStepper }                                      from '@angular/material/stepper';
import { Router }                                          from '@angular/router';
import { formatDate }                                      from '@angular/common';
import { NgxSpinnerService }                               from 'ngx-spinner';
import { ToastAlertComponent }                             from 'src/app/components/alerts/toast-alert/toast-alert.component';
import { DataService }                                     from 'src/app/services/data.service';
import { FilesUploadComponent }                            from 'src/app/components/files-upload/files-upload.component';
import { FormsService }                                    from 'src/app/services/forms.service';
import { iconify}                                          from 'src/static-data/icons';
import { InversionesService }                              from '../inversiones.service';
import { FormDataInversionComponent }                      from './form-data-inversion/form-data-inversion.component';
import { AmortizacionInversionComponent }                  from './amortizacion-inversion/amortizacion-inversion.component';
import icDoneAll                                           from '@iconify/icons-ic/twotone-done-all';
import { F } from '@angular/cdk/keycodes';
import { TiposTituloInversiones } from 'src/@vex/interfaces/enums';

@Component({
  selector: 'vex-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
})
export class RegistroComponent implements OnInit, AfterViewChecked {
  icroundTableChart=iconify.icroundTableChart;
  icDoneAll = icDoneAll;
  icroundChevronRight= iconify.icroundChevronRight;
  icroundDiamond      = iconify.icroundDiamond ;
  layoutCtrl = new FormControl('fullwidth');
  tablaAmortizacion = [];

  @Input() formtValidTituloValores=false;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild(FormDataInversionComponent) formDataInversionComponent;
  @ViewChild(AmortizacionInversionComponent) amortizacionInversionComponent;
  @ViewChild(FilesUploadComponent) filesUploadComponent;

  RegistrarFormGroup: FormGroup;
  DocumentoFormGroup: FormGroup;
  AmortizationFormGroup: FormGroup;

  fileBase64;
  tablaAmortizacionForm;
  tablaSimulacionForm;
  dataRegistratForm;

  allowedAmortization:boolean=false;
  isBonosInversion:boolean=false;
  isAccionInversion:boolean=false;
  isSend:boolean=false;
  constructor(
    private changeDetectorRefs: ChangeDetectorRef,
    private fb: FormBuilder,
    private inversionesService: InversionesService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private formsService:  FormsService,
    private dataService:   DataService,
  ) { }



  ngAfterViewChecked(): void {
    this.changeDetectorRefs.detectChanges();
  }


  ngOnInit(): void {
    this.DocumentoFormGroup = this.fb.group({
      ctrl: ['', Validators.required]
    });
    this.RegistrarFormGroup = this.fb.group({
    });
    this.AmortizationFormGroup = this.fb.group({
    });
  }


  getTablaAmortizacion(event) {
    this.tablaAmortizacion = event
  }


  getSimulation(){
    const detalle = new Promise<string>((resolve, reject) => {
      this.spinner.show();
      const dataSimulacion = this.getSimulationData(this.dataRegistratForm);
      this.inversionesService.generarTablaAmortizacion(dataSimulacion).subscribe((res: any) => {
        this.tablaAmortizacionForm = res.result.cuotas;
        this.tablaSimulacionForm = res.result;
        this.changeDetectorRefs.detectChanges();
        this.spinner.hide();
        resolve("true")
      }, error => {
        this.spinner.hide();
        resolve("false")
        try{new ToastAlertComponent("error", error.error.message);}finally{/*  */}
      });
        
    });
  return  detalle.then(value => {return value=="true"});
  }


  generateSimulation(){
    this.tablaAmortizacionForm=null;
    this.dataRegistratForm=this.RegistrarFormGroup.value.formInversion;
    this.getSimulation().then( result => { 
      if(result){
        this.NextStepper();
      }
    })
  }


  getDataAmortization(){
    const amortization = new Promise<string>((resolve, reject) => {
      let formData=this.amortizacionInversionComponent?.buildFormAmortization();
      if(formData){
        let controls =["totalCapital","totalCobrar","totalInteres"]
        controls.forEach(control=>  {this.RegistrarFormGroup.value.formInversion[control]=formData[control]});
        resolve("true")
      }else{
        resolve("false")
      }
    });
  return  amortization.then(value => {return value=="true"});
  }


  

  calculatePeriodoMensual(formData){
    if(formData.idTipoInversion==TiposTituloInversiones.Bonos){
      const fechaEmision=formData.fechaEmision;
      const fechaVencimiento=formData.fechaVencimiento;
      let periodoDays360= this.formsService.calculateDays360(fechaEmision,fechaVencimiento);
      return periodoDays360;
    }
    return formData.totalPlazo;
  }


  getSimulationData(formData){
    formData.fechaEmision=this.formsService.setLocalTime(formData.fechaEmision)
    formData.fechaEmision=formatDate(formData.fechaEmision, "yyyy-MM-dd'T'HH:mm:ss'Z'", 'en-US');

    formData.fechaVencimiento=this.formsService.setLocalTime(formData.fechaVencimiento)
    formData.fechaVencimiento=formatDate(formData.fechaVencimiento, "yyyy-MM-dd'T'HH:mm:ss'Z'", 'en-US');
    return{
      idTipoInversion:formData.idTipoInversion,
      fechaInicio: formData.fechaEmision,
      fechaVencimiento: formData.fechaVencimiento,
      valorNominal: this.setTwoNumberDecimal(formData.valorNominal),
      tipoPlazo: formData.tipoPlazo,
      dias: this.calculatePeriodoMensual(formData),
      tasa: formData.tasa,
      gracia: formData.plazoGracia,
      tipoCapital: formData.tipoCapital
    }

  }

  setTwoNumberDecimal(value) {
    if(value){
      let parseValue=value.toString().replaceAll(',', '')
      return parseFloat(this.formsService.setNumberDecimal(parseValue+'',2));
    }  
    return 0;
}
  

  GenerateSimulation(formData){
    this.spinner.show();
      const dataSimulacion = this.getSimulationData(formData);
      this.inversionesService.generarTablaAmortizacion(dataSimulacion).subscribe((res: any) => {
        this.tablaAmortizacionForm = res.result.cuotas;
        this.tablaSimulacionForm = res.result;
        this.changeDetectorRefs.detectChanges();
        this.spinner.hide();
       
      }, error => {
        this.spinner.hide();
        try{new ToastAlertComponent("error", error.error.message);}finally{/*  */}
      });
    }


  isAllowedAmortization(event:boolean){
    this.allowedAmortization=event;
  }


  getDetalleTitulo(formData){
    return {
      desde: formData.desdeAccion,
      hasta: formData.hastaAccion,
      cantidad: formData.numeroAcciones,
      precioPorAccion:formData.precioPorAccion,
      total: formData.valorNominal,
      valorContable: formData.valorEnLibro,
      valorMercado: formData.valorMercado,
    }
  }


  getDataRegistratForm(RegistrarFormGroup){
    let isAccionInversion=RegistrarFormGroup.idTipoInversion==TiposTituloInversiones.AccionesNoCotizadas || RegistrarFormGroup.idTipoInversion==TiposTituloInversiones.AccionesCotizadas
    const inversion = new Promise<string>((resolve, reject) => {
      this.parserFormDates( RegistrarFormGroup,"yyyy-MM-dd'T'HH:mm:ss'Z'", 'en-US'); 
      if(RegistrarFormGroup.idEmisorDefault)RegistrarFormGroup["idEmisor"]=RegistrarFormGroup.idEmisorDefault;
      if(isAccionInversion) RegistrarFormGroup["detalleTitulo"]=this.getDetalleTitulo(RegistrarFormGroup) 
      resolve("true");
    });
  return  inversion.then(value => {return value=="true"});
  }


  confirmFile() {
    const adjuntos = new Promise<string>((resolve, reject) => {
      let fileResultList: Array<File> = this.filesUploadComponent.uploadedFilesList
      if (fileResultList.length == 0) {
          try { new ToastAlertComponent("info", "Debe cargar el archivo de la inversion")} finally {/*  */};
          resolve("false");
      } else {
          this.DocumentoFormGroup.controls["ctrl"] .setValue(fileResultList);
          this.fileBase64 = this.DocumentoFormGroup.value .ctrl[0];
          this.dataService.getBase64(this.fileBase64).then((res: any) => {
            this.fileBase64 = res;
            resolve("true");
          })
      }
    });
    return  adjuntos.then(value => {return value=="true"});
  }

  validationSaves(){
    let canSave: boolean = this.RegistrarFormGroup.valid && this.AmortizationFormGroup.valid;
      if (canSave) {
          this.getDataRegistratForm(this.RegistrarFormGroup.value.formInversion).then(result => {
              if (result && !this.isSend) 
                this.guardarInversion();
              })
      } else {
          try { new ToastAlertComponent("info","No es posible guardar la inversión, Verifica los campos" );} finally {/*  */ }
      }
  }

  parserFormDates(formData,format:string,locate:string){
      if(formData.fechaEmision){
      formData.fechaEmision=this.formsService.setLocalTime(formData.fechaEmision)
      formData.fechaEmision=formatDate(formData.fechaEmision,format,locate);
      }
      if(formData.fechaVencimiento){
      formData.fechaVencimiento=this.formsService.setLocalTime(formData.fechaVencimiento)
      formData.fechaVencimiento=formatDate(formData.fechaVencimiento,format,locate);
      }

      if(formData.fechaCompra){
        formData.fechaCompra=this.formsService.setLocalTime(formData.fechaCompra)
        formData.fechaCompra=formatDate(formData.fechaCompra,format,locate);
        }
  }


  guardarInversion(){
    this.spinner.show();
    this.isSend=true;
    let formData=this.RegistrarFormGroup.value.formInversion;
    this.inversionesService.guardarInversion(formData).subscribe(async (response: any) => {

      try{
        let detalle=this.allowedAmortization? await this.postDetalleInversionProm(response.result.idInversion, formData.dividendo):true;
        let adjuntos= await this.postAdjuntoByIdInversionProm(response.result.idInversion)
      if(!detalle || !adjuntos){
        throw Error("Hubo un problema al guardar la inversión")
      }else{
        this.spinner.hide();
        this.router.navigateByUrl('/inversiones/consultas'); 
        new ToastAlertComponent("success", "Se ha registro exitosamente la inversión");
      }

      }catch (e){
          this.isSend=false;
          this.anularInversion(response.result.idInversion)
      } 
    
  }, error => {
    this.spinner.hide();
    this.isSend=false;
    try{new ToastAlertComponent("error", error.error.message)} finally{/*  */};  
  });  
  }

  
  postAdjuntoByIdInversionProm(idInversion:number){
    const adjunto = {
      "tipoAdjunto": "Documento",
      "adjunto":this.fileBase64,
      "mimeType": "string",
      "observaciones": "string"
    }
    
    const adjuntos = new Promise<string>((resolve, reject) => {
      this.inversionesService.postAdjuntoByIdInversion(adjunto, idInversion
        ).subscribe((response: any) => {
          resolve("true");
        }, error => {
          resolve("false");
       }); 

  });
  return  adjuntos.then(value => {return value=="true"});
  }

  postDetalleInversionProm(idInversion:number,data){
    const detalle = new Promise<string>((resolve, reject) => {
      this.inversionesService.postDetalleInversion(idInversion, data).subscribe(res=>{
        resolve("true");
      }, error=>{
        this.spinner.hide()
        resolve("false");
    });

  });
  return  detalle.then(value => {return value=="true"});
  }


  anularInversion(idInversion){
        this.inversionesService.deleteInversion(idInversion).subscribe(res=>{
          this.spinner.hide();
          try{new ToastAlertComponent("error", "Hubo un problema al guardar la inversión")}finally{/*  */}
        }, error => {
          try{new ToastAlertComponent("error", error.error.message)}finally{/*  */}
      });
  }

  NextStepper(){
    this.changeDetectorRefs.detectChanges();
    this.stepper.next();
  }

  validformDataInversion() {
    const resultProm = new Promise<boolean>((resolve, reject) => {
      let result = this.formDataInversionComponent.getElementErrors();
      resolve(result);
    });
    return  resultProm.then(value => {return value});
  }

  stepperControllerRegistro() {
    this.validformDataInversion().then(result => {
      if(!result){
          this.NextStepper()
      } else{
            try {
                new ToastAlertComponent("info", "Verifica los campos");
            } finally {/*  */}
      }});
  }

  stepperControllerDocumento() {
    this.confirmFile().then(result => {
      if(result){
        if(this.allowedAmortization){
          this.NextStepper()
        } else{
          this.validationSaves()
        }
      }});
  }

  stepperControllerSelect(event) {
    let sectionName = event.selectedStep.label;
    if(sectionName=="amortizacion"){
      this.generateSimulation();
    }
}

 stepperController(event) {
    let sectionName = event;
    switch (sectionName) {
         case "registro":
            this.stepperControllerRegistro();
          break; 
        case "documento":    
           this.stepperControllerDocumento();
              break;
        case "amortizacion":
            if (this.AmortizationFormGroup.valid) {
              this.getDataAmortization().then( result => { 
                if(result){
                  this.validationSaves();     
                }
              })
            } else {
                this.amortizacionInversionComponent.getElementErrors();
            }
            break;
        default:
            break;
    }
}

}


