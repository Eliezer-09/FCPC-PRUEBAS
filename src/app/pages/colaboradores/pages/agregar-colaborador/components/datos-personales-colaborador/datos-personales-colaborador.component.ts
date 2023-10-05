import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from "@angular/forms";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { Router } from "@angular/router";
import { Observable, ReplaySubject, Subject } from "rxjs";
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  takeUntil,
  tap,
} from "rxjs/operators";

import {
  AdjuntosColaborador,
  ColaboradorPersona,
  EstadoCivil,
  Genero,
  Nacionalidades,
  TipoIdentificacion,
} from "src/app/pages/colaboradores/models/colaboradores";
import { MY_FORMATS } from "src/app/pages/colaboradores/utils/my-date-form";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";
import { DataService } from "src/app/services/data.service";
import { iconify } from "src/static-data/icons";

import { ColaboradorService } from "../../../../services/colaborador.service";
import { ValidatorsService } from "src/app/services/validators.service";
import { TTHHColaboradorService } from "src/app/pages/colaboradores/services/tthh-colaborador.service";

@Component({
  selector: "vex-datos-personales-colaborador",
  templateUrl: "./datos-personales-colaborador.component.html",
  styleUrls: ["./datos-personales-colaborador.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DatosPersonalesColaboradorComponent implements OnInit, OnChanges {
  avatarUrl?: string | null =
    "../../../../../../../../assets/img/sinPerfil.jpg";
  file: any;
  loading = false;

  @Input() idColaborador: any;
  @Input() tipoColaborador: any;
  @Input() adjuntosColaborador: AdjuntosColaborador[];
  @Input() controlView: any;
  @Input() visualizationMode: boolean = false;
  @Output() dataColaborador = new EventEmitter<any>();
  @Output() colaborador: EventEmitter<ColaboradorPersona> =
    new EventEmitter<ColaboradorPersona>();

  //select
  tiposID: TipoIdentificacion[] = [];
  nacionalidades: Nacionalidades[] = [];
  actividadesEconomicas: any;
  public tipoTareaFilterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();

  public filteredTipoTarea;

  estadosCivil: EstadoCivil[] = [];
  generos: Genero[] = [];
  clasesContribuyentes;
  selectTipoColaborador = [
    { value: 1, descripcion: "Discapacitado" },
    { value: 2, descripcion: "Sustituto" },
    { value: 0, descripcion: "No aplica" },
  ];

  maxlengthIdentificacion = 20;

  tiposDiscapacidad;
  //forms
  form: FormGroup;
  datosPersonales: FormGroup = this._formBuilder.group({
    id: [0],
    nombres: [
      null,
      [
        Validators.required,
        Validators.pattern(this.validatorsService.soloLetrasVocalesPattern),
      ],
    ],
    apellidos: [
      null,
      [
        Validators.required,
        Validators.pattern(this.validatorsService.soloLetrasVocalesPattern),
      ],
    ],
    nombrePila: [null],

    fechaNacimiento: [null, this.validatorsService.fechaNacimientoValidator],
    imagenPerfil: [null, Validators.required],
    idTipoIdentificacion: [null, Validators.required],
    identificacion: [
      null,
      [
        Validators.required,
        Validators.pattern(this.validatorsService.soloNumerosPattern),
      ],
    ],
    lugarNacimiento: [null, Validators.required],
    idNacionalidad: [null, Validators.required],
    idGenero: [null, Validators.required],
    idEstadoCivil: [null, Validators.required],
    tieneHijos: ["", Validators.required],
    correo1: [
      null,
      [Validators.required, this.validatorsService.emailFormatValidator],
    ],
    celular: [null, [Validators.required, Validators.pattern("^[0-9+]*$")]],
    telefono2: [
      null,
      [Validators.pattern(this.validatorsService.soloNumerosPattern)],
    ],
    telefono1: [
      "0",
      [Validators.pattern(this.validatorsService.soloNumerosPattern)],
    ],
    operadoraMovil: [null],
    edad: [{ value: "", disabled: true }],
    idActividadEconomica: [null, [Validators.required]],
    adjuntoImagen: [""],
    numeroCarnetConadis: [""],
    fechaEmisionConadis: [null],
    porcentajeDiscapacidad: [null],

    idTipoDiscapacidad: [null],

    discapacidadSustituto: [null],
    idParentescoSustituto: [null],
    adjuntos: this._formBuilder.array([]),
  });

  //iconos
  icUpload = iconify.icroundFileUpload;
  icDelete = iconify.icroundDelete;
  adjuntoImagenPerfil: AdjuntosColaborador;
  tiposParentesco;
  idTipoIdentificacion: number;
  operadoras: any;
  searching: boolean;
  ciudadesEcuador = [
    "Quito",
    "Guayaquil",
    "Cuenca",
    "Ambato",
    "Manta",
    "Loja",
    "Portoviejo",
    "Esmeraldas",
    "Ibarra",
    "Machala",
    "Santo Domingo de los Colorados",
    "Quevedo",
    "Riobamba",
    "Tulcán",
    "Latacunga",
    "Milagro",
    "Santa Elena",
    "Zamora",
    "La Libertad",
    "Sangolquí",
    "Nueva Loja",
    "Babahoyo",
    "Azogues",
    "Huaquillas",
    "Chone",
    "Jipijapa",
    "Puerto Francisco de Orellana",
    "Vinces",
    "Montecristi",
    "Yaguachi",
    "Tena",
    "La Troncal",
    "Balzar",
    "Pinas",
    "Boca Suno",
    "El Triunfo",
    "Catamayo",
    "Guaranda",
    "Pedro Carbo",
    "Macas",
    "Calceta",
    "Santa Rosa",
    "Cayambe",
    "Puyo",
    "Sucre",
    "San Miguel de los Bancos",
    "Salinas",
    "Jaramijó",
    "San Gabriel",
    "Gualaceo",
    "La Mana",
    "Pujilí",
    "Samborondón",
    "Cotacachi",
    "Machachi",
    "Puerto Ayora",
    "Banos de Agua Santa",
    "Ambuquí",
    "Alausí",
    "San Lorenzo",
    "Tosagua",
    "Catarama",
    "Chordeleg",
    "Tosagua",
    "Alfredo Baquerizo Moreno",
    "San Vicente",
    "Cariamanga",
    "Pillaro",
    "Santa Ana",
    "Lomas de Sargentillo",
    "Paute",
    "San Cristóbal",
    "Zaruma",
    "Cayambe",
    "Caluma",
    "Buena Fe",
    "San Miguel",
    "Piñas",
    "Olmedo",
    "Pedernales",
    "Santo Domingo de los Tsáchilas",
    "Puerto Bolívar",
    "Durán",
    "Naranjito",
    "El Empalme",
    "Pajan",
    "San Juan Bosco",
    "Colimes",
    "Quinsaloma",
    "La Concordia",
  ];

  filteredOptions: Observable<any[]>;

  constructor(
    private dataService: DataService,
    private _formBuilder: FormBuilder,
    private ctrlContainer: FormGroupDirective,
    private colaboradorService: ColaboradorService,
    public utilsService: UtilsService,
    private router: Router,
    private validatorsService: ValidatorsService,
    private tthhColaboradorService: TTHHColaboradorService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.adjuntosColaborador?.currentValue) {
      this.obtenerAdjunto();
    }
    if (changes.tipoColaborador) {
      this.cambiarCamposRequeridos(changes.tipoColaborador.currentValue);
    }

    if (changes.idColaborador?.currentValue) {
      this.datosPersonales.patchValue({
        id: changes.idColaborador.currentValue,
      });
    }
  }

  ngOnInit(): void {
    this.form = this.ctrlContainer.form;
    this.form.addControl("datosPersonales", this.datosPersonales);

    this.cargarCatalogos();

    if (this.router.url.includes("honorarios")) {
      this.idTipoIdentificacion = 3;
    } else {
      this.idTipoIdentificacion = 1;
    }

    this.filteredOptions =
      this.datosPersonales.controls.lugarNacimiento.valueChanges.pipe(
        startWith(""),
        map((value) => this._filter(value || ""))
      );

    this.tipoTareaFilterCtrl.valueChanges
      .pipe(
        filter((search) => !!search),
        takeUntil(this._onDestroy),
        debounceTime(250),
        distinctUntilChanged(),
        delay(500),
        tap(() => (this.searching = true))
      )

      .subscribe((filteredBanks) => {
        this.filterTipoTarea(filteredBanks);
      });
  }

  private _filter(value: any): any[] {
    const filterValue = value?.toLowerCase();

    return this.ciudadesEcuador.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  isValidField(form: FormGroup, field: string) {
    return this.validatorsService.isValidField(form, field);
  }

  getFieldErrorMessage(form: FormGroup, field: string): string {
    return this.validatorsService.getFieldErrorMessage(form, field);
  }

  protected filterTipoTarea(value) {
    this.filteredTipoTarea = [];
    if (!value || value.length < 2 || value == " ") {
      this.filteredTipoTarea = [];
      this.searching = false;
      return;
    }

    this.colaboradorService.getActividadesEconomicas(value).subscribe(
      (data) => {
        this.filteredTipoTarea = data.result;
        this.searching = false;
      },
      (error) => {
        this.utilsService.alerta(
          "error",
          "Error al obtener actividades económicas "
        );
        this.searching = false;
      }
    );
  }

  obtenerAdjunto() {
   /*  this.adjuntoImagenPerfil = this.adjuntosColaborador.find(
      (x) => x.idTipoAdjunto == 89
    ); */
    const adjunto=this.adjuntosColaborador.filter(
      (x) => x.idTipoAdjunto == 89
    );
   
      
    this.dataService.getInfoAdjunto(adjunto).subscribe(res=>{
    const dataAdjunto=res["result"][0]
    if(dataAdjunto.url){
      this.avatarUrl=dataAdjunto.url
    this.datosPersonales.get("imagenPerfil").setValue(this.avatarUrl);
    }
     this.adjuntoImagenPerfil =dataAdjunto
    })

    //tomar el ultimo this.adjuntoImagenPerfil.archivos

  /*   if (
      this.adjuntoImagenPerfil.archivos[
        this.adjuntoImagenPerfil.archivos.length - 1
      ]?.url
    ) {


      this.avatarUrl =
        this.adjuntoImagenPerfil.archivos[
          this.adjuntoImagenPerfil.archivos.length - 1
        ].url; 
       this.datosPersonales.get("imagenPerfil").setValue(this.avatarUrl); 
    }*/
  }
  cargarDatosColaborador(identificacion: string = null) {
    let parametro;

    if (identificacion) {
      parametro = identificacion;
    } else {
      parametro = this.datosPersonales.get("identificacion").value;
      //si parametro no es mayor a 10 digitos no se hace la consulta
      if (parametro.length < 10) {
        return;
      }
    }

    this.tthhColaboradorService
      .getDatosPersonales(parametro, this.idTipoIdentificacion)
      .subscribe(
        (data) => {
          let colaborador: ColaboradorPersona = data.result;
          if (data.result) {
            if (colaborador.persona) {
              this.datosPersonales.patchValue({
                nombrePila: this.utilsService.capitalize(
                  colaborador.persona.nombrePila
                ),
                idGenero: colaborador.persona.idGenero,
                idEstadoCivil: colaborador.persona.idEstadoCivil,
                discapacidadSustituto:
                  colaborador.persona.discapacidadSustituto,
                tieneHijos: colaborador.persona.tieneHijos,
                idParentescoSustituto:
                  colaborador.persona.idParentescoSustituto,
                idTipoDiscapacidad: colaborador.persona.idTipoDiscapacidad,
                numeroCarnetConadis: colaborador.persona.numeroCarnetConadis,
                fechaEmisionConadis: colaborador.persona.fechaEmisionConadis,
                porcentajeDiscapacidad:
                  colaborador.persona.porcentajeDiscapacidad,
              });

              this.onTipoColaboradorDiscapacidad(
                this.datosPersonales.get("discapacidadSustituto").value
              );
            }

            this.datosPersonales.patchValue({
              id: colaborador.idEntidad,
              //primera letra en mayuscula
              nombres: this.utilsService.capitalize(colaborador.nombres),
              apellidos: this.utilsService.capitalize(colaborador.apellidos),

              //  discapacidadSustituto: colaborador.colaborador?.discapacidadSustituto,
              fechaNacimiento: colaborador.fechaNacimiento,
              idTipoIdentificacion: colaborador.idTipoIdentificacion,
              identificacion: colaborador.identificacion,
              lugarNacimiento: colaborador.lugarNacimiento,
              idActividadEconomica: colaborador.idActividadEconomica,
              idNacionalidad: colaborador.idNacionalidad,
              correo1: colaborador.correo1,
              celular: colaborador.celular,
              telefono2: colaborador.telefono2,
              telefono1: colaborador.telefono1,
              operadoraMovil: colaborador.operadoraMovil,
            });

            if (colaborador.idActividadEconomica) {
              this.colaboradorService
                .getActividadesEconomicas("", colaborador.idActividadEconomica)
                .subscribe(
                  (data) => {
                    this.filteredTipoTarea = data.result;
                    this.searching = false;
                  },
                  (error) => {
                    this.searching = false;
                  }
                );
            }

            this.calcularEdad(
              this.datosPersonales.get("fechaNacimiento").value
            );
          } else {
            //si existe una id de colaborador y no se encuentra el colaborador
            if (this.datosPersonales.get("id").value != 0) {
              this.datosPersonales.patchValue({
                id: 0,
                nombres: null,
                apellidos: null,
                nombrePila: null,

                fechaNacimiento: null,
                imagenPerfil: null,
                idActividadEconomica: null,

                celular: null,

                lugarNacimiento: null,
                idNacionalidad: null,
                idGenero: null,
                idEstadoCivil: null,
                tieneHijos: "",
                correo1: null,
                telefono2: null,
                telefono1: "0",
                operadoraMovil: null,
                edad: "",
                adjuntoImagen: "",
                numeroCarnetConadis: "",
                fechaEmisionConadis: null,
                porcentajeDiscapacidad: null,
                idTipoDiscapacidad: null,
                discapacidadSustituto: null,
                idParentescoSustituto: null,
              });

              this.avatarUrl =
                "../../../../../../../../assets/img/sinPerfil.jpg";
            }
          }
          this.colaborador.emit(colaborador);
          //poner todos los campos en blanco
          this.cambiarValidaciones(
            this.datosPersonales.get("idTipoIdentificacion").value
          );

          this.obtenerInformacionColaborador( colaborador.idEntidad)
          this.loading = false;
        },
        (error) => {
          this.loading = false;

          this.utilsService.alerta(
            "error",
            "Error al obtener los datos de la persona"
          );
        }
      );
  }

  infoColaborador;
  obtenerInformacionColaborador(idEntidad) {
    this.tthhColaboradorService.loadColaboradorId(idEntidad).subscribe(
      (data) => {
        const datos=data["result"][0]
        this.infoColaborador=datos
        this.dataColaborador.emit(this.infoColaborador)
        this.idColaborador =datos.idColaborador;
      })
    }

  cambiarCamposRequeridos(tipoColaborador: number) {
    if (tipoColaborador == 2) {
      //si ruc esta disable() entonces se debe habilitar

      this.datosPersonales.get("discapacidadSustituto").disable();

      this.datosPersonales.get("idTipoIdentificacion").setValue(3);
      this.cambiarValidaciones(3);
      this.datosPersonales.get("idTipoIdentificacion").disable();

      this.datosPersonales.get("idActividadEconomica").enable();
      this.datosPersonales
        .get("idActividadEconomica")
        .setValidators([Validators.required]);
    }

    if (tipoColaborador == 1) {
      this.datosPersonales.get("discapacidadSustituto").enable();

      this.datosPersonales.get("idTipoIdentificacion").enable();
      this.datosPersonales.get("idActividadEconomica").disable();
    }
    if (tipoColaborador == 3) {
      this.datosPersonales.get("discapacidadSustituto").disable();

      this.datosPersonales.get("idTipoIdentificacion").enable();
      this.datosPersonales.get("idActividadEconomica").disable();
    }

    this.datosPersonales.controls.idActividadEconomica.updateValueAndValidity();
    this.datosPersonales.controls.idTipoIdentificacion.updateValueAndValidity();
    this.datosPersonales.controls.discapacidadSustituto.updateValueAndValidity();
  }

  cambiarValidaciones(tipoColaborador: number) {
    if (tipoColaborador == 2) {
      this.datosPersonales
        .get("identificacion")
        .setValidators([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9]*$"),
        ]);

      this.datosPersonales.controls.identificacion.updateValueAndValidity();
    }

    if (tipoColaborador == 3) {
      this.datosPersonales
        .get("identificacion")
        .setValidators([
          Validators.required,
          Validators.pattern(this.validatorsService.soloNumerosPattern),
          Validators.minLength(13),
          Validators.maxLength(13),
        ]);

      this.datosPersonales.controls.identificacion.updateValueAndValidity();
    }

    if (tipoColaborador == 1) {
      this.datosPersonales
        .get("identificacion")
        .setValidators([
          Validators.required,
          Validators.pattern(this.validatorsService.soloNumerosPattern),
          Validators.minLength(10),
          Validators.maxLength(10),
        ]);

      this.datosPersonales.controls.identificacion.updateValueAndValidity();
    }
    if (tipoColaborador == 4) {
      this.datosPersonales
        .get("identificacion")
        .setValidators([
          Validators.required,
          Validators.pattern(this.validatorsService.soloNumerosPattern),
        ]);

      this.datosPersonales.controls.identificacion.updateValueAndValidity();
    }
  }
  cargarCatalogos() {
    this.tthhColaboradorService.getIdentificadores().subscribe(
      (data) => {
        //si   this.tipoColaborador es 1 entocnes quitar idTipoIdentificacion 3
        if (this.tipoColaborador == 1 || this.tipoColaborador == 3) {
          data = data.filter((x) => x.idTipoIdentificacion != 3);
        }

        this.tiposID = data;
      },
      (error) => {
        this.utilsService.alerta(
          "error",
          "Error al cargar tipos de identificación"
        );
      }
    );

    this.tthhColaboradorService.getNacionalidades().subscribe(
      (data) => {
        this.nacionalidades = data;
      },
      (error) => {
        this.utilsService.alerta("error", "Error al cargar las nacionalidades");
      }
    );

    this.tthhColaboradorService.getGeneros().subscribe(
      (data) => {
        this.generos = data;
      },
      (error) => {
        this.utilsService.alerta("error", "Error al cargar los tipos generos");
      }
    );

    this.tthhColaboradorService.getEstadosCivil().subscribe(
      (data) => {
        this.estadosCivil = data;
      },
      (error) => {
        this.utilsService.alerta(
          "error",
          "Error al cargar los tipos estados civil"
        );
      }
    );

    this.tthhColaboradorService.getTiposDiscapacidad().subscribe(
      (data) => {
        this.tiposDiscapacidad = data.result;
      },
      (error) => {
        this.utilsService.alerta(
          "error",
          "Error al cargar los tipos de discapacidad"
        );
      }
    );

    this.tthhColaboradorService.getTiposParentesco().subscribe(
      (data) => {
        this.tiposParentesco = data;
      },
      (error) => {
        this.utilsService.alerta(
          "error",
          "Error al cargar los tipos de parentesco"
        );
      }
    );

    this.colaboradorService.getOperadoras().subscribe(
      (data) => {
        this.operadoras = data.result;
      },
      (error) => {
        this.utilsService.alerta("error", "Error al cargar las operadoras");
      }
    );
  }

  calcularEdad($event: any) {
    let fechaNacimiento = new Date($event);
    let fechaActual = new Date();
    //la fecha de nacimiento no puede ser mayor a la fecha actual - 18 años
    if (fechaNacimiento > fechaActual) {
      this.datosPersonales.controls.fechaNacimiento.setErrors({
        incorrect: true,
      });
      return;
    }

    let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
    let mes = fechaActual.getMonth() - fechaNacimiento.getMonth();
    if (
      mes < 0 ||
      (mes === 0 && fechaActual.getDate() < fechaNacimiento.getDate())
    ) {
      edad--;
    }
    this.datosPersonales.controls.edad.setValue(edad);

    if (edad < 15) {
      this.datosPersonales.controls.fechaNacimiento.setErrors({
        incorrect: true,
      });
    }
  }

  imagePreview(event: any) {
    if (this.datosPersonales.get("imagenPerfil").value) {
      this.dataService
        .newDeleteAdjunto(
          this.adjuntoImagenPerfil.archivos[0].idAdjunto
        )
        .subscribe();
    }
    this.file = event.target.files[0];

    this.dataService.getBase64(this.file).then((res: string) => {
      this.datosPersonales.controls.adjuntoImagen.setValue({
        tipoAdjunto: 89,
        name: this.file.name,
        mimeType: this.file.type.split("/")[1],
        adjunto: res,
        observaciones: "avatar",
      });
      this.datosPersonales.controls.imagenPerfil.setValue(res);
    });

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarUrl = reader.result as string;
    };
    reader.readAsDataURL(this.file);
  }
  deleteImage() {
    if (this.avatarUrl.includes("https://easyfcpc")) {
      this.datosPersonales.controls.adjuntoImagen.setValue({
        idAdjunto: this.adjuntoImagenPerfil["idAdjunto"],
        observaciones: "eliminar",
      });
    } else {
      this.datosPersonales.controls.adjuntoImagen.setValue(null);
    }
    this.avatarUrl = "../../../../../../../../assets/img/sinPerfil.jpg";
    this.file = null;
    this.datosPersonales.controls.imagenPerfil.setValue(null);
  }

  onTipoColaboradorDiscapacidad($event: any) {
    if ($event == 1 || $event == 2) {
      this.onDiscapacidadChange(true);
    } else {
      this.onDiscapacidadChange(false);
    }
  }

  onDiscapacidadChange($event: any) {
    if ($event) {
      this.datosPersonales.controls.numeroCarnetConadis.setValidators([
        Validators.required,
        Validators.pattern(this.validatorsService.soloNumerosPattern),
      ]);
      this.datosPersonales.controls.numeroCarnetConadis.updateValueAndValidity();
      this.datosPersonales.controls.fechaEmisionConadis.setValidators([
        Validators.required,
      ]);
      this.datosPersonales.controls.fechaEmisionConadis.updateValueAndValidity();
      this.datosPersonales.controls.idTipoDiscapacidad.setValidators([
        Validators.required,
      ]);
      this.datosPersonales.controls.idTipoDiscapacidad.updateValueAndValidity();

      this.datosPersonales.controls.porcentajeDiscapacidad.setValidators([
        Validators.required,
        //solo ingreso maximo 5 digitos y maximo 2 decimales
        Validators.max(100),
        //maximo 2 decimales
        Validators.pattern("^[0-9]+(.[0-9]{1,2})?$"),
      ]);

      this.datosPersonales.controls.porcentajeDiscapacidad.updateValueAndValidity();

      //si idParentescoSustituto es 2
      if (this.datosPersonales.get("discapacidadSustituto").value == 2) {
        this.datosPersonales.controls.idParentescoSustituto.setValidators([
          Validators.required,
        ]);
        this.datosPersonales.controls.idParentescoSustituto.updateValueAndValidity();
      } else {
        this.datosPersonales.controls.idParentescoSustituto.clearValidators();
        this.datosPersonales.controls.idParentescoSustituto.updateValueAndValidity();
      }
    } else {
      this.datosPersonales.get("numeroCarnetConadis").clearValidators();
      this.datosPersonales.get("numeroCarnetConadis").updateValueAndValidity();

      this.datosPersonales.controls.fechaEmisionConadis.clearValidators();

      this.datosPersonales.controls.fechaEmisionConadis.updateValueAndValidity();
      this.datosPersonales.controls.idTipoDiscapacidad.clearValidators();
      this.datosPersonales.controls.idTipoDiscapacidad.updateValueAndValidity();
      this.datosPersonales.controls.porcentajeDiscapacidad.clearValidators();
      this.datosPersonales.controls.porcentajeDiscapacidad.updateValueAndValidity();

      this.datosPersonales.controls.idParentescoSustituto.clearValidators();
      this.datosPersonales.controls.idParentescoSustituto.updateValueAndValidity();
    }
  }

  get adjuntos() {
    return this.datosPersonales.controls["adjuntos"] as FormArray;
  }

  obtenerAdjuntos() {
    this.adjuntos.clear();

    this.adjuntosColaborador.forEach((element: AdjuntosColaborador) => {
      if (element.nombreSeccion == this.controlView) {
        let adjunto = this._formBuilder.group({
          nombre: [element.nombreAdjunto],
          archivos: [
            element.archivos.length > 0 ? element.archivos : null,
            element.esRequerido ? Validators.required : null,
          ],
        });

        this.adjuntos.push(adjunto);
      }
    });
  }
}
