import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ComponentesService } from 'src/app/services/componentes.service';
import { DataService } from 'src/app/services/data.service';
import { FormsService } from 'src/app/services/forms.service';
import { ParticipesService } from '../../participes.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'vex-datos-participe',
  templateUrl: './datos-participe.component.html',
  styleUrls: ['./datos-participe.component.scss']
})
export class DatosParticipeComponent implements OnInit {
  @Input() actualizarDatos:any
  @Input() listados
  datosFormGroup=this.fb.group({
    nombres:["",[Validators.required]],
    apellidos:["",[Validators.required]],
    fechaNacimiento:["",[Validators.required]],
    fechaExpedicionCedula:["",[Validators.required]],
    idGenero:["",[Validators.required]],
    idEstadoCivil:["",[Validators.required]],
    correo1:["",[Validators.required]],
    correo2:[""],
    telefono1:["",[Validators.required]],
    telefono2:[""],
    celular:["",[Validators.required]],
    codigoUniformado:["",[Validators.required]],
    fechaIngreso:["",[Validators.required]],
    idGrado:["",[Validators.required]],
    idNivelEstudios:["",[Validators.required]],
    idProfesion:["",[Validators.required]],
    titulo:["",[Validators.required]],
    conyuge:[""],
    identificacionConyuge:[""]
  });


  existeCedula;
/*   actualizarDatos: PutSolicitud = {
    direcciones: [],
    perfilEconomico: {},
  }; */
  estadosCivil: any = [];
  generos: any = [];
  grados: any = [];
  profesiones: any = [];
  nivelesEstudio: any = [];
  identificacion;
  previusEmail1: String;
  tieneConyuge:boolean=false;
  constructor(  private formsService: FormsService,
    private dataService: DataService,
    private fb: FormBuilder,
    private dataComponente: ComponentesService,
    private changeDetectorRefs: ChangeDetectorRef,
    private participesService: ParticipesService,
    private spinner: NgxSpinnerService,) { }
  

  ngOnInit(): void {
    this.datosFormGroup.patchValue(this.actualizarDatos)
    this.previusEmail1=this.actualizarDatos.correo1; 
    this.datosFormGroup.controls["fechaIngreso"].setValue(this.actualizarDatos.fechaIngreso)
    this.cargarDatosdelParticipe()
  }


  getErrorMessage(element, add_error_messaje?) {
    return this.formsService.getErrorMessage(element, add_error_messaje);
  }

  detectarCambios() {
    this.changeDetectorRefs.detectChanges();
  }



  tieneParticipeConyuge() {
    if (this.estadosCivil != undefined) {
      let arr = Array.from(this.estadosCivil); 
      let codigos = ["H", "U", "C"];
      let idEstadoCivil = this.actualizarDatos.idEstadoCivil;
      let estadoCivil = arr.find(
        (x) => x["idEstadoCivil"] == idEstadoCivil
      ) || { codigoSbs: "" };
      this.tieneConyuge =estadoCivil != undefined && codigos.includes(estadoCivil["codigoSbs"].trim());
    }

  }


  // FUNCIONES DE CLICK EN LOS STEPS (ACTUALIZAR DATOS)b
  async clickActualizar() {

    if (this.actualizarDatos.identificacion && this.datosFormGroup.valid) {
   
      this.verifyEmailsErrors().then((result) => {
        if (!result) {
          this.spinner.show();
          this.dataService.updateDatosParticipe( this.actualizarDatos.idParticipe, this.datosFormGroup.value).subscribe(
              (res) => {
                this.spinner.hide();
                this.dataComponente.alerta(
                  "success",
                  "Datos del participe actualizados"
                );
              },
              (error) => {
                this.spinner.hide();
                this.dataComponente.errorHandler(error);
              }
            );
        }
      });
    } else {
      this.dataComponente.alerta(
        "info",
        "Debes completar los campos solicitados"
      );
    }
  }

  async verifyEmailsErrors(): Promise<boolean> {
    this.datosFormGroup.get("correo1").markAsTouched();
    this.datosFormGroup.get("correo2").markAsTouched();
    if (this.datosFormGroup.value["correo1"] == this.datosFormGroup.value["correo2"]) {
      this.dataComponente.alerta("info", "El correo no debe repetirse");
      this.datosFormGroup.get("correo2").setErrors({duplicateEmail: { message: "El correo no debe repetirse" }});
      return true;
    } else {
      this.datosFormGroup.get("correo2").setErrors(null);
      if (this.datosFormGroup.value["correo1"] && this.previusEmail1 != this.datosFormGroup.value["correo1"]) {
        return this.getVerifyEmail("correo1");
      }
    }
  }


  getVerifyEmail(emailFormControl: string) {
    const email = new Promise<string>((resolve, reject) => {
      this.participesService
        .getVerifyEmail(this.datosFormGroup.value[emailFormControl])
        .subscribe(
          (res) => {
            this.spinner.hide();

            this.datosFormGroup.get("correo1").setErrors({
              duplicateEmail: {message: "Ya existe un registro con ese correo"},
            });
           
            this.dataComponente.alerta(
              "info",
              "Ya existe un registro con ese correo: " +
                this.datosFormGroup.value[emailFormControl]
            );
            resolve("true");
          },
          (error) => {
            this.spinner.hide();
            resolve("false");
          }
        );
    });
    return email.then((value) => {
      return value == "true";
    });
  }

 
  cargarDatosdelParticipe() {

    // TIPOS DE GENERO
    this.dataService.getTiposGenero().subscribe((res) => { this.generos = res;});

     // GRADOS
     this.dataService.getGrado().subscribe( (grado) => { this.grados = grado; });

    //PROFESION
    this.dataService.getProfesiones().subscribe((profesion) => {this.profesiones = profesion; });

    //Niveles Estudio
    this.dataService.getNivelEstudio().subscribe( (nivelEstudio) => { this.nivelesEstudio = nivelEstudio; }, );

     // ESTADOS CIVILES
     this.dataService.getEstadosCivil().subscribe((res) => {  this.estadosCivil = res;    this.tieneParticipeConyuge()});
  }

 




}
