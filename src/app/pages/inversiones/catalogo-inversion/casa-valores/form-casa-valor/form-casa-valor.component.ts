import {AfterViewChecked,ChangeDetectorRef,Component,EventEmitter,Input,OnInit, Output}   from "@angular/core";
import {FormBuilder,FormControl,FormGroup,ValidationErrors,Validators}                    from "@angular/forms";
import { ToastAlertComponent }                              from "src/app/components/alerts/toast-alert/toast-alert.component";
import { DataService }                                      from "src/app/services/data.service";
import { FormsService }                                     from "src/app/services/forms.service";
import { iconify }                                          from "src/static-data/icons";
import { InversionesService }                               from "../../../inversiones.service";
//ANIMACIONES
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: "vex-form-casa-valor",
  templateUrl: "./form-casa-valor.component.html",
  styleUrls: ["./form-casa-valor.component.scss"],
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
})

export class FormCasaValorComponent implements OnInit, AfterViewChecked {
  @Output() enviarData = new EventEmitter();
  @Input() idEntidad;
  @Input() titleSection;

  icroundBookmark=  iconify.icroundBookmark;
  icroundChevronRight= iconify.icroundChevronRight;

  layoutCtrl = new FormControl('fullwidth');
  dataEntidadFinanciera;
  esNacional = false;
  isSend:boolean=true;
  entidadExistente:boolean=false;
  provincias            :any[] = [];
  ciudades              :any[] = [];
  paises                :any[] = [];
  parroquias            :any[] = [];
  tiposIdentificaciones :any = [];
  selectSectorInversion :any= [];

  idPais: number;
  RequeredRule:           any[]=[Validators.required];
  IdentificacionNacional: any[]=[Validators.required,Validators.minLength(13),Validators.maxLength(13),Validators.pattern(this.formsService.expNumberInt)]
  PorcentRule:            any[]=[Validators.required,Validators.min(0),Validators.max(100),Validators.pattern(this.formsService.expNotZero)];


  formCalificadora: FormGroup=this.fb.group({
    tipoFinanciera:         ["casa"],
    idPais:                 ["", this.RequeredRule],
    idTipoIdentificacion:   ["", this.RequeredRule],
    tipoIdentificacion:     ["", this.RequeredRule],
    identificacion:         [""],
    razonSocial:            ["",  this.RequeredRule],
    codigoSbs:              ["",  this.RequeredRule],
    idProvincia:            ["",  this.RequeredRule],
    idCiudad:               ["",  this.RequeredRule],
    idParroquia:            [null],
    callePrincipal:         ["",  this.RequeredRule],
    calleSecundaria:        ["",  this.RequeredRule],
    referencia:             ["",this.RequeredRule],
    celular:                ["", [Validators.required,Validators.pattern(this.formsService.expTelefono)]],
    telefono1:              ["",[Validators.required,Validators.pattern(this.formsService.expTelefono)]],
    telefono2:              ["",[Validators.pattern(this.formsService.expTelefono)]],
    correo1:                ["", [Validators.required,Validators.pattern(this.formsService.expEmail)]],
    correo2:                ["", [Validators.pattern(this.formsService.expEmail)]],
    web:                    [""],
    entidadFinanciera: {},
    direccion:{}
  });


  constructor(
    private fb: FormBuilder,
    private inversionesService: InversionesService,
    private dataService: DataService,
    private changeDetector: ChangeDetectorRef,
    private formsService:  FormsService,
    private spinner: NgxSpinnerService,
  ) { }

    ngOnInit() {
      this.getIDType();
      this.loadPaises();
      if(this.idEntidad) this.getEntidadFinancieraById(this.idEntidad);
    }


    getEntidadFinancieraById(idEntidad){
      this.spinner.show();
      this.inversionesService.getEntidadFinancieraById(idEntidad).subscribe((response: any) => {
        this.dataEntidadFinanciera = response["result"];
        this.asingDataToForm();
        this.fillCombox();
      });
    } 


