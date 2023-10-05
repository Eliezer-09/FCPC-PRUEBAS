import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormGroupDirective,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import { ReplaySubject, Subject } from "rxjs";
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  take,
  takeUntil,
  tap,
} from "rxjs/operators";
import {
  ToastAlertComponent,
  Type_position,
} from "src/app/components/alerts/toast-alert/toast-alert.component";
import {
  ColaboradorPersona,
  AdjuntosColaborador,
} from "src/app/pages/colaboradores/models/colaboradores";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";

import { ColaboradorService } from "../../../../services/colaborador.service";
import { TTHHColaboradorService } from "src/app/pages/colaboradores/services/tthh-colaborador.service";
import { EntidadService } from "src/app/pages/entidad/services/entidad.service";

@Component({
  selector: "vex-datos-informacion-laboral-colaborador",
  templateUrl: "./datos-informacion-laboral-colaborador.component.html",
  styleUrls: ["./datos-informacion-laboral-colaborador.component.scss"],
})
export class DatosInformacionLaboralColaboradorComponent
  implements OnInit, OnChanges
{
  @ViewChild("toastAlertComponent") toastAlertComponent: ToastAlertComponent;
  public bankFilterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();

  edicion = false;
  searching: boolean;
  //inputs

  @Input() idColaborador: any;
  @Input() colaborador: ColaboradorPersona;
  @Input() adjuntosColaborador: AdjuntosColaborador[];
  @Input() controlView: any;
  @Input() tipoColaborador: any;
  @Input() visualizationMode: boolean = false;
  @Input() idEntidad: any;
  //form
  form: FormGroup;
  datosHistorialLaboral: FormGroup = this._formBuilder.group({
    idTipoColaborador: [null],

    codigoBiometrico: [null],

    idCargo: [null, Validators.required],

    telefono: [null, Validators.pattern("[0-9+]*")],
    extension: [null, Validators.pattern("[0-9]*")],
    correoEmpresa: [null],

    //archivos
    adjuntos: this._formBuilder.array([]),
  });

  //selects
  unidades: any[] = [];
  tiposContrato: any[] = [];
  tiposJornada: any[] = [];
  modalidadesTrabajo: any[] = [];
  areasTrabajo: any[] = [];
  listadoSupervisor;
  listadoJefes;
  listadoCargos;
  edicionActivada: boolean = false;
  listadoTemporal: any;

  constructor(
    private colaboradorService: ColaboradorService,
    private _formBuilder: FormBuilder,
    private ctrlContainer: FormGroupDirective,
    private utilService: UtilsService,
    private tthhColaboradorService: TTHHColaboradorService,
    private entidadService: EntidadService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.colaborador) {
      if (this.colaborador && this.colaborador.colaborador) {
          this.asignarValoresFormulario();
      } else {
        this.datosHistorialLaboral.reset();
      }
    }
    if (changes.adjuntosColaborador?.currentValue) {
      this.obtenerAdjuntos();
    }
  }

  ngOnInit(): void {
    this.form = this.ctrlContainer.form;
    this.form.addControl("datosHistorialLaboral", this.datosHistorialLaboral);
    this.cargarSelects();
    this.bankFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy), distinctUntilChanged())
      .subscribe((filteredBanks) => {
        this.filtroCargos(filteredBanks);
      });
      this.asignarValoresFormulario();  
  }

  protected filtroCargos(value) {
    //si filtro es vacio dejar el listado original, sino filtrar
    if (!value) {
      this.listadoTemporal = this.listadoCargos;
      return;
    }

    this.listadoTemporal = this.listadoCargos.filter((cargo) => {
      return cargo.descripcion.toLowerCase().includes(value.toLowerCase());
    });
  }

  asignarValoresFormulario() {
    this.datosHistorialLaboral.patchValue({
      idTipoColaborador: this.colaborador.colaborador?.idTipoColaborador
        ? this.colaborador.colaborador.idTipoColaborador
        : null,
      idSupervisor: this.colaborador.colaborador?.idSupervisor
        ? this.colaborador.colaborador.idSupervisor
        : null,
      idJefeInmediato: this.colaborador.colaborador?.idJefeInmediato
        ? this.colaborador.colaborador.idJefeInmediato
        : null,
      codigoBiometrico: this.colaborador.colaborador?.codigoBiometrico
        ? this.colaborador.colaborador.codigoBiometrico
        : null,
      idDepartamento: this.colaborador.colaborador?.idDepartamento
        ? this.colaborador.colaborador.idDepartamento
        : null,
      idArea: this.colaborador.colaborador?.idArea
        ? this.colaborador.colaborador.idArea
        : null,
      idCargo: this.colaborador.colaborador?.idCargo
        ? this.colaborador.colaborador.idCargo
        : null,
      telefono: this.colaborador.colaborador?.telefono
        ? this.colaborador.colaborador.telefono
        : null,
      extension: this.colaborador.colaborador?.extension
        ? this.colaborador.colaborador.extension
        : null,
      correoEmpresa: this.colaborador.colaborador?.correoEmpresa
        ? this.colaborador.colaborador.correoEmpresa
        : null,
      servicioProducto: this.colaborador.proveedor?.servicioProducto
        ? this.colaborador.proveedor.servicioProducto
        : null,
    });
  }
  cargarSelects() {
    this.entidadService.getCargosBuscador().subscribe(
      (data) => {
        this.listadoCargos = data.result;
        this.listadoTemporal = data.result;
      },
      (error) => {
        new ToastAlertComponent(
          "error",
          "Error al cargar los cargos",
          Type_position.TOP,
          true,
          1500
        );
      }
    );
  }

  get adjuntos() {
    return this.datosHistorialLaboral.controls["adjuntos"] as FormArray;
  }

  obtenerAdjuntos() {
    //eliminar los datos de adjuntos
    this.adjuntos.clear();

    this.adjuntosColaborador.forEach((element: AdjuntosColaborador) => {
      if (element.nombreSeccion == this.controlView) {
        let adjunto = this._formBuilder.group({
          nombre: [element.nombreAdjunto],
          archivos: [
            element.archivos ? element.archivos : null,
            element.esRequerido ? Validators.required : null,
          ],
        });

        this.adjuntos.push(adjunto);
      }
    });
  }
}
