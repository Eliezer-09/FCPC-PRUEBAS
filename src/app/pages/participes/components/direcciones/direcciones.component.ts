import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ParticipesService } from '../../participes.service';
import { ComponentesService } from 'src/app/services/componentes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/services/data.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { iconify } from 'src/static-data/icons';
import { Sectores } from 'src/@vex/interfaces/enums';
import { FormsService } from 'src/app/services/forms.service';

@Component({
  selector: 'vex-direcciones',
  templateUrl: './direcciones.component.html',
  styleUrls: ['./direcciones.component.scss']
})
export class DireccionesComponent implements OnInit {
  step = 0;
  direcciones:any =[];
  provincias: any = [];
  tiposDireccion = [];
  @Input() idParticipe;
  icroundAdd          =iconify.icroundAdd;
  icroundDelete=iconify.icroundDelete
  datosDireccion: FormGroup;



  constructor( private fb: FormBuilder,
    private participesService: ParticipesService,
    private dataComponente: ComponentesService,
    private spinner: NgxSpinnerService,
    private dataService: DataService,
    public dialog: MatDialog,
    private formsService:  FormsService) {

      this.datosDireccion=this.fb.group({
        idDireccion:["",[Validators.required]],
        tipoDireccion:["",[Validators.required]],
        callePrincipal:["",[Validators.required]],
        calleSecundaria:["",[Validators.required]],
        referencia:[""],
        idPais:["1",[Validators.required]],
        idProvincia:["",[Validators.required]],
        idCanton:["",[Validators.required]],
        idParroquia:["",[Validators.required]],
        idTipoDireccion:["",[Validators.required]],
        sector:[""],
        esPrincipal:["",[Validators.required]],
      });
     }