    fillCombox(){
      this.filterGetIDType(this.dataEntidadFinanciera["idTipoIdentificacion"]);
      if( this.dataEntidadFinanciera["direccion"]){
      const idPais=this.dataEntidadFinanciera["direccion"]["idPais"]
      if(idPais){
        this.enableDirection(idPais)
        this.loadProvincias();
      }
    }
    }

    asingDataToForm(){
      this.formCalificadora.patchValue(this.dataEntidadFinanciera);
      const controlListDirection=["referencia","callePrincipal","calleSecundaria","idPais","idCiudad","idParroquia","idProvincia"]
      controlListDirection.forEach(control => {
        if( this.formCalificadora.controls[control] && this.dataEntidadFinanciera["direccion"]){
          this.formCalificadora.controls[control].setValue(this.dataEntidadFinanciera["direccion"][control])
        }
      const controlListEntidad=["idSectorFinanciero","codigoSbs"]
      controlListEntidad.forEach(control => {
          if( this.formCalificadora.controls[control]){
            this.formCalificadora.controls[control].setValue(this.dataEntidadFinanciera["entidadFinanciera"][control])
          }
      });
    })

    this.spinner.hide();
     
    }

    setEntidadFinanciera(){
      this.formCalificadora.controls["entidadFinanciera"].setValue({
        razonSocial: this.formCalificadora.value.razonSocial,
        codigoSbs: this.formCalificadora.value.codigoSbs,
        tipoFinanciera: "Casa",
        idSectorFinanciero: this.formCalificadora.value.idSectorFinanciero,
      }) 
    }

    setAddress(){
      this.formCalificadora.controls["direccion"].setValue({
        idPais: this.formCalificadora.value.idPais,
        idProvincia: this.formCalificadora.value.idProvincia,
        idCiudad: this.formCalificadora.value.idCiudad,
        idParroquia: this.formCalificadora.value.idParroquia,
        callePrincipal : this.formCalificadora.value.callePrincipal,
        calleSecundaria : this.formCalificadora.value.calleSecundaria,
        referencia: this.formCalificadora.value.referencia
      }) 
    }

    enabledControls(Controls:string[]){
      this.formCalificadora.disable()
      Controls.forEach(control => {
        this.formCalificadora.controls[control].enable();
      });
    }

    ngAfterViewChecked(): void {
      this.changeDetector.detectChanges();
    }

    enableDirection(value){
      if(value == 1){
        this.esNacional = true;
        this.formCalificadora.controls['idCiudad'].enable()
        this.formCalificadora.controls['idProvincia'].enable()
        this.formCalificadora.controls['idParroquia'].enable()
      }else{
        this.esNacional = false;
        this.formCalificadora.controls['idCiudad'].disable()
        this.formCalificadora.controls['idProvincia'].disable()
        this.formCalificadora.controls['idParroquia'].disable()
      }
    }


    loadPaises() {
      this.dataService.getPaisById(1).subscribe((res: any) => {
        this.paises = [res];   
        this.formCalificadora.controls["idPais"].setValue(res.idPais)   
        this.loadProvincias(); 
      });
    }


    loadProvincias() {
      const idPais=this.formCalificadora.value.idPais
      this.enableDirection(idPais)
      if(idPais){
      this.dataService.getProvincias(idPais).subscribe((res: any) => {
        this.provincias = res;
        this.loadCiudades();
      });
    }
    }

    loadCiudades() {
      const idProvincia=this.formCalificadora.value.idProvincia
      if(idProvincia){
      this.dataService.getCiudades(idProvincia).subscribe((res: any) => {
          this.ciudades = res;
          this.loadParroquia()
        });
      }
    }
    
    loadParroquia() {
      const idCiudad=this.formCalificadora.value.idCiudad
      if(idCiudad){
        this.dataService.getParroquias(idCiudad).subscribe( (parroquias:any) => {
          this.parroquias = parroquias;
        });
      }
    }




    getErrorMessage(element,add_error_messaje?){
      return this.formsService.getErrorMessage(element,add_error_messaje);
    }


