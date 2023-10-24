import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from "@angular/material/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatStepper } from "@angular/material/stepper";
import moment from "moment";

import { DataService } from "src/app/services/data.service";
import { iconify } from "src/static-data/icons";
import {
  AdjuntosColaborador,
  FormacionAcademica,
} from "../../../models/colaboradores";
import { ColaboradorService } from "../../../services/colaborador.service";
import { MY_FORMATS } from "../../../utils/my-date-form";
import { UtilsService } from "../../../utils/utils.service";
import { TTHHColaboradorService } from "../../../services/tthh-colaborador.service";

@Component({
  selector: "vex-modal-formacion-academica",
  templateUrl: "./modal-formacion-academica.component.html",
  styleUrls: ["./modal-formacion-academica.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ModalFormacionAcademicaComponent {
  @Input() adjuntosColaborador: AdjuntosColaborador[];
  @ViewChild("stepper", { static: false }) stepper: MatStepper;
  icroundClose = iconify.icroundClose;
  envioEnProgreso = false;
  formFormacionAcademica: FormGroup;
  idColaborador: any;
  tipoColaborador: any;
  adjuntosPlantilla: any[];
  tiposCurso: any[];
  dataSelect: any;
  loading: boolean;
  idEntidad:any;
  constructor(
    private _formBuilder: FormBuilder,
    private colaboradorService: ColaboradorService,
    private utilsService: UtilsService,
    private dataService: DataService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ModalFormacionAcademicaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FormacionAcademica,
    private tthhColaboradorService: TTHHColaboradorService,
  ) {}

  nivelesEstudio: any = [];
  idFormacionAcademica: number;
  tipo: string;

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {
    this.cargarSelects();
    this.formFormacionAcademica = this._formBuilder.group({
      idFormacionAcademica: new FormControl(this.data.idFormacionAcademica),
      idNivelEstudios: new FormControl(
        this.data.idNivelEstudios,
        Validators.required
      ),
      institucionEducativa: new FormControl(
        this.data.institucionEducativa,
        Validators.required
      ),
      titulo: new FormControl(this.data.titulo, Validators.required),
      fechaInicio: new FormControl(this.data.fechaInicio, Validators.required),
      fechaCulminacion: new FormControl(
        this.data.fechaCulminacion,
        Validators.required
      ),
      cursandoActualmente: new FormControl(
        this.data.cursandoActualmente,
        Validators.required
      ),
      isCurso: new FormControl(this.data.isCurso),
      anioCursando: new FormControl(this.data.anioCursando),
      idCertificacion: new FormControl(this.data.idCertificacion),
      adjunto: new FormControl(""),
      tiempoCurso: new FormControl(this.data.tiempoCurso, [
        //solo numeros enteros
        Validators.pattern("^[0-9]*$"),
        //maximo 5 digitos
        Validators.max(99999),
      ]),
    });
    this.idEntidad=this.data.idEntidad;

    this.cambiarValidacion();

    if (this.data.idFormacionAcademica) {
      this.idFormacionAcademica = this.data.idFormacionAcademica;
    }
    //tiempoCurso

    this.idColaborador = this.data.idColaborador;

    this.tipo = this.data.tipo;
    this.tipoColaborador = this.data.tipoColaborador;
    this.dataSelect = this.data.dataSelect;

    this.getAdjunto(this.idEntidad, this.tipoColaborador);

    //disable idCertificacion
    if (this.tipo != "certificado") {
      this.formFormacionAcademica.get("idCertificacion").disable();
    } else {
      this.formFormacionAcademica.get("idCertificacion").enable();
    }

    if (this.tipo == "certificado") {
      this.modificarCampos();
    }

    //touched  cursandoActualmente
    this.formFormacionAcademica.get("cursandoActualmente").touched;
  }


  modificarCampos() {
    this.formFormacionAcademica.get("idNivelEstudios").setValue(10);
    this.formFormacionAcademica.get("isCurso").setValue(true);
    this.formFormacionAcademica
      .get("institucionEducativa")
      .setValue("certificado");
  }

  validarFecha() {
    let fechaInicio = moment(
      this.formFormacionAcademica.get("fechaInicio").value
    );
    let fechaCulminacion = moment(
      this.formFormacionAcademica.get("fechaCulminacion").value
    );
    if (fechaInicio > fechaCulminacion) {
      this.formFormacionAcademica
        .get("fechaCulminacion")
        .setErrors({ incorrect: true });
    } else {
      this.formFormacionAcademica
        .get("fechaCulminacion")
        .updateValueAndValidity();
    }
  }

  verificarPreGUardar(data: FormacionAcademica) {
    let id9 = this.dataSelect?.filter(
      (x) => x.idNivelEstudios == 10 && x.titulo == "Sin especificar"
    )[0];

    if (id9) {
      if (
        data.idNivelEstudios != 10 &&
        data.isCurso == null &&
        !data.cursandoActualmente
      ) {
        if (id9.idFormacionAcademica) {
          this.tthhColaboradorService
            .deleteFormacionAcademica(
              this.idColaborador,
              id9.idFormacionAcademica
            )
            .subscribe(
              (res) => {
                this.colaboradorService.changeMessage("getFormacionAcademica");
              },
              (err) => {}
            );
        }
      }
    }
  }
  cambiarValidacion() {
    if (this.formFormacionAcademica.get("cursandoActualmente").value) {
      this.formFormacionAcademica.get("fechaCulminacion").disable();
    } else {
      this.formFormacionAcademica.get("fechaCulminacion").enable();
    }
  }

  
  NoAplica(){
    //nivel no plica
    return 
  }

  idNoAplica:number;
  cargarSelects() {
    this.dataService.getNivelEstudio().subscribe(
      (data) => {
        this.nivelesEstudio = data;
        let noAplica=this.nivelesEstudio.filter((nivel)=>nivel.codigoSbs=="0014")
        if(noAplica.lenght>0) this.idNoAplica=noAplica[0].idNivelEstudios;
        //quitar el ultimo
        this.nivelesEstudio.pop();
      },
      (error) => {
        this.utilsService.alerta("error", "Error al cargar niveles de estudio");
      }
    );

    this.tthhColaboradorService.getCertificados().subscribe(
      (data) => {
        this.tiposCurso = data.result;
      },
      (error) => {
        this.utilsService.alerta("error", "Error al cargar las capacitaciones");
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getAdjunto(idEntidad, idTipoColaborador) {
    this.loading = true;
    this.tthhColaboradorService
      .getAdjuntos(idEntidad, idTipoColaborador)
      .subscribe(
        (res) => {
          //* obtengo la plantilla de adjuntos para formacion academica

          const adjunto = res.result.filter(
            (x) => x.nombreSeccion.includes("FORMACION ACADÉMICA")
          );
          console.log(adjunto)
 
            const dataAdjunto=
           [{idEntidad:this.idEntidad,
              idTipoAdjunto:adjunto[0].idTipoAdjunto
            }]
          this.dataService.getInfoAdjunto(dataAdjunto).subscribe(res=>{
            const dataAdjunto=res["result"]
            
            const adjuntoidFormacionAcademica = dataAdjunto.filter(
              (x) => x.idFormacionAcademica == this.idFormacionAcademica 
            );
            
            if(this.idFormacionAcademica && adjuntoidFormacionAcademica.length>0 ){
              adjunto[0]["nombreAdjunto"]=adjuntoidFormacionAcademica[0].nombreAdjunto
              adjunto[0]["archivos"]=adjuntoidFormacionAcademica
              this.adjuntosColaborador=adjunto
              this.loading = false;
            }else{
              adjunto[0]["nombreAdjunto"]=dataAdjunto[0].nombreAdjunto
              adjunto[0]["archivos"]=[]
              this.adjuntosColaborador=adjunto
              this.loading = false;
            }
           
            }) 

/*           if (this.idFormacionAcademica) {
            //recorrer adjuntosColaborar y traer solo los que tengan el idTipoAdjunto 87 y que tengan el idAdjunto dentro de archivos igual a idFormacionAcademica
            this.adjuntosColaborador = res.result.filter(
              (x) => x.idTipoAdjunto == 86
            );

            this.adjuntosColaborador.forEach((element) => {
              element.archivos = element.archivos.filter(
                (x) => x.idFormacionAcademica == this.idFormacionAcademica
              );
            });
          } else {
            this.adjuntosColaborador = res.result.filter(
              (x) => x.idTipoAdjunto == 86
            );

            this.adjuntosColaborador.forEach((element) => {
              element.archivos = [];
            });
          }
          this.loading = false; */
        },
        (error) => {
          this.utilsService.alerta("error", "Error al cargar los adjuntos");
          this.loading = false;
        }
      );
  }

  actualizarFormacionAcademica(form, idColaborador, idFormacionAcademica) {
    if (!this.formFormacionAcademica.dirty) {
      this.stepper.next();
      return;
    }

    const sure = form.isCurso ? "Capacitación" : "Educación Formal";
    this.utilsService
      .confirmar(
        "Actualizar " + sure,
        "¿Está seguro que desea actualizar la " + sure.toLowerCase() + "?"
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.verificarPreGUardar(this.formFormacionAcademica.value);

          this.tthhColaboradorService
            .updateFormacionAcademica(form, idColaborador, idFormacionAcademica)
            .subscribe(
              (res) => {
                this.utilsService.alerta(
                  "success",
                  form.isCurso
                    ? "Capacitación actualizado correctamente"
                    : "Educación Formal actualizada correctamente"
                );

                this.idFormacionAcademica = res.result.idFormacionAcademica;

                this.colaboradorService.changeMessage("getFormacionAcademica");

                /*   if (
                  this.formFormacionAcademica.get("idNivelEstudios").value == 9
                ) {
                  //cerrar dialog
                  this.dialogRef.close();
                } */

                this.stepper.next();
              },
              (err) => {
                this.utilsService.alerta(
                  "error",
                  form.isCurso
                    ? "Error al actualizar el curso"
                    : "Error al actualizar la formación académica"
                );
              }
            );
        }
      });
  }

  guardarFormacionAcademica() {
    if (!this.envioEnProgreso) {
      this.envioEnProgreso = true;
      if (this.data.visualizationMode) {
        this.stepper.next();
      } else {
        if (this.formFormacionAcademica.get("idFormacionAcademica").value) {
          this.actualizarFormacionAcademica(
            this.formFormacionAcademica.value,
            this.idColaborador,
            this.formFormacionAcademica.get("idFormacionAcademica").value
          );
        } else {
          this.verificarPreGUardar(this.formFormacionAcademica.value);
          this.tthhColaboradorService
            .postFormacionAcademica(
              this.formFormacionAcademica.value,
              this.idColaborador
            )
            .subscribe(
              (res) => {
                this.utilsService.alerta(
                  "success",
                  this.formFormacionAcademica.value.isCurso
                    ? "Curso agregado exitosamente"
                    : "Educación Formal agregada exitosamente"
                );
  
                this.idFormacionAcademica = res.result.idFormacionAcademica;
                this.formFormacionAcademica
                  .get("idFormacionAcademica")
                  .setValue(this.idFormacionAcademica);
  
                this.colaboradorService.changeMessage("getFormacionAcademica");
  
                this.stepper.next();
              },
              (err) => {
                this.utilsService.alerta(
                  "error",
                  this.formFormacionAcademica.value.isCurso
                    ? "Error al agregar el curso"
                    : "Error al agregar la formación académica"
                );
              }
            )
            .add(() => {
              this.envioEnProgreso = false;
            });
        }
      }
    }
  }
  
  

  noAplica(value) {
    if (value ==  this.idNoAplica) {
      //asignar valores en blanco
      this.formFormacionAcademica
        .get("institucionEducativa")
        .setValue("Sin especificar");
      this.formFormacionAcademica.get("titulo").setValue("Sin especificar");

      //poner una fecha especifica

      let fechaHoy = new Date();
      this.formFormacionAcademica.get("fechaInicio").setValue(fechaHoy);

      //poner fecha actual + un dia
      let fechaMas = new Date();
      fechaMas.setDate(fechaMas.getDate() + 1);
      this.formFormacionAcademica.get("fechaCulminacion").setValue(fechaMas);

      this.formFormacionAcademica.get("cursandoActualmente").setValue(false);
    }
  }
}
