import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import icDescription from "@iconify/icons-ic/twotone-description";
import { MatDialog } from "@angular/material/dialog";

import { ColaboradorService } from "../../services/colaborador.service";
import { DatosContactosColaboradorComponent } from "./components/datos-contactos-colaborador/datos-contactos-colaborador.component";
import { ActivatedRoute, Router } from "@angular/router";
import { DireccionComponent } from "./components/direccion/direccion.component";
import { DatosReferenciaPersonalColaboradorComponent } from "./components/datos-referencia-personal-colaborador/datos-referencia-personal-colaborador.component";
import { DatosReferenciaBancariaColaboradorComponent } from "./components/datos-referencia-bancaria-colaborador/datos-referencia-bancaria-colaborador.component";
import { DatosTransporteColaboradorComponent } from "./components/datos-transporte-colaborador/datos-transporte-colaborador.component";
import { DatosCargasFamiliaresColaboradorComponent } from "./components/datos-cargas-familiares-colaborador/datos-cargas-familiares-colaborador.component";
import { FormacionAcademicaColaboradorComponent } from "./components/formacion-academica-colaborador/formacion-academica-colaborador.component";
import { NgxSpinnerService } from "ngx-spinner";

import {
  ColaboradorPersona,
  AdjuntosColaborador,
} from "../../models/colaboradores";
import { DatosPersonalesColaboradorComponent } from "./components/datos-personales-colaborador/datos-personales-colaborador.component";

import { MatStepper } from "@angular/material/stepper";
import { UtilsService } from "../../utils/utils.service";
import { TTHHColaboradorService } from "../../services/tthh-colaborador.service";
import { DataService } from "src/app/services/data.service";