    getIDType(){
      this.dataService.getTiposIdentificaciones('ruc').subscribe( (tiposIdentificaciones:any) => {
        this.tiposIdentificaciones = tiposIdentificaciones
         this.formCalificadora.controls["tipoIdentificacion"].setValue(this.tiposIdentificaciones[0]); 
      });
    }
    
    
    filterGetIDType(idTipoIdentificacion){
      let tipoIdentificaciones=this.tiposIdentificaciones.filter(
        (IDType) => IDType.idTipoIdentificacion == idTipoIdentificacion
      )
      if(tipoIdentificaciones.length>0){
        const idTipoIdentificacionform=tipoIdentificaciones[0];
        this.formCalificadora.controls["tipoIdentificacion"].setValue(idTipoIdentificacionform);
      }
    }

    isRUC(){
      return this.formCalificadora.value.tipoIdentificacion.codigoSbs=="R"
    }

    validationIdentification(){
      this.entidadExistente=false;
      const identificacion = this.formCalificadora.value.identificacion.toString();
      const tipo_financiera =this.formCalificadora.value.tipoFinanciera;
      if(this.formCalificadora.value.identificacion && this.formCalificadora.controls["identificacion"].valid && this.formCalificadora.value.identificacion!=this.dataEntidadFinanciera?.identificacion){
        this.inversionesService.validarIdentificacionEntidadFinanciera(tipo_financiera,identificacion).subscribe( (data:any) => {
          let dataEntidad=data["result"];
          if(dataEntidad["entidadFinanciera"]){
            this.getEntidadFinancieraById(dataEntidad["entidadFinanciera"].idEntidad)
          }
        },
        (error) => { 
          this.spinner.hide();
          if(error.error.statusCode=="BadRequest"){
            try{new ToastAlertComponent("error", error.error.message);}finally {/* */}
            this.entidadExistente=true;
            this.formCalificadora.get('identificacion').setErrors({'especificError': error.error.message});
          }
      })
    }
  
    }

    nacional(){
      if(this.isRUC()){
        let ecuadorCountry=this.paises.filter( (pais) => pais.codigoSbs == "EC")
        let idPais=ecuadorCountry[0]["idPais"]
        this.enableDirection(idPais)
        this.formCalificadora.controls["idPais"].setValue(idPais)
        this.loadProvincias();
      }else{
        this.enableDirection(0)
        this.formCalificadora.controls["idPais"].setValue("")
      }
    }

    verifyID() {
      if(this.formCalificadora.value.tipoIdentificacion) this.formCalificadora.controls["idTipoIdentificacion"].setValue(this.formCalificadora.value.tipoIdentificacion.idTipoIdentificacion);
      const identificacion = this.formCalificadora.value.identificacion.toString();
      this.formCalificadora.get('identificacion').setErrors(null);
      this.nacional();
      if(this.isRUC()){
        if (identificacion.length != 13) {
          this.formCalificadora.get('identificacion').setErrors({'especificError': "El ruc debe tener 13 digitos"});
        }
      }else{
        if (identificacion.length > 19) {
          this.formCalificadora.get('identificacion').setErrors({'especificError': "No puede ser mayor a 20"});
      }
    }
    this.validationIdentification();
    }

    getElementErrors() {
      this.formCalificadora.markAllAsTouched();
      for (let value of Object.keys(this.formCalificadora.controls)) {
        let  key=value;
        const controlErrors: ValidationErrors = this.formCalificadora.get(key).errors;
        if (controlErrors != null) {
          let element=document.getElementById(key);
          if(element) element.scrollIntoView({  block: 'center',behavior: 'smooth'  }); 
          return true;
        }
      }
      return false;
    }

    enviarEmisor() {
      if(!this.getElementErrors()){
        if(this.isSend){
        this.setEntidadFinanciera();
        this.setAddress();
        this.isSend=false;  
        this.enviarData.emit(this.formCalificadora.value);
        }
      }else if(this.entidadExistente){
        try{new ToastAlertComponent("error", "Ya existe este tipo de entidad financiera");}finally {/* */}
      }else{ 
        try{new ToastAlertComponent("info", "Debes llenar la información solicitada.");}finally {/* */}
      }
    }

}
