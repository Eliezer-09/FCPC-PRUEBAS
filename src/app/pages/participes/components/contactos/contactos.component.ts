import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ParticipesService } from '../../participes.service';
import { ComponentesService } from 'src/app/services/componentes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/services/data.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { iconify } from 'src/static-data/icons';
import { Sectores } from 'src/@vex/interfaces/enums';
import { FormsService } from 'src/app/services/forms.service';

@Component({
  selector: 'vex-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.scss']
})
export class ContactosComponent implements OnInit {
  step = 0;
  contactos:any =[];
  provincias: any = [];
  tiposDireccion = [];
  @Input() idParticipe;
  icroundAdd          =iconify.icroundAdd;
  icroundDelete=iconify.icroundDelete
  datosContacto=this.fb.group({
    nombre:["",[Validators.required]],
    telefono:["",[Validators.pattern(this.formsService.expTelefono)]],
    correo:["",[Validators.pattern(this.formsService.expEmail)]],
    celular:["",[Validators.pattern(this.formsService.expTelefono)]],
    emergencia:[false,[Validators.required]],
    idParentesco:["",[Validators.required]],
  });
  parentescos: any = [];
  emergencia=[{label:"Sí",valor:true},{label:"No", valor:false}]


  constructor( private fb: FormBuilder,
    private participesService: ParticipesService,
    private dataComponente: ComponentesService,
    private spinner: NgxSpinnerService,
    private dataService: DataService,
    public dialog: MatDialog,
    private formsService:  FormsService,) { }

  ngOnInit(): void {
    this.loadPrentesco()
    this.Contactos(this.idParticipe);
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



  Contactos(idParticipe) {
        this.participesService.getContactoParticipe(idParticipe).subscribe( (contacto) => {
          this.contactos = contacto["result"];  
          this.buildContacto( this.contactos) },
        );
    }


  actualizarContactos(index){
    let contacto=this.getContacto(index);
    let datosContacto=this.fb.group({
      nombre:["",[Validators.required]],
      telefono:["",[Validators.pattern(this.formsService.expTelefono)]],
      correo:["",[Validators.pattern(this.formsService.expEmail)]],
      celular:["",[Validators.pattern(this.formsService.expTelefono)]],
      emergencia:[false,[Validators.required]],
      idParentesco:["",[Validators.required]]
    });
    datosContacto.patchValue(contacto)
    if(datosContacto.valid){
      this.spinner.show();
      this.participesService.putContactoParticipe(this.idParticipe,contacto.idContacto, contacto) .subscribe(
        (res) => {
          this.dataComponente.alerta("success", "Contacto Actualizado.")
          this.Contactos(this.idParticipe);

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
  
  getContacto(i){
    return {
      idContacto: this.datosContacto.value['idContacto'+i],
      nombre:this.datosContacto.value['nombre'+i],
      telefono:this.datosContacto.value['telefono'+i],
      correo:this.datosContacto.value['correo'+i],
      celular:this.datosContacto.value['celular'+i],
      emergencia:this.datosContacto.value['emergencia'+i],
      idParentesco:this.datosContacto.value['idParentesco'+i],
    }
  }

  buildContacto(contactos){
    this.datosContacto=this.fb.group({})
    let index=0;
    contactos.forEach(contacto => {
      let idContacto="idContacto"+index;
      let nombre="nombre"+index;
      let telefono="telefono"+index;
      let correo="correo"+index;
      let celular="celular"+index;
      let emergencia="emergencia"+index;
      let idParentesco="idParentesco"+index;
      this.idParticipe
      
      this.datosContacto.addControl(idContacto, new FormControl(contacto.idContacto, [Validators.required]));
      this.datosContacto.addControl(nombre, new FormControl(contacto.nombre, [Validators.required]));
      this.datosContacto.addControl(telefono, new FormControl(contacto.telefono, [Validators.pattern(this.formsService.expTelefono)]));
      this.datosContacto.addControl(correo, new FormControl(contacto.correo, [Validators.pattern(this.formsService.expEmail)]));
      this.datosContacto.addControl(celular, new FormControl(contacto.celular, [Validators.pattern(this.formsService.expTelefono)]));
      this.datosContacto.addControl(emergencia, new FormControl(contacto.emergencia,[Validators.required]));
      this.datosContacto.addControl(idParentesco, new FormControl(contacto.idParentesco,[Validators.required]));
      
      index+=1;

    });
    this.spinner.hide();
  }

  

  openDialog(): void {
    const dialogRef = this.dialog.open(AgregarContactosComponent, {
      data: {idParticipe: this.idParticipe},
      width:"80%"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.Contactos(this.idParticipe);
      }

    });
  }

  eliminarContacto(contacto){
    if(this.datosContacto.valid ){
        this.spinner.show();
        this.participesService.deleteContactoParticipe(this.idParticipe, contacto.idContacto) .subscribe(
          (res) => {
            this.dataComponente.alerta("success", "Contacto Eliminado.")
            this.Contactos(this.idParticipe);
          },
          (error) => {
            this.spinner.hide();
            this.dataComponente.errorHandler(error);
          }
        );
  
    }else{
      this.dataComponente.alerta(
        "error",
        "No puedes eliminar el contacto"
      );   
    }

}


getErrorMessage(element,add_error_messaje?){
  return this.formsService.getErrorMessage(element,add_error_messaje);
}


loadPrentesco(){
  this.dataService.getParentesco().subscribe(
    (res) => {
      this.spinner.hide();
      this.parentescos=res;
    },
    (error) => {
      this.spinner.hide();
      this.dataComponente.errorHandler(error);
    }
  );
 }



}


@Component({
  selector: 'vex-agregar-contactos',
  templateUrl: './agregar-contactos.component.html',
  styleUrls: ['./contactos.component.scss']
})
export class AgregarContactosComponent  {

  icroundClose = iconify.icroundClose;
  datosContacto=this.fb.group({
    nombre:["",[Validators.required]],
    telefono:["",[Validators.pattern(this.formsService.expTelefono)]],
    correo:["",[Validators.pattern(this.formsService.expEmail)]],
    celular:["",[Validators.pattern(this.formsService.expTelefono)]],
    emergencia:[false,[Validators.required]],
    idParentesco:["",[Validators.required]]
  });
  parentescos: any = [];
emergencia=[{label:"Sí",valor:true},{label:"No", valor:false}]
  constructor(
    public dialogRef: MatDialogRef<AgregarContactosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private participesService: ParticipesService,
    private dataComponente: ComponentesService,
    private spinner: NgxSpinnerService,
    private formsService:  FormsService,
    private dataService:  DataService
  ) {
    this. loadPrentesco()
   }

  onNoClick(): void {
    this.dialogRef.close();
  }

 loadPrentesco(){
  this.dataService.getParentesco().subscribe(
    (res) => {
      this.spinner.hide();
      this.parentescos=res
    },
    (error) => {
      this.spinner.hide();
      this.dataComponente.errorHandler(error);
    }
  );
 }

  saveContacto(){

   if(this.datosContacto.valid){
    this.spinner.show();
    this.participesService.postContactoParticipe(this.data["idParticipe"], this.datosContacto.value) .subscribe(
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