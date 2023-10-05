import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormGroupDirective,
  Validators,
  FormArray,
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
import { MatDialog } from "@angular/material/dialog";

import {
  AdjuntosColaborador,
  ColaboradorPersona,
} from "src/app/pages/colaboradores/models/colaboradores";
import { MY_FORMATS } from "src/app/pages/colaboradores/utils/my-date-form";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";
import { ColaboradorService } from "../../../../services/colaborador.service";

@Component({
  selector: "vex-historial-interno-colaborador",
  templateUrl: "./historial-interno-colaborador.component.html",
  styleUrls: ["./historial-interno-colaborador.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class HistorialInternoColaboradorComponent implements OnInit, OnChanges {
  @Input() idColaborador: any;
  @Input() colaborador: ColaboradorPersona;
  @Input() adjuntosColaborador: AdjuntosColaborador[];
  @Input() controlView: any;
  @Input() tipoColaborador: any;

  //forms
  form: FormGroup;
  historialLaboralInterno: FormGroup = this._formBuilder.group({
    idFormaReclutamiento: ["", Validators.required],
    fechaReclutamiento: ["", Validators.required],
    fechaSeleccion: ["", Validators.required],
    conocePersonalCte: ["", Validators.required],

    observaciones: [""],
    adjuntos: this._formBuilder.array([]),
  });

  //selects
  formasRelutamiento;
  constructor(
    public colaboradorService: ColaboradorService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private ctrlContainer: FormGroupDirective,
    private utilsService: UtilsService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.colaborador?.currentValue) {
      this.asignarValoresFormulario();
    }
    if (this.idColaborador == 0) {
      this.historialLaboralInterno.reset();
    }

    if (changes.adjuntosColaborador?.currentValue) {
      this.obtenerAdjuntos();
    }
  }

  ngOnInit(): void {
    this.form = this.ctrlContainer.form;
    this.form.addControl(
      "historialLaboralInterno",
      this.historialLaboralInterno
    );
    this.getSelects();
  }

  getSelects() {
    this.colaboradorService.getFormasReclutamiento().subscribe(
      (data) => {
        this.formasRelutamiento = data.result;
      },
      (error) => {
        this.utilsService.alerta(
          error,
          "Error al obtener las formas de reclutamiento"
        );
      }
    );
  }

  asignarValoresFormulario() {
    if (this.colaborador.colaborador) {
      this.historialLaboralInterno.patchValue({
        idFormaReclutamiento: this.colaborador.colaborador.idFormaReclutamiento,
        fechaReclutamiento: this.colaborador.colaborador.fechaReclutamiento,
        fechaSeleccion: this.colaborador.colaborador.fechaSeleccion,
        conocePersonalCte: this.colaborador.colaborador.conocePersonalCte,
        observaciones: this.colaborador.colaborador.observaciones,
      });
    }
  }

  get adjuntos() {
    return this.historialLaboralInterno.controls["adjuntos"] as FormArray;
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