  ngOnInit(): void {
    this.getProvincias()
    this.Direcciones(this.idParticipe);
    this.getTipoDireccion();
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  getProvincias(){
    //Ecuador
    this.dataService.getProvincias(1).subscribe((prov) => {
      this.provincias = prov;
    });
  }

  seleccionarCuidad(event,index) {
      // Parroquias
      this.dataService.getParroquias(event).subscribe((parroquias: any) => {
        this.datosDireccion.controls["parroquias"+index].setValue(parroquias)
      });
    }

    Direcciones(idParticipe) {
        this.participesService.getDireccionParticipe(idParticipe).subscribe( (direcciones) => {
          this.direcciones = direcciones["result"];  
          this. buildDirecciones( this.direcciones) },
        );
    }

  getTipoDireccion() {
      this.dataService.getTipoDireccion().subscribe( (tipoDireccion) => {this.tiposDireccion = tipoDireccion["result"]; 
     },
      );
  }

  actualizarDireccion(index){
    let direccion=this.getDirecciones(index);
    let datosDireccion=this.fb.group({
      idDireccion:["",[Validators.required]],
      tipoDireccion:["",[Validators.required]],
      callePrincipal:["",[Validators.required]],
      calleSecundaria:["",[Validators.required]],
      referencia:[""],
      idPais:["1",[Validators.required]],
      idProvincia:["",[Validators.required]],
      idCanton:["",[Validators.required]],
      idParroquia:["",[Validators.required]],
      idTipoDireccion:["",[Validators.required]],
      sector:[""],
      esPrincipal:["",[Validators.required]],
    });
    datosDireccion.patchValue(direccion)
    if(datosDireccion.valid){
      this.spinner.show();
      this.participesService.putDireccionParticipe(this.idParticipe,direccion.idDireccion, direccion) .subscribe(
        (res) => {
          this.dataComponente.alerta("success", "Dirección Actualizada.")
          this.Direcciones(this.idParticipe);

        },
        (error) => {
          this.spinner.hide();
          this.dataComponente.errorHandler(error);
        }
      );
    }else{
      this.dataComponente.alerta(
        "info",
        "Debes completar los campos solicitados"
      );
     }
    
  }
  
  getDirecciones(i){
    return {
      idDireccion: this.datosDireccion.value['idDireccion'+i],
      tipoDireccion:this.datosDireccion.value['tipoDireccion'+i],
      callePrincipal:this.datosDireccion.value['callePrincipal'+i],
      calleSecundaria:this.datosDireccion.value['calleSecundaria'+i],
      referencia:this.datosDireccion.value['referencia'+i],
      idPais:"1", //ecuador
      idProvincia:this.datosDireccion.value['idProvincia'+i],
      idCanton:this.datosDireccion.value['idCanton'+i],
      idParroquia:this.datosDireccion.value['idParroquia'+i],
      idTipoDireccion:this.datosDireccion.value['idTipoDireccion'+i],
      esPrincipal:this.datosDireccion.value['esPrincipal'+i]
    }
  }

  buildDirecciones(direcciones){
    let datosDireccion=this.fb.group({
      idDireccion:["",[Validators.required]],
      tipoDireccion:["",[Validators.required]],
      callePrincipal:["",[Validators.required]],
      calleSecundaria:["",[Validators.required]],
      referencia:[""],
      idPais:["1",[Validators.required]],
      idProvincia:["",[Validators.required]],
      idCanton:["",[Validators.required]],
      idParroquia:["",[Validators.required]],
      idTipoDireccion:["",[Validators.required]],
      sector:[""],
      esPrincipal:["",[Validators.required]],
    });
    let index=0;
    direcciones.forEach(direc => {
      let esPrincipal="esPrincipal"+index;
      let tipoDireccion="tipoDireccion"+index;
      let callePrincipal="callePrincipal"+index;
      let calleSecundaria="calleSecundaria"+index;
      let referencia="referencia"+index;
      let idProvincia="idProvincia"+index;
      let idCanton="idCanton"+index;
      let idParroquia="idParroquia"+index;
      let ciudades="ciudades"+index;
      let parroquias="parroquias"+index;
      let idDireccion="idDireccion"+index;
      let idTipoDireccion="idTipoDireccion"+index;

      
      this.datosDireccion.addControl(idDireccion, new FormControl(direc.idDireccion, [Validators.required]));
      this.datosDireccion.addControl(esPrincipal, new FormControl(direc.esPrincipal, [Validators.required]));
      this.datosDireccion.addControl(tipoDireccion, new FormControl(direc.tipoDireccion, [Validators.required]));
      this.datosDireccion.addControl(callePrincipal, new FormControl(direc.callePrincipal, [Validators.required]));
      this.datosDireccion.addControl(calleSecundaria, new FormControl(direc.calleSecundaria, [Validators.required]));
      this.datosDireccion.addControl(referencia, new FormControl(direc.referencia));
      this.datosDireccion.addControl(idTipoDireccion, new FormControl(direc.idTipoDireccion, [Validators.required]));
      this.datosDireccion.addControl(idProvincia, new FormControl(direc.idProvincia, [Validators.required]));
      this.datosDireccion.addControl(idCanton, new FormControl(direc.idCanton, [Validators.required]));
      this.datosDireccion.addControl(idParroquia, new FormControl(direc.idParroquia, [Validators.required]));
      this.datosDireccion.addControl(ciudades, new FormControl([], [Validators.required]));
      this.datosDireccion.addControl(parroquias, new FormControl([], [Validators.required]));

     /*  let tipoDireccionData=this.Datos.direcciones.tiposDireccion
      let indexTipoDirec=this.tiposDireccion.findIndex(element=>element==tipoDireccionData)
      if(indexTipoDirec==-1) this.datosDireccion.controls["tipoDireccion"+index].setValue("Casa") */
      this.cargarDatosdelParticipe(direc,index)
      index+=1;
     
    });
    this.spinner.hide();
  }


  selectedTipoDirieccion(tipoDireccion,i){
    this.datosDireccion.controls["tipoDireccion"+i].setValue(tipoDireccion.descripcion) 
    this.datosDireccion.controls["idTipoDireccion"+i].setValue(tipoDireccion.idTipoDireccion)
    if(tipoDireccion.descripcion.toLowerCase().includes("principal")){
      this.datosDireccion.controls["esPrincipal"+i].setValue(true)
    }else{
      this.datosDireccion.controls["esPrincipal"+i].setValue(false)
    }   
  }

  
  cargarDatosdelParticipe(direccion,index) {
    // CIUDADES
    this.dataService.getCiudades(direccion.idProvincia).subscribe((ciudad) => {
      /* this.ciudades = ciudad; */
      this.datosDireccion.controls["ciudades"+index].setValue(ciudad)
    });

    //PARROQUIA

    this.dataService.getParroquias(direccion.idCanton).subscribe((parroquias: any) => {
  /*     this.parroquias = parroquias; */
      this.datosDireccion.controls["parroquias"+index].setValue(parroquias)
    });

  
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AgregarDireccionesComponent, {
      data: {idParticipe: this.idParticipe, provincias:this.provincias, tiposDireccion:this.tiposDireccion},
      width:"80%"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.Direcciones(this.idParticipe);
      }

    });
  }

  eliminarDireccion(direccion){
    if(this.datosDireccion.valid ){
      if(!direccion.esPrincipal){
        this.spinner.show();
        this.participesService.deleteDireccionParticipe(this.idParticipe, direccion.idDireccion) .subscribe(
          (res) => {
            this.dataComponente.alerta("success", "Dirección Eliminada.")
            this.Direcciones(this.idParticipe);
          },
          (error) => {
            this.spinner.hide();
            this.dataComponente.errorHandler(error);
          }
        );
  
     }else{
      this.dataComponente.alerta(
        "error",
        "No puedes eliminar la dirección principal"
      );
     }
    }else{
      this.dataComponente.alerta(
        "error",
        "No puedes eliminar la dirección"
      );   
    }

}