@Component({
  selector: "vex-agregar-colaborador",
  templateUrl: "./agregar-colaborador.component.html",
  styleUrls: ["./agregar-colaborador.component.scss"],
})
export class AgregarColaboradorComponent
  implements OnInit, AfterViewChecked, AfterViewInit
{
  //referencias a hijos para poder utilizar sus métodos
  @ViewChild("datosContactoComponent")
  datosContactoComponent: DatosContactosColaboradorComponent;

  @ViewChild("datosDireccionComponent")
  datosDireccionComponent: DireccionComponent;

  @ViewChild("datosPersonalesComponent")
  datosPersonalesComponent: DatosPersonalesColaboradorComponent;

  @ViewChild("datosTransporteComponent")
  datosTransporteComponent: DatosTransporteColaboradorComponent;

  @ViewChild("cargasFamiliaresComponent")
  cargasFamiliaresComponent: DatosCargasFamiliaresColaboradorComponent;

  @ViewChild("datosFormacionAcademicaComponent")
  datosFormacionAcademicaComponent: FormacionAcademicaColaboradorComponent;

  @ViewChild("datosReferenciaPersonalComponent")
  datosReferenciaPersonalComponent: DatosReferenciaPersonalColaboradorComponent;

  @ViewChild("datosReferenciaBancariaComponent")
  datosReferenciaBancariaComponent: DatosReferenciaBancariaColaboradorComponent;

  tipoAdd;
  linear: boolean = true;

  datosPersolesError = new FormControl("");
  datosGuardarContactoError = new FormControl("");
  datosFormacionAcademicaError = new FormControl("");
  datosProcesoSeleccionError = new FormControl("");
  datosHistorialLaboralError = new FormControl("");
  datosReferenciaBancariaError = new FormControl("");

  datosContratoError = new FormControl("");
  //variables compartidas
  tipoColaborador: number = 1;
  idColaborador: number;
  idEntidad: number;
  colaborador: ColaboradorPersona;
  adjuntosColaborador: AdjuntosColaborador[];

  //selects
  tiposColaborador;

  //iconos
  icDescription: any = icDescription;

  //formGroup

  datosPersonales: FormGroup;
  direccion: FormGroup;
  transporte: FormGroup;

  cargasFamiliares: FormGroup;
  datosGuardarContacto: FormGroup;
  datosGenerales: FormGroup;
  datosGuardarFormacionAcademica: FormGroup;
  referenciaPersonal: FormGroup;
  datosGuardarReferenciaBancaria: FormGroup;
  datosHistorialLaboral: FormGroup;

  datosMedicos: FormGroup;
  datosContrato: FormGroup;
  datosContractuales: FormGroup;
  documentosLegales: FormGroup;
  documentosIngreso: FormGroup;
  historialLaboralInterno: FormGroup;

  @ViewChild("stepper", { static: false }) stepper: MatStepper;
  checked: boolean = true;
  visualizationMode: boolean = false;
  idRef: number = 0;

  constructor(
    private tthhColaboradorService: TTHHColaboradorService,
    private colaboradorService: ColaboradorService,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService,
    private dataService: DataService    
  ) {
    this.datosPersolesError.setErrors({ required: true });
    this.datosGuardarContactoError.setErrors({ required: true });
    this.datosFormacionAcademicaError.setErrors({ required: true });
    this.datosProcesoSeleccionError.setErrors({ required: true });
    this.datosHistorialLaboralError.setErrors({ required: true });
    this.datosReferenciaBancariaError.setErrors({ required: true });

    this.datosContratoError.setErrors({ required: true });
    this.spinner.show();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  updateDataColaborador(dataColaborador){
    
    /* if (this.router.url.includes("editar")
    ) { */
      this.colaborador["colaborador"]=dataColaborador
      this.idColaborador =dataColaborador.idColaborador;
   /*  } */
/*     console.log(dataColaborador)
    console.log(this.colaborador) */
 /*    this.datosFormacionAcademicaComponent?.asignarSelecNivelEstudio(this.colaborador.persona.idNivelEstudios)
    this.datosReferenciaBancariaComponent?.asignarReferenciaBancaria(dataColaborador.idReferenciaBancaria) */
  }

  ngAfterViewInit() {
    // child is set
    this.activatedRoute.params.subscribe((params) => {
      if (params.id) {
        this.datosPersonalesComponent.cargarDatosColaborador(params.id);
        this.linear = false;
      } else {
        this.spinner.hide();
      }
    });
  }

  ngOnInit(): void {
    this.setState(this.datosPersolesError, false);

    if (this.router.url.includes("honorarios")) {
      this.tipoColaborador = 2;
      this.tipoAdd = "honorarios";
    } else if (this.router.url.includes("redep")) {
      this.tipoColaborador = 1;
      this.tipoAdd = "redep";
    } else {
      this.tipoColaborador = 3;
      this.tipoAdd = "pasante";
    }
//NO SE SABE PARA QUE SIRVE
    if (
      !this.router.url.includes("honorarios/editar") &&
      !this.router.url.includes("redep/editar") &&
      !this.router.url.includes("pasante/editar")
    ) {
      this.getAdjuntos(0, this.tipoColaborador);
    }
 
    if (this.router.url.includes("ver")) {
      this.visualizationMode = true;
    } else {
      this.visualizationMode = false;
    }

    this.datosPersonales = this._formBuilder.group({});
    this.direccion = this._formBuilder.group({});

    this.transporte = this._formBuilder.group({});
    this.cargasFamiliares = this._formBuilder.group({});
    this.datosGuardarContacto = this._formBuilder.group({});
    this.referenciaPersonal = this._formBuilder.group({});
    this.datosGuardarReferenciaBancaria = this._formBuilder.group({});
    this.datosHistorialLaboral = this._formBuilder.group({});
    this.datosGenerales = this._formBuilder.group({});
    this.datosGuardarFormacionAcademica = this._formBuilder.group({});
    this.datosMedicos = this._formBuilder.group({});
    this.datosContractuales = this._formBuilder.group({});
    this.datosContrato = this._formBuilder.group({});
    this.documentosLegales = this._formBuilder.group({});
    this.documentosIngreso = this._formBuilder.group({});
    this.historialLaboralInterno = this._formBuilder.group({});

    /*     this.getTiposColaborador(); */
  }

  /*   getTiposColaborador() {
  
    this.colaboradorService.getTiposColaborador().subscribe(
      (data) => {
        this.spinner.hide();
        this.tiposColaborador = data.result;

        if (this.tipoAdd == "redep") {
          this.tiposColaborador = this.tiposColaborador.filter(
            (x) => x.idTipoColaborador != 2
          );
        }
      },
      (error) => {
        this.spinner.hide();
        this.utilsService.alerta("error");
      }
    );
  } */

  recibirColaborador($event) {
    this.colaborador = $event;
    if (this.colaborador?.idEntidad) {
      this.idEntidad = this.colaborador.idEntidad;
      if (this.colaborador.colaborador?.idColaborador) {
        this.idRef = this.colaborador.colaborador?.idColaborador;
      }
    } else {
      this.idEntidad = 0;
    }

    if (this.colaborador?.colaborador?.idTipoColaborador) {
      this.tipoColaborador = this.colaborador.colaborador?.idTipoColaborador;
    }
    this.getAdjuntos(this.idEntidad, this.tipoColaborador);

    if (this.idEntidad) {
      this.spinner.hide();
    }
  }

  getAdjuntos(idColaborador, idTipoColaborador) {
    this.spinner.show();
    this.tthhColaboradorService
      .getAdjuntos(idColaborador, idTipoColaborador)
      .subscribe(
        (res) => {
          this.adjuntosColaborador = res.result;
          //ordenarlos por campo orden
          this.adjuntosColaborador.sort((a, b) => {
            return a.orden - b.orden;
          });

          this.spinner.hide();
        },
        (error) => {
          this.utilsService.alerta("error", "Error al cargar los adjuntos");
          this.spinner.hide();
        }
      );
  }

  obtenerInformacionColaborador(colaborador) {
    this.tthhColaboradorService.loadColaboradorId(this.idEntidad).subscribe(
      (data) => {
        const datos=data["result"][0]
        colaborador["colaborador"]=datos;
         this.idColaborador =datos.idColaborador; 
        this.colaborador = colaborador
        this.idEntidad = this.colaborador.idEntidad;
      })
    }


  async guardarDatosPersonales() {
    if (this.visualizationMode) {
      this.stepper.next();
      return;
    }

    this.spinner.show();

    if (this.datosPersonales.valid) {
      if (this.linear && this.idRef != 0) {
        this.utilsService.alerta(
          "warning",
          "Esta persona ya se encuentra registrada"
        );
        this.spinner.hide();
        return;
      }
      this.datosPersonales.value.datosPersonales.idTipoColaborador =
        this.tipoColaborador;
      this.corregirDatos();
      try {
        const res = await this.tthhColaboradorService
          .postDatosPersonales(this.datosPersonales.value.datosPersonales)
          .toPromise();
        this.setState(this.datosPersolesError, false);
        /*   this.stepper.next(); */
        /*    this.utilsService.alerta("success"); */

        if (res.result) {
       /*    this.colaborador = res.result; */
          this.obtenerInformacionColaborador( res.result)
    /*       this.idEntidad = this.colaborador.idEntidad; */

          //crear colaborador
          const dataColaborador={
            idEntidad: this.idEntidad,
            idTipoColaborador: this.tipoColaborador,
          }
          this.tthhColaboradorService.postColaborador(dataColaborador).subscribe( (res) => {
            this.idColaborador = res.result.idColaborador;
            this.colaborador.colaborador=res.result;
            this.spinner.hide();
          },
          (error) => {
            this.utilsService.alerta("error", "Error al cargar los adjuntos");
            this.spinner.hide();
          }
        );

        
          this.guardarEliminarImagen();
        }
        this.stepper.next();
        this.spinner.hide();
      } catch (err) {
        this.setState(this.datosPersolesError, true);
        this.utilsService.alerta("error", err.error.message);

        this.spinner.hide();
        return err.error.message;
      }
    } else {
      this.errorDatosPersonales();
      this.spinner.hide();
    }
  }

  errorDatosPersonales() {
    this.stepper.previous();

    this.datosPersonales.markAllAsTouched();
    if (!this.datosPersonales.value.datosPersonales.imagenPerfil) {
      this.utilsService.alerta(
        "warning",
        "Debe seleccionar una imagen de perfil"
      );
    } else {
      this.utilsService.alerta("warning");
    }
  }
  guardarEliminarImagen() {
    if (this.datosPersonales.value.datosPersonales.adjuntoImagen) {
      if (
        this.datosPersonales.value.datosPersonales.adjuntoImagen
          .observaciones != "eliminar"
      ) {
        this.guardarImagenPerfil(
          this.idEntidad,
          this.datosPersonales.value.datosPersonales.adjuntoImagen
        );
      } else {
        //eliminar imagen
        this.eliminarImagenPerfil(
          this.idEntidad,
          this.datosPersonales.value.datosPersonales.adjuntoImagen.idAdjunto
        );
      }
    }
  }

  showAlertMultiples(form1, form2) {
    this.showAlert(form1);
    this.showAlert(form2);
  }

  showAlert(form: FormGroup) {
    let ultimoPaso = this.stepper._steps.length - 1;
    let pasoActual = this.stepper.selectedIndex;

    //si visualizationMode y es el ultimo paso entonces no hago nada
    if (this.visualizationMode && pasoActual != ultimoPaso) {
      //obtener el ultimo paso
      this.stepper.next();
      return;
    }

    if (!form.valid) {
      this.utilsService.alerta("warning");
    }

    if (this.stepper.selectedIndex == ultimoPaso && form.valid) {
      if (this.tipoAdd == "honorarios") {
        this.router.navigate(["honorarios"]);
      } else if (this.tipoAdd == "redep") {
        this.router.navigate(["redep"]);
      } else {
        this.router.navigate(["pasantes"]);
      }
    } else {
      this.stepper.next();
    }
  }

  setState(control: FormControl, state: boolean) {
    if (state) {
      control.setErrors({ required: true });
    } else {
      control.reset();
    }
  }

  corregirDatos() {
    delete this.datosPersonales.value.datosPersonales.imagenPerfil;

    if (!this.datosPersonales.value.datosPersonales.idTipoIdentificacion) {
      this.datosPersonales.value.datosPersonales.idTipoIdentificacion = 3;
    }

    if (
      this.datosPersonales.value.datosPersonales.discapacidadSustituto == 0 &&
      this.datosPersonales.value.datosPersonales.numeroCarnetConadis != null
    ) {
      this.datosPersonales.value.datosPersonales.numeroCarnetConadis = null;
      this.datosPersonales.value.datosPersonales.fechaEmisionConadis = null;
      this.datosPersonales.value.datosPersonales.porcentajeDiscapacidad = null;
      this.datosPersonales.value.datosPersonales.idTipoDiscapacidad = null;
      this.datosPersonales.value.datosPersonales.parentescoSustituto = null;
      this.datosPersonales.value.datosPersonales.idParentescoSustituto = null;
    }
  }

  guardarImagenPerfil(idColaborador: number, data) {
    this.dataService.newPostAdjunto(data,idColaborador).subscribe(
      (res) => {},
      (err) => {
        this.utilsService.alerta(
          "error",
          "Error al guardar la imagen de perfil"
        );
      }
    );
  }

  eliminarImagenPerfil(idColaborador: number, idAdjunto: number) {
    this.dataService.newDeleteAdjunto(idAdjunto).subscribe(
      (res) => {
        this.utilsService.alerta("success", "Imagen de perfil eliminada");
      },
      (err) => {
        this.utilsService.alerta(
          "error",
          "Error al eliminar la imagen de perfil"
        );
      }
    );
  }

  guardarActualizarInformacionAcademica() {
    if (this.visualizationMode) {
      this.stepper.next();
      return;
    }

    let formacion =
      this.datosGuardarFormacionAcademica.value.datosGuardarFormacionAcademica
        .titulo;
    if (
      formacion?.idNivelEstudios == 9 &&
      formacion?.titulo == "Sin especificar"
    ) {
      if (formacion.idFormacionAcademica) {
        this.guardarFormacion(formacion);
      } else {
        this.postFormacion();
      }
    }

    if (this.datosGuardarFormacionAcademica.valid) {
      this.datosGuardarFormacionAcademica.value.datosGuardarFormacionAcademica.idTipoColaborador =
        this.tipoColaborador;

      //armar un objeto con el titulo y el idNivelAcademico
      let data = {
        idNivelEstudios:
          this.datosGuardarFormacionAcademica.value
            .datosGuardarFormacionAcademica.titulo.idNivelEstudios,
        titulo:
          this.datosGuardarFormacionAcademica.value
            .datosGuardarFormacionAcademica.titulo.titulo,
      };
      if (this.datosGuardarFormacionAcademica.dirty) {
        this.utilsService
          .confirmar(
            "Actualizar formación académica culminada",
            "¿Está seguro de actualizar la formación académica culminada?"
          )
          .then((result) => {
            if (result.isConfirmed) {
              this.guardarDatosFA(  formacion,formacion.idFormacionAcademica);
            }
          });
      } else {
        this.stepper.next();
      }
    } else {
      this.utilsService.alerta("warning");
    }
  }

  private guardarDatosFA(data: { idNivelEstudios: any; titulo: any },idFormacionAcademica) {
    this.tthhColaboradorService
      .updateUltimaCulminadaFormacionAcademica(data,this.idColaborador,idFormacionAcademica)
      .subscribe(
        (res) => {
          this.setState(this.datosFormacionAcademicaError, false);
          this.colaboradorService.changeMessage(
            `idNivelEstudios : ${data.idNivelEstudios}, titulo : ${data.titulo}`
          );

          this.stepper.next();
          this.utilsService.alerta("success");
        },
        (err) => {
          this.setState(this.datosFormacionAcademicaError, true);

          this.utilsService.alerta("error");
        }
      );
  }

  private postFormacion() {
    let datoGuardar = {
      idFormacionAcademica: "",
      idNivelEstudios: 9,
      institucionEducativa: "Sin especificar",
      titulo: "Sin especificar",
      fechaInicio: "2023-01-16T19:56:26.144Z",
      fechaCulminacion: "2023-01-17T19:56:26.145Z",
      cursandoActualmente: false,
      isCurso: null,
      anioCursando: "",
      adjunto: "",
      tiempoCurso: null,
    };
    this.tthhColaboradorService
      .postFormacionAcademica(datoGuardar, this.idEntidad)
      .subscribe(
        (res) => {},
        (err) => {}
      );
  }

  private guardarFormacion(formacion: any) {
    this.tthhColaboradorService
      .updateUltimaCulminadaFormacionAcademica(
        formacion,
        this.idEntidad,
        formacion.idFormacionAcademica
      )
      .subscribe(
        (res) => {},
        (err) => {}
      );
  }

  async guardarDatosContacto() {
    try {
      this.datosGuardarContacto.value.datosGuardarContacto.idTipoColaborador =
        this.tipoColaborador;

      await this.tthhColaboradorService
        .updateContacto(
          this.datosGuardarContacto.value.datosGuardarContacto,
          this.idEntidad,
          this.datosGuardarContacto.value.datosGuardarContacto.idContacto
        )
        .toPromise();

      this.setState(this.datosGuardarContactoError, false);
    } catch (error) {
      this.setState(this.datosGuardarContactoError, true);
      this.utilsService.alerta("error");

      throw error;
    }
  }

  agregarEnTabla(component: any, tipo: string = "formacion") {
    component.openDialog(null, tipo);
  }

  agregarEnTablaReferencia(component: any) {
    component.openDialog(null);
  }

  async guardarAmbas() {
    if (this.visualizationMode) {
      this.stepper.next();
      return;
    }

    if (!this.datosHistorialLaboral.valid || !this.datosContrato.valid) {
      this.utilsService.alerta("warning");
      this.datosContrato.markAllAsTouched();
      return;
    }

    if (!this.datosHistorialLaboral.dirty && !this.datosContrato.dirty) {
      this.stepper.next();
      return;
    }

    const result = await this.utilsService.confirmar(
      "Actualizar datos",
      "¿Está seguro de actualizar los datos?"
    );

    if (result.isConfirmed) {
      await this.postInformacionlaboral();

      this.guardarDatosContrato();
    }
  }

  async postInformacionlaboral() {
    this.spinner.show();
    this.corregirDatosHistorialLaboral();
    try {
      await new Promise<void>((resolve, reject) => {
        this.tthhColaboradorService
          .putInformacionLaboral(
            this.idColaborador,
            this.datosHistorialLaboral.value.datosHistorialLaboral
          )
          .toPromise()
          .then(() => {
            this.setState(this.datosHistorialLaboralError, false);
            this.spinner.hide();
            resolve();
          })
          .catch((error) => {
            this.setState(this.datosHistorialLaboralError, true);
            this.utilsService.alerta("error");
            this.spinner.hide();

            reject(error);
          });
      });
    } catch (error) {
      this.utilsService.alerta("error");
    }
  }

  corregirDatosHistorialLaboral() {
    this.datosHistorialLaboral.value.datosHistorialLaboral.idTipoColaborador =
      this.tipoColaborador;

    delete this.datosHistorialLaboral.value.datosHistorialLaboral.adjuntosInformacionLaboral;

    if (
      this.datosHistorialLaboral.value.datosHistorialLaboral.idTipoColaborador == 2
    ) {
      this.datosHistorialLaboral.value.datosHistorialLaboral.idTipoContrato = 9;
    }

    if (
      this.datosHistorialLaboral.value.datosHistorialLaboral.idTipoColaborador == 3
    ) {
      this.datosHistorialLaboral.value.datosHistorialLaboral.idTipoContrato = 10;
    }
  }

  async guardarReferenciaBancaria() {
    if (this.datosGuardarReferenciaBancaria.valid) {
      try {
        await this.tthhColaboradorService
          .guardarDatosReferenciaBancaria(
            this.idColaborador,
            this.datosGuardarReferenciaBancaria.value
              .datosGuardarReferenciaBancaria
          )
          .toPromise();
        this.setState(this.datosReferenciaBancariaError, false);
      } catch (error) {
        this.setState(this.datosReferenciaBancariaError, true);
        this.utilsService.alerta("error");
        return error;
      }
    } else {
      this.utilsService.alerta(
        "warning",
        " Por favor, añada al menos una referencia bancaria"
      );
    }
  }
  guardarDatosContrato() {
    if (
      typeof this.datosContrato.value.datosContrato.valorAnticipo == "string" &&
      this.datosContrato.value.datosContrato.valorAnticipo != ""
    ) {
      this.setTwoNumberDecimal(
        this.datosContrato.value.datosContrato.valorAnticipo
      );
    }

    this.spinner.show();

    this.datosContrato.value.datosContrato.idTipoColaborador =
      this.tipoColaborador;
    this.tthhColaboradorService
      .guardarInformacionContrato(
        this.idColaborador,
        this.datosContrato.value.datosContrato
      )
      .subscribe(
        (res) => {
          this.setState(this.datosContratoError, false);

          //pasar a la siguiente step

          this.stepper.next();
          this.spinner.hide();

          this.utilsService.alerta("success");
        },
        (err) => {
          this.setState(this.datosContratoError, true);
          this.utilsService.alerta("error");
          this.spinner.hide();
        }
      );
  }

  setTwoNumberDecimal(value) {
    //si es string

    value = parseFloat(value.replace(/,/g, ""));

    //si tiene mas de dos decimales dejar solo dos
    if (value.toString().split(".")[1]?.length > 2) {
      value = parseFloat(
        value.toString().split(".")[0] +
          "." +
          value.toString().split(".")[1].substring(0, 2)
      );
    }
    this.datosContrato.value.datosContrato.valorAnticipo = value;
  }

  /* 
  guardarProcesoSeleccion() {
    if (this.historialLaboralInterno.valid) {
      this.colaboradorService
        .postProcesoSeleccion(
          this.idEntidad,
          this.historialLaboralInterno.value.historialLaboralInterno
        )
        .subscribe(
          (res) => {
            this.setState(this.datosProcesoSeleccionError, false);

            this.stepper.next();

            this.utilsService.alerta("success");

            if (this.tipoAdd == "honorarios") {
              this.router.navigate(["honorarios"]);
            } else {
              this.router.navigate(["redep"]);
            }
          },
          (err) => {
            this.setState(this.datosProcesoSeleccionError, true);
            this.utilsService.alerta("error");
          }
        );
    } else {
      this.historialLaboralInterno.markAllAsTouched();
      this.utilsService.alerta("warning");
    }
  } */

  async guardarMultiples() {
    if (this.visualizationMode) {
      this.stepper.next();
      return;
    }

    const formGroups = [
      this.direccion,
      this.transporte,
      this.cargasFamiliares,
      this.datosGuardarContacto,
      this.datosGuardarReferenciaBancaria,
    ];

    const dirtyFormGroups = formGroups.filter((group) => group.dirty);
    const validFormGroups = formGroups.filter((group) => group.valid);

    if (validFormGroups.length !== formGroups.length) {
      this.utilsService.alerta("warning", "Por favor, complete los campos");
      return;
    }

    //si no ha cambiado ningun campo
    if (dirtyFormGroups.length === 0) {
      this.stepper.next();
      return;
    }

    const result = await this.utilsService.confirmar(
      "Actualizar datos adicionales",
      "¿Está seguro de actualizar los datos adicionales?"
    );

    if (!result.isConfirmed) {
      return;
    }
    let errores;
    for (const group of dirtyFormGroups) {
      if (group === this.datosGuardarContacto) {
        errores = await this.guardarDatosContacto();
      } else if (group === this.datosGuardarReferenciaBancaria) {
        errores = await this.guardarReferenciaBancaria();
      }
    }

    if (errores) {
      this.utilsService.alerta(
        "error",
        "Error al actualizar datos adicionales"
      );
      return;
    } else {
      this.utilsService.alerta("success");
    }

    this.stepper.next();
  }

  scrollTop() {
    const element = document.querySelector("#scrollId");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  }
}