getErrorMessage(element,add_error_messaje?){
  return this.formsService.getErrorMessage(element,add_error_messaje);
}

}


@Component({
  selector: 'vex-agregar-direcciones',
  templateUrl: './agregar-direcciones.component.html',
  styleUrls: ['./direcciones.component.scss']
})
export class AgregarDireccionesComponent  {
  tiposDireccion = [];
  provincias: any = [];
  parroquias: any = [];
  ciudades: any = [];
  sectores:any=[ Sectores.Norte,
                  Sectores.Sur,
                  Sectores.Este,
                  Sectores.Oeste,
                  Sectores.Centro,
                  Sectores.Noreste,
                  Sectores.Noreste,
                  Sectores.Sureste,
                  Sectores.Suroeste
                ];
  icroundClose = iconify.icroundClose;
  datosDireccion=this.fb.group({
    tipoDireccion:["",[Validators.required]],
    callePrincipal:["",[Validators.required]],
    calleSecundaria:["",[Validators.required]],
    referencia:[""],
    idPais:["1",[Validators.required]],
    idProvincia:["",[Validators.required]],
    idCanton:["",[Validators.required]],
    idParroquia:["",[Validators.required]],
    idTipoDireccion:["",[Validators.required]],
    sector:[""],
    esPrincipal:[false,[Validators.required]],
  });

  constructor(
    public dialogRef: MatDialogRef<AgregarDireccionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private participesService: ParticipesService,
    private dataComponente: ComponentesService,
    private spinner: NgxSpinnerService,
    private dataService: DataService,
    private formsService:  FormsService
  ) {
    this.provincias=this.data["provincias"]
    this.tiposDireccion=this.data["tiposDireccion"]
     if(this.tiposDireccion.length==0)  this.getTipoDireccion(); }

  onNoClick(): void {
    this.dialogRef.close();
  }

  seleccionarCuidad(event) {
    // Parroquias
    this.dataService.getParroquias(event).subscribe((parroquias: any) => {
      this.parroquias=parroquias
    });
  }

   seleccionarProvincia(event) {
    // ciudades
    this.dataService.getCiudades(event).subscribe( (ciudad) => {this.ciudades = ciudad;  },
    );
  }
  getTipoDireccion() {
    this.dataService.getTipoDireccion().subscribe( (tipoDireccion) => {this.tiposDireccion = tipoDireccion["result"];  },
    );
}

selectedTipoDirieccion(tipoDireccion){
  this.datosDireccion.controls["tipoDireccion"].setValue(tipoDireccion.descripcion) 
  this.datosDireccion.controls["idTipoDireccion"].setValue(tipoDireccion.idTipoDireccion)
  this.asignarPrincipal(tipoDireccion.descripcion)
}

asignarPrincipal(tipoDireccion){
  if(tipoDireccion.toLowerCase().includes("principal")){
    this.datosDireccion.controls["esPrincipal"].setValue(true)
  }else{
    this.datosDireccion.controls["esPrincipal"].setValue(false)
  }   
}

  saveDireccion(){

   if(this.datosDireccion.valid){
    this.spinner.show();
    this.participesService.postDireccionParticipe(this.data["idParticipe"], this.datosDireccion.value) .subscribe(
      (res) => {
        this.spinner.hide();
        this.dialogRef.close(true)
      },
      (error) => {
        this.spinner.hide();
        this.dataComponente.errorHandler(error);
      }
    );
   }else{
    this.dataComponente.alerta(
      "info",
      "Debes completar los campos solicitados"
    );
   }
    
  }


  getErrorMessage(element,add_error_messaje?){
    return this.formsService.getErrorMessage(element,add_error_messaje);
  }
  

}